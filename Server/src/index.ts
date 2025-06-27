import { config } from "dotenv";

// dotenv config
config();

import app from "./app";
import { connectDB } from "./database/db";

(async () => {
    await connectDB();

    const port = app.get("port");
    app.listen(port, () => {
        console.log("Serving on port: ", port);
    })
})();