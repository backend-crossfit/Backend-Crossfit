import express from "express";
import http from "http";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import Usuario from "./routes/usuario.js";

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.use("/api/usuario", Usuario);


const server = http.createServer(app);

mongoose
  .connect(`${process.env.mongoDB}`)
  .then(() => console.log("Conexión a mongoDB exitosa!"));

server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});