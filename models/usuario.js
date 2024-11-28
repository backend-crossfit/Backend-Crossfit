import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  tipo_documento: { type: String, required: true },
  num_documento: { type: Number, required: true },
  edad: { type: Number, required: true }, 
  rol: { type: String, required: true }, 
  tipo_sexo: { type: String, required: true },
  correo: { type: String, required: true }, 
  password: { type: String, required: true },
  codigo_verificacion: { type: String }, 
  estado: { type: Boolean, default: 1 },
  createAT: { type: Date, default: Date.now }, 
});

export default mongoose.model("Usuario", usuarioSchema);