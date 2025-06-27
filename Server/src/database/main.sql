CREATE TABLE users (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hash_password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE nodes (
	uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL,
	parent_id UUID NULL,
	name VARCHAR(255) NOT NULL,
	description TEXT NULL,

	type VARCHAR(10) NOT NULL,                      
    CONSTRAINT chk_node_type CHECK (type IN ('file', 'folder')),
	
	storage_location TEXT NULL,
    mime_type VARCHAR(255) NULL, 
    file_size BIGINT NULL,
	
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	
	CONSTRAINT fk_node_user
		FOREIGN KEY (user_id)
		REFERENCES users(uuid)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
			
	CONSTRAINT fk_node_parent
		FOREIGN KEY (parent_id)
		REFERENCES nodes(uuid)
			ON DELETE CASCADE
			ON UPDATE CASCADE
);