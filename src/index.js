import app from "./app";
import { PORT } from "./config";
import { HOST } from "./config";

// database
import "./config/mongoose";

// Starting the server
app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
});