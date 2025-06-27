import { pool } from "../database/db";
import { NodeData } from "../types/node";
import * as nodeQueries from "../models/nodeModel";

export const createNodeService = async (data: NodeData) => {
    try {
        if (data.parent_id != null) {
            const parentNodes = await pool.query(nodeQueries.getNodeById, [data.parent_id]);
            if (parentNodes.rowCount == 0 )
                throw new Error("Invalid parent id");

            const type = parentNodes.rows[0].type;
            if (type != 'folder') throw new Error("Invalid parent id");
        }

        const duplicatedNodes = await pool.query(
            nodeQueries.getDuplicatedNode,
            [data.user_id, data.parent_id, data.name]
        );

        console.log("Cantidad: ", duplicatedNodes.rowCount);
        if (duplicatedNodes.rowCount != 0) {
            throw new Error("There is a node with this name already");
        }
        
        await pool.query(
            nodeQueries.createNode, 
            [data.user_id, data.parent_id, data.name, data.description, data.type, data.storage_location, data.mime_type, data.file_size]
        );
    } catch(e) {
        console.error("Error in createNode service:", e);
        throw e;
    }
}