import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
    user: config.db.user,
    host: config.db.host,
    database: config.db.database,
    password: config.db.password,
    port: config.db.port 
});

export const connectDB = async () => {
    try {
        await pool.connect();        
        console.log('Conectado a la base de datos PostgreSQL.');
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1);
    }
}