import mongoose from "mongoose";

const plieguesCutaneosSchema = new mongoose.Schema({
  biceps: { type: Number }, 
  triceps: { type: Number }, 
  escapula: { type: Number }, 
  abdomen: { type: Number }, 
  suprailiaco: { type: Number }, 
  pectoral: { type: Number }, 
  pierna: { type: Number }, 
  pantorrilla: { type: Number }, 
  idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  estado: { type: Boolean, default: 1 },
  createAT: { type: Date, default: Date.now }, 
});

export default mongoose.model("PliegueCutaneo", plieguesCutaneosSchema);