import { RequestHandler } from "express";
import { CreateNodeData, NodeData } from "../types/node";
import { createNodeService } from "../services/nodeServices";
import { storageFileService } from "../services/storageFileService";
import { createUniqueFileName } from "../utils/createUniqueName";

export const createNode: RequestHandler = async (req, res) => {
    try {
        const data = req.body as CreateNodeData;
        if (!data.name || !data.type) {
            res.status(400).json({ message: "Name and type are required." });
            return;
        }

        if (data.type !== 'file' && data.type !== 'folder') {
            res.status(400).json({ message: "Invalid node type. Must be 'file' or 'folder'." });
            return;
        }

        if (!req.user?.id) {
            res.status(500).json({ message: "Internal server error" });
            return;
        }

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
            // Por aqui podria ir yendo o no se
            await createNodeService(NodeData);
            res.status(200).json({ message: "Folder created successfully" });
            return;
        }

        if (!req.file) {
            res.status(400).json({ message: "No file provided " });
            return;
        }
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
        console.log(e);
        res.status(500).json({ message: e.message });
    }
}