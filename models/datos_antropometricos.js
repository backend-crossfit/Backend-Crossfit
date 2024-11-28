import mongoose from "mongoose";

const datosAntropometricosSchema = new mongoose.Schema({
  estatura: { type: Number }, 
  peso: { type: Number }, 
  idCliente: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente", required: true }, 
  estado: { type: Boolean, default: 1 },
  createAT: { type: Date, default: Date.now }, 
});

export default mongoose.model("DatosAntropometricos", datosAntropometricosSchema);