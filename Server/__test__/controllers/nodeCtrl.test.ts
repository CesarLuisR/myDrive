// import { createNode } from '../../src/controllers/nodeCtrl';
// import { createNodeService } from '../../src/services/nodeServices';
// import { storageFileService } from '../../src/services/storageFileService';
// import { createUniqueFileName } from '../../src/utils/createUniqueName';
// import { Request, Response } from 'express';
// import { TokenPayload } from "../../src/utils/token";

// jest.mock('../services/nodeServices');
// jest.mock('../services/storageFileService');
// jest.mock('../utils/createUniqueName');

// const mockCreateNodeService = createNodeService as jest.Mock;
// const mockStorageFileService = storageFileService as jest.Mock;
// const mockCreateUniqueFileName = createUniqueFileName as jest.Mock;

// interface MockRequest extends Request {
//   user?: TokenPayload; // O { id: string; } si TokenPayload es más complejo y solo necesitas el ID aquí
//   file?: Express.Multer.File;
// }

// describe('createNode Controller', () => {
//   // Define un Request y Response simulados para cada test
//   let mockRequest: MockRequest;
//   let mockResponse: Partial<Response>;
//   let resStatusSpy: jest.SpyInstance;
//   let resJsonSpy: jest.SpyInstance;

//   beforeEach(() => {
//     // Limpia los mocks y restablece sus implementaciones predeterminadas
//     mockCreateNodeService.mockClear();
//     mockStorageFileService.mockClear();
//     mockCreateUniqueFileName.mockClear();

//     // Configura Request y Response simulados
//     mockRequest = {
//       body: {},
//       user: { id: 'test-user-id' }, // Asume que el usuario está autenticado
//       file: undefined, // Por defecto, sin archivo
//     } as MockRequest;
//     mockResponse = {
//       status: jest.fn().mockReturnThis(), // Permite encadenar .status().json()
//       json: jest.fn(),
//     };
//     resStatusSpy = jest.spyOn(mockResponse, 'status');
//     resJsonSpy = jest.spyOn(mockResponse, 'json');

//     // Mocks predeterminados para funciones que deben existir
//     mockCreateNodeService.mockResolvedValue({}); // createNodeService siempre resuelve por defecto
//     mockStorageFileService.mockResolvedValue({ // storageFileService siempre resuelve con datos de S3
//       Location: 'mock-s3-location',
//       Key: 'mock-s3-key',
//     });
//     mockCreateUniqueFileName.mockReturnValue('mock-generated-file-key'); // createUniqueFileName siempre devuelve una clave
//   });

//   // --- TEST: Validaciones Iniciales ---
//   it('should return 400 if name or type are missing', async () => {
//     mockRequest.body = { description: 'test' }; // Faltan name y type

//     await createNode(mockRequest as Request, mockResponse as Response);

//     expect(resStatusSpy).toHaveBeenCalledWith(400);
//     expect(resJsonSpy).toHaveBeenCalledWith({ message: 'Name and type are required.' });
//     expect(mockCreateNodeService).not.toHaveBeenCalled();
//     expect(mockStorageFileService).not.toHaveBeenCalled();
//   });

//   it('should return 400 if type is invalid', async () => {
//     mockRequest.body = { name: 'invalid-node', type: 'invalidType' };

//     await createNode(mockRequest as Request, mockResponse as Response);

//     expect(resStatusSpy).toHaveBeenCalledWith(400);
//     expect(resJsonSpy).toHaveBeenCalledWith({ message: "Invalid node type. Must be 'file' or 'folder'." });
//     expect(mockCreateNodeService).not.toHaveBeenCalled();
//   });

//   it('should return 500 if user ID is missing (authentication error)', async () => {
//     mockRequest.user = undefined; // Simula usuario no autenticado o ID faltante
//     mockRequest.body = { name: 'test', type: 'folder' };

//     await createNode(mockRequest as Request, mockResponse as Response);

//     expect(resStatusSpy).toHaveBeenCalledWith(500);
//     expect(resJsonSpy).toHaveBeenCalledWith({ message: 'Internal server error' });
//     expect(mockCreateNodeService).not.toHaveBeenCalled();
//   });

//   // --- TEST: Creación de Carpeta ---
//   it('should create a folder successfully', async () => {
//     const folderData = {
//       name: 'New Folder',
//       description: 'A test folder',
//       parent_id: 'parent-folder-id',
//       type: 'folder',
//     };
//     mockRequest.body = folderData;

//     await createNode(mockRequest as Request, mockResponse as Response);

//     expect(mockCreateNodeService).toHaveBeenCalledTimes(1);
//     expect(mockCreateNodeService).toHaveBeenCalledWith({
//       user_id: mockRequest.user?.id,
//       parent_id: folderData.parent_id,
//       name: folderData.name,
//       description: folderData.description,
//       type: 'folder',
//       storage_location: null, // Las carpetas no tienen ubicación de almacenamiento en S3
//       mime_type: null,
//       file_size: null,
//     });
//     expect(resStatusSpy).toHaveBeenCalledWith(200);
//     expect(resJsonSpy).toHaveBeenCalledWith({ message: 'Folder created successfully' });
//     expect(mockStorageFileService).not.toHaveBeenCalled(); // No se llama para carpetas
//   });

//   // --- TEST: Subida de Archivo ---
//   it('should return 400 if type is file but no file is provided', async () => {
//     mockRequest.body = { name: 'test-file', type: 'file' };
//     mockRequest.file = undefined; // No se adjunta ningún archivo

//     await createNode(mockRequest as Request, mockResponse as Response);

//     expect(resStatusSpy).toHaveBeenCalledWith(400);
//     expect(resJsonSpy).toHaveBeenCalledWith({ message: 'No file provided ' });
//     expect(mockCreateNodeService).not.toHaveBeenCalled();
//     expect(mockStorageFileService).not.toHaveBeenCalled();
//   });

//   it('should upload a file and create a node entry successfully', async () => {
//     const fileData = {
//       name: 'document.pdf',
//       description: 'A test document',
//       parent_id: null,
//       type: 'file',
//     };
//     const mockMulterFile: Express.Multer.File = {
//       fieldname: 'file',
//       originalname: 'original-document.pdf', // Multer usa originalname
//       encoding: '7bit',
//       mimetype: 'application/pdf',
//       size: 12345,
//       buffer: Buffer.from('PDF content'),
//       // @ts-ignore - Otros campos no esenciales para este test
//       destination: '', filename: '', path: ''
//     };

//     mockRequest.body = fileData;
//     mockRequest.file = mockMulterFile;
//     // Asegura que mockCreateUniqueFileName devuelve lo que esperas
//     mockCreateUniqueFileName.mockReturnValue(`test-user-id/${mockMulterFile.originalname}`);

//     await createNode(mockRequest as Request, mockResponse as Response);

//     // 1. Verifica que createUniqueFileName fue llamado con los argumentos correctos
//     expect(mockCreateUniqueFileName).toHaveBeenCalledWith(mockRequest.user?.id, mockMulterFile.originalname);

//     // 2. Verifica que storageFileService fue llamado con el archivo y la clave generada
//     expect(mockStorageFileService).toHaveBeenCalledTimes(1);
//     expect(mockStorageFileService).toHaveBeenCalledWith(mockMulterFile, `test-user-id/${mockMulterFile.originalname}`);

//     // 3. Verifica que createNodeService fue llamado con los datos correctos del nodo
//     expect(mockCreateNodeService).toHaveBeenCalledTimes(1);
//     expect(mockCreateNodeService).toHaveBeenCalledWith({
//       user_id: mockRequest.user?.id,
//       parent_id: fileData.parent_id,
//       name: fileData.name,
//       description: fileData.description,
//       type: 'file',
//       storage_location: `test-user-id/${mockMulterFile.originalname}`, // Aquí debe ir la clave generada
//       mime_type: mockMulterFile.mimetype,
//       file_size: mockMulterFile.size,
//     });

//     // 4. Verifica la respuesta exitosa
//     expect(resStatusSpy).toHaveBeenCalledWith(200);
//     expect(resJsonSpy).toHaveBeenCalledWith({ message: 'File created successfully' });
//   });

//   // --- TEST: Manejo de Errores ---
//   it('should handle errors from createNodeService', async () => {
//     mockRequest.body = { name: 'Failing Folder', type: 'folder' };
//     const errorMessage = 'Database error occurred';
//     mockCreateNodeService.mockRejectedValue(new Error(errorMessage)); // Simula un error en el servicio

//     const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

//     await createNode(mockRequest as Request, mockResponse as Response);

//     expect(resStatusSpy).toHaveBeenCalledWith(500);
//     expect(resJsonSpy).toHaveBeenCalledWith({ message: errorMessage });
//     expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error)); // Verifica que el error fue loggeado

//     consoleLogSpy.mockRestore(); // Restaura console.log
//   });

//   it('should handle errors from storageFileService', async () => {
//     mockRequest.body = { name: 'Failing File', type: 'file' };
//     mockRequest.file = { originalname: 'error.txt', mimetype: 'text/plain', size: 10, buffer: Buffer.from('a') } as Express.Multer.File;
//     const errorMessage = 'Failed to upload file to storage.';
//     mockStorageFileService.mockRejectedValue(new Error(errorMessage)); // Simula un error en storageFileService

//     const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

//     await createNode(mockRequest as Request, mockResponse as Response);

//     expect(resStatusSpy).toHaveBeenCalledWith(500);
//     expect(resJsonSpy).toHaveBeenCalledWith({ message: errorMessage });
//     expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error));

//     consoleLogSpy.mockRestore();
//   });
// });