import mongoose from "mongoose";

const perimetrosMuscularesSchema = new mongoose.Schema({
  pectoral: { type: Number },
  hombro: { type: Number },
  cuello: { type: Number },
  biceps_relajado: { type: Number },
  biceps_contraido: { type: Number },
  abdomen: { type: Number },
  cintura: { type: Number },
  cadera: { type: Number },
  muslo_mayor: { type: Number },
  pantorrilla: { type: Number },
  idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true }, 
  createAT: { type: Date, default: Date.now },
});

export default mongoose.model("PerimetrosMusculares", perimetrosMuscularesSchema);