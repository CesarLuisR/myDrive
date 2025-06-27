interface AppConfig {
    port: number;
    jwtSecret: string;
    db: {
        user: string;
        host: string;
        database: string;
        password?: string;
        port: number;
    };
    aws: {
        bucket_name: string;
        bucket_region: string;
        public_key: string;
        secret_key: string;
    }
}

const config: AppConfig = {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
    db: {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'my_drive',
        password: process.env.DB_PASS || 'cesarluis2005',
        port: parseInt(process.env.DB_PORT || '5432'),
    },
    aws: {
        bucket_name: process.env.AWS_BUCKET_NAME || "",
        bucket_region: process.env.AWS_BUCKET_REGION || "",
        public_key: process.env.AWS_PUBLIC_ACCESS_KEY || "",
        secret_key: process.env.AWS_SECRET_ACCESS_KEY || ""
    }
};

export default config;