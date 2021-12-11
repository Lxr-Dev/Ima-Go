import app from "./app";
import { PORT } from "./config";
import { MONGODB_URI } from "./config";

// database
import "./config/mongoose";

// Starting the server
app.listen(PORT,MONGODB_URI);
console.log("Server on port", app.get("port"));
