import { createNodeService } from "../../src/services/nodeServices";
import { pool } from "../../src/database/db";
import { CreateNodeData, NodeData, NodeDB } from "../../src/types/node"; // Assuming NodeData is CreateNodeData

import * as nodeQueries from "../../src/models/nodeModel";

// Mock the entire database module to control `pool.query`
jest.mock("../../src/database/db", () => ({
  pool: {
    query: jest.fn(), // Create a mock function for the `query` method
  },
}));

// Get a reference to the mocked `pool.query` for easier assertion and mock control
const mockPoolQuery = pool.query as jest.Mock;

describe("createNodeService", () => {
  beforeEach(() => {
    mockPoolQuery.mockClear();
  });

  // --- Test Case 1: Successfully create a root folder ---
  it("should successfully create a root folder when no duplicates exist", async () => {
    // Arrange: Define the data for a root folder
    const testData: NodeData = {
      user_id: "user-abc-123",
      parent_id: null, // This signifies a root node
      name: "My Root Folder",
      description: "A description for the root folder",
      type: "folder",
      storage_location: null,
      file_size: null,
      mime_type: null,
    };
    // Expected result after creation (including UUID, dates from DB)
    const expectedCreatedNode: NodeDB = {
      ...testData,
      uuid: "generated-root-uuid-1",
      created_at: new Date(),
      updated_at: new Date(),
      description: testData.description as string, // Ensure type matches NodeDB
    };

    // Mock the database calls in the order they occur:
    // 1. `getDuplicatedNode`: Mock that no duplicates are found (rowCount: 0)
    mockPoolQuery.mockResolvedValueOnce({ rowCount: 0, rows: [] });
    // 2. `createNode`: Mock that the node is successfully created and returned
    mockPoolQuery.mockResolvedValueOnce({ rows: [expectedCreatedNode] });

    // Act: Call the service function
    const result = await createNodeService(testData);

    // Assert: Check the outcome
    // expect(result).toEqual(expectedCreatedNode); // Verify the returned node is as expected

    // Verify database interactions:
    expect(mockPoolQuery).toHaveBeenCalledTimes(2); // Two calls: one for duplicate check, one for creation

    // Check the arguments for the duplicate check query
    expect(mockPoolQuery).toHaveBeenCalledWith(
      nodeQueries.getDuplicatedNode,
      [testData.user_id, testData.parent_id, testData.name]
    );
    // Check the arguments for the create node query
    expect(mockPoolQuery).toHaveBeenCalledWith(
      nodeQueries.createNode,
      [
        testData.user_id,
        testData.parent_id,
        testData.name,
        testData.description,
        testData.type,
        testData.storage_location,
        testData.mime_type,
        testData.file_size,
      ]
    );
  });

  // --- Test Case 2: Successfully create a nested file ---
  it("should successfully create a nested file within an existing parent folder", async () => {
    // Arrange
    const parentId = "existing-parent-folder-uuid";
    const testData: NodeData = {
      user_id: "user-def-456",
      parent_id: parentId,
      name: "My Photo.jpg",
      description: null,
      type: "file",
      storage_location: "/uploads/my-photo.jpg",
      file_size: 204800, // 200KB
      mime_type: "image/jpeg",
    };
    const expectedCreatedNode: NodeDB = {
      ...testData,
      uuid: "generated-file-uuid-2",
      created_at: new Date(),
      updated_at: new Date(),
      description: null, // Still null based on testData
    };

    // Mock 1: `getNodeById` for parent validation: Parent exists and is a folder
    mockPoolQuery.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ uuid: parentId, type: "folder" } as NodeDB],
    });
    // Mock 2: `getDuplicatedNode`: No duplicates found
    mockPoolQuery.mockResolvedValueOnce({ rowCount: 0, rows: [] });
    // Mock 3: `createNode`: Successful creation
    mockPoolQuery.mockResolvedValueOnce({ rows: [expectedCreatedNode] });

    // Act
    const result = await createNodeService(testData);

    // Assert
    // expect(result).toEqual(expectedCreatedNode);
    expect(mockPoolQuery).toHaveBeenCalledTimes(3); // Parent check + Duplicate check + Creation

    expect(mockPoolQuery).toHaveBeenCalledWith(
      nodeQueries.getNodeById, // Check if the parent query was called
      [testData.parent_id]
    );
    expect(mockPoolQuery).toHaveBeenCalledWith(
      nodeQueries.getDuplicatedNode,
      [testData.user_id, testData.parent_id, testData.name]
    );
    expect(mockPoolQuery).toHaveBeenCalledWith(
      nodeQueries.createNode,
      [
        testData.user_id,
        testData.parent_id,
        testData.name,
        testData.description,
        testData.type,
        testData.storage_location,
        testData.mime_type,
        testData.file_size,
      ]
    );
  });

  // --- Test Case 3: Parent ID provided but not found ---
  it("should throw 'Invalid parent id' if parent_id is provided but not found", async () => {
    // Arrange
    const testData: NodeData = {
      user_id: "user-ghi-789",
      parent_id: "non-existent-parent-uuid",
      name: "My New Item",
      description: null,
      type: "folder",
      storage_location: null,
      file_size: null,
      mime_type: null,
    };

    // Mock 1: `getNodeById`: Returns no rows (parent not found)
    mockPoolQuery.mockResolvedValueOnce({ rowCount: 0, rows: [] });

    // Act & Assert
    await expect(createNodeService(testData)).rejects.toThrow("Invalid parent id");

    // Assert
    expect(mockPoolQuery).toHaveBeenCalledTimes(1); // Only the parent check should happen
    expect(mockPoolQuery).toHaveBeenCalledWith(
      nodeQueries.getNodeById,
      [testData.parent_id]
    );
    // Ensure duplicate check and creation queries were NOT called
    expect(mockPoolQuery).not.toHaveBeenCalledWith(nodeQueries.getDuplicatedNode, expect.any(Array));
    expect(mockPoolQuery).not.toHaveBeenCalledWith(nodeQueries.createNode, expect.any(Array));
  });

  // --- Test Case 4: Parent ID found but is a file (not a folder) ---
  it("should throw 'Invalid parent id' if parent_id exists but is a file", async () => {
    // Arrange
    const testData: NodeData = {
      user_id: "user-jkl-012",
      parent_id: "existing-file-uuid", // This ID exists, but its type is 'file'
      name: "My New Folder",
      description: null,
      type: "folder",
      storage_location: null,
      file_size: null,
      mime_type: null,
    };

    // Mock 1: `getNodeById`: Returns a node of type 'file'
    mockPoolQuery.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ uuid: testData.parent_id, type: "file" } as NodeDB], // Important: type 'file'
    });

    // Act & Assert
    await expect(createNodeService(testData)).rejects.toThrow("Invalid parent id");

    // Assert
    expect(mockPoolQuery).toHaveBeenCalledTimes(1); // Only the parent check
    expect(mockPoolQuery).toHaveBeenCalledWith(
      nodeQueries.getNodeById,
      [testData.parent_id]
    );
    // Ensure subsequent queries were NOT called
    expect(mockPoolQuery).not.toHaveBeenCalledWith(nodeQueries.getDuplicatedNode, expect.any(Array));
    expect(mockPoolQuery).not.toHaveBeenCalledWith(nodeQueries.createNode, expect.any(Array));
  });

  // --- Test Case 5: Duplicate node name exists in the same parent ---
  it("should throw 'There is a node with this name already' if a duplicate exists in the parent", async () => {
    // Arrange
    const testData: NodeData = {
      user_id: "user-mno-345",
      parent_id: "parent-folder-uuid",
      name: "Existing Duplicate Name",
      description: null,
      type: "file",
      storage_location: "/path/to/dup.txt",
      file_size: 100,
      mime_type: "text/plain",
    };

    // Mock 1: `getNodeById`: Parent is valid
    mockPoolQuery.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ uuid: testData.parent_id, type: "folder" } as NodeDB],
    });
    // Mock 2: `getDuplicatedNode`: A duplicate is found
    mockPoolQuery.mockResolvedValueOnce({ rowCount: 1, rows: [{ uuid: "duplicate-node-uuid" }] });

    // Act & Assert
    await expect(createNodeService(testData)).rejects.toThrow("There is a node with this name already");

    // Assert
    expect(mockPoolQuery).toHaveBeenCalledTimes(2); // Parent check + Duplicate check
    expect(mockPoolQuery).toHaveBeenCalledWith(
      nodeQueries.getNodeById,
      [testData.parent_id]
    );
    expect(mockPoolQuery).toHaveBeenCalledWith(
      nodeQueries.getDuplicatedNode,
      [testData.user_id, testData.parent_id, testData.name]
    );
    // Ensure createNode was NOT called
    expect(mockPoolQuery).not.toHaveBeenCalledWith(nodeQueries.createNode, expect.any(Array));
  });

  // --- Test Case 6: Duplicate root node name exists ---
  it("should throw 'There is a node with this name already' if a duplicate root node exists", async () => {
    // Arrange
    const testData: NodeData = {
      user_id: "user-pqr-678",
      parent_id: null, // Root node
      name: "Existing Root Item",
      description: null,
      type: "folder",
      storage_location: null,
      file_size: null,
      mime_type: null,
    };

    // Mock 1: `getDuplicatedNode`: A duplicate is found (for the root level)
    mockPoolQuery.mockResolvedValueOnce({ rowCount: 1, rows: [{ uuid: "duplicate-root-node-uuid" }] });

    // Act & Assert
    await expect(createNodeService(testData)).rejects.toThrow("There is a node with this name already");

    // Assert
    expect(mockPoolQuery).toHaveBeenCalledTimes(1); // Only the duplicate check (no parent check for null parent_id)
    expect(mockPoolQuery).toHaveBeenCalledWith(
      nodeQueries.getDuplicatedNode,
      [testData.user_id, testData.parent_id, testData.name]
    );
    // Ensure createNode was NOT called
    expect(mockPoolQuery).not.toHaveBeenCalledWith(nodeQueries.createNode, expect.any(Array));
  });

  // --- Test Case 7: Database error during parent validation ---
  it("should re-throw database errors that occur during parent validation", async () => {
    // Arrange
    const testData: NodeData = {
      user_id: "user-stu-901",
      parent_id: "any-parent-id",
      name: "Error Causing Item",
      description: null,
      type: "folder",
      storage_location: null,
      file_size: null,
      mime_type: null,
    };
    const dbError = new Error("Simulated DB connection error for parent check");

    // Mock 1: `getNodeById`: Rejects with a database error
    mockPoolQuery.mockRejectedValueOnce(dbError);

    // Act & Assert
    await expect(createNodeService(testData)).rejects.toThrow(dbError);

    // Assert
    expect(mockPoolQuery).toHaveBeenCalledTimes(1); // Only the initial parent check
    expect(mockPoolQuery).toHaveBeenCalledWith(
      nodeQueries.getNodeById,
      [testData.parent_id]
    );
  });

  // --- Test Case 8: Database error during duplicate check ---
  it("should re-throw database errors that occur during duplicate check", async () => {
    // Arrange
    const testData: NodeData = {
      user_id: "user-vwx-234",
      parent_id: "valid-parent-id",
      name: "Another Error Item",
      description: null,
      type: "folder",
      storage_location: null,
      file_size: null,
      mime_type: null,
    };
    const dbError = new Error("Simulated DB network error for duplicate check");

    // Mock 1: `getNodeById`: Parent is valid
    mockPoolQuery.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ uuid: testData.parent_id, type: "folder" } as NodeDB],
    });
    // Mock 2: `getDuplicatedNode`: Rejects with a database error
    mockPoolQuery.mockRejectedValueOnce(dbError);

    // Act & Assert
    await expect(createNodeService(testData)).rejects.toThrow(dbError);

    // Assert
    expect(mockPoolQuery).toHaveBeenCalledTimes(2); // Parent check + Duplicate check
    expect(mockPoolQuery).toHaveBeenCalledWith(
      nodeQueries.getDuplicatedNode,
      [testData.user_id, testData.parent_id, testData.name]
    );
  });

  // --- Test Case 9: Database error during node creation ---
  it("should re-throw database errors that occur during node creation", async () => {
    // Arrange
    const testData: NodeData = {
      user_id: "user-yza-567",
      parent_id: null,
      name: "Final Error Item",
      description: null,
      type: "folder",
      storage_location: null,
      file_size: null,
      mime_type: null,
    };
    const dbError = new Error("Simulated DB integrity error on insert");

    // Mock 1: `getDuplicatedNode`: No duplicates found
    mockPoolQuery.mockResolvedValueOnce({ rowCount: 0, rows: [] });
    // Mock 2: `createNode`: Rejects with a database error
    mockPoolQuery.mockRejectedValueOnce(dbError);

    // Act & Assert
    await expect(createNodeService(testData)).rejects.toThrow(dbError);

    // Assert
    expect(mockPoolQuery).toHaveBeenCalledTimes(2); // Duplicate check + Create
    expect(mockPoolQuery).toHaveBeenCalledWith(
      nodeQueries.createNode,
      [
        testData.user_id,
        testData.parent_id,
        testData.name,
        testData.description,
        testData.type,
        testData.storage_location,
        testData.mime_type,
        testData.file_size,
      ]
    );
  });
});