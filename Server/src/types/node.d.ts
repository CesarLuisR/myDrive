export type NodeData = {
    user_id: string;
    parent_id: string | null;
    name: string;
    description: string | null;
    type: 'file' | 'folder';
    storage_location: string | null;
    mime_type: string | null;
    file_size: number | null;
}

export type NodeDB = {
    uuid: string;
    user_id: string;
    parent_id: string | null;
    name: string;
    description: string | null;
    type: 'file' | 'folder';
    storage_location: string | null;
    mime_type: string | null;
    file_size: number | null;
    created_at: Date;
    updated_at: Date;
}

export type CreateNodeData = {
    parent_id: string | null;
    name: string;
    description: string | null;
    type: 'file' | 'folder';
}