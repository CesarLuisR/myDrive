import { RequestHandler } from "express";
import { CreateNodeData, NodeData } from "../types/node";
import { createNodeService } from "../services/nodeServices";
import { storageFileService } from "../services/storageFileService";
import { createUniqueFileName } from "../utils/createUniqueName";
import { BadRequestError, NotFoundError } from "../utils/error";

export const createNode: RequestHandler = async (req, res, next) => {
    try {
        const data = req.body as CreateNodeData;
        if (!data.name || !data.type)
            throw new NotFoundError("Name and type are required");

        if (data.type !== 'file' && data.type !== 'folder')
            throw new BadRequestError("Invalid node type. Must be file or folder");

        if (!req.user?.id)
            throw new NotFoundError("Not user found");

        let NodeData: NodeData = {
            user_id: req.user?.id,
            parent_id: data.parent_id,
            name: data.name,
            description: data.description,
            type: data.type,
            storage_location: null,
            mime_type: null,
            file_size: null
        }

        if (data.type == 'folder') {
            await createNodeService(NodeData);
            res.status(200).json({ message: "Folder created successfully" });
            return;
        }

        if (!req.file)
            throw new BadRequestError("No file provided");

        const fileKey = createUniqueFileName(req.user?.id, req.file.originalname);

        NodeData = {
            user_id: req.user?.id,
            parent_id: data.parent_id,
            name: data.name,
            description: data.description,
            type: data.type,
            storage_location: fileKey,
            mime_type: req.file.mimetype,
            file_size: req.file.size 
        }

        await createNodeService(NodeData);
        await storageFileService(req.file, fileKey);
        
        res.status(200).json({ message: "File created successfully" });
    } catch(e: any) {
        next(e);
    }
}