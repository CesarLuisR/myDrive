interface VarConfig {
    api: string; 
}

export const config: VarConfig = {
    api: import.meta.env.VITE_API || "http://localhost:5000/api"
}