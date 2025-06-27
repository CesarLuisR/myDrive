export const createNode = `
    INSERT INTO 
        nodes(user_id, parent_id, name, description, type, storage_location, mime_type, file_size)
    VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
`;

export const getNodeById = `
    SELECT uuid, type
    FROM nodes
    WHERE uuid = $1
`;

export const getDuplicatedNode = `
    SELECT uuid
    FROM nodes
    WHERE user_id = $1
        AND parent_id IS NOT DISTINCT FROM $2
        AND name = $3
`;