import { config } from "dotenv";
config();

require('dotoenv').config({ path: './variables.env' });


export const MONGODB_URI = process.env.MONGODB_URI || process.env.DB_URL;   

// Leer localhost de variables y puerto
export const PORT = process.env.PORT || 3000;
export const HOST = process.env.HOST || '0.0.0.0';
