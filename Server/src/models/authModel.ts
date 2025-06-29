export const createUser = `
    INSERT INTO users (name, last_name, email, hash_password)
    VALUES ($1, $2, $3, $4);
`;

export const getUserByEmail = `
    SELECT 
        hash_password,
        uuid
    FROM users
    WHERE email = $1
`;

export const getUserByUsername = `
    SELECT
        hash_password,
        uuid
    FROM users
    WHERE CONCAT(name || ' ' || last_name) = $1
`;

export const getUserById = `
    SELECT 
        uuid, name, last_name, email
    FROM users
    WHERE uuid = $1
`