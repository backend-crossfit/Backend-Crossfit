import PliegueCutaneo from "../models/pliegues_cutaneos.js";

const httpPlieguesCutaneos = {
  // Obtener todos los registros de pliegues cutáneos
  getAll: async (req, res) => {
    try {
      const registros = await PliegueCutaneo.find().populate("idUsuario", "nombre apellido correo");
      res.json(registros);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los registros de pliegues cutáneos" });
    }
  },

  // Obtener un registro de pliegues cutáneos por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const registro = await PliegueCutaneo.findById(id).populate("idUsuario", "nombre apellido correo");

      if (!registro) {
        return res.status(404).json({ error: "Registro no encontrado" });
      }

      res.json(registro);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el registro de pliegues cutáneos" });
    }
  },

  // Obtener pliegues cutaneos por idUsuario
  getByIdUsuario: async (req, res) => {
    try {
      const { idUsuario } = req.params;
      const datos = await PliegueCutaneo.find({ idUsuario })

      if (!datos || datos.length === 0) {
        return res.status(404).json({ error: "No se encontraron pliegues cutaneos para este usuario" });
      }

      res.json(datos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los pliegues cutaneos por idUsuario" });
    }
  },

  crearOActualizarPlieguesCutaneos: async (req, res) => {
    try {
      const {
        biceps,
        triceps,
        escapula,
        abdomen,
        suprailiaco,
        pectoral,
        pierna,
        pantorrilla,
        idUsuario,
      } = req.body;

      // Buscar si ya existe un registro para el idUsuario
      let registro = await PliegueCutaneo.findOne({ idUsuario });

      if (registro) {
        // Actualizar registro existente
        registro = await PliegueCutaneo.findByIdAndUpdate(
          registro._id,
          {
            biceps,
            triceps,
            escapula,
            abdomen,
            suprailiaco,
            pectoral,
            pierna,
            pantorrilla,
          },
          { new: true } // Retornar el documento actualizado
        );
        res.json(registro);
      } else {
        // Crear un nuevo registro si no existe
        registro = new PliegueCutaneo({
          biceps,
          triceps,
          escapula,
          abdomen,
          suprailiaco,
          pectoral,
          pierna,
          pantorrilla,
          idUsuario,
        });
        await registro.save();
        res.json(registro);
      }
    } catch (error) {
      console.error("Error al gestionar el registro de pliegues cutáneos:", error);
      res.status(500).json({ error: "Error al gestionar el registro de pliegues cutáneos" });
    }
  },

  // Eliminar un registro de pliegues cutáneos (cambio de estado a inactivo)
  inactivar: async (req, res) => {
    try {
      const { id } = req.params;

      const registroInactivado = await PliegueCutaneo.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
      );

      if (!registroInactivado) {
        return res.status(404).json({ error: "Registro no encontrado" });
      }

      res.json({ message: "Registro inactivado con éxito", registroInactivado });
    } catch (error) {
      res.status(500).json({ error: "Error al inactivar el registro de pliegues cutáneos" });
    }
  },

  // Activar un registro de pliegues cutáneos
  activar: async (req, res) => {
    try {
      const { id } = req.params;

      const registroActivado = await PliegueCutaneo.findByIdAndUpdate(
        id,
        { estado: true },
        { new: true }
      );

      if (!registroActivado) {
        return res.status(404).json({ error: "Registro no encontrado" });
      }

      res.json({ message: "Registro activado con éxito", registroActivado });
    } catch (error) {
      res.status(500).json({ error: "Error al activar el registro de pliegues cutáneos" });
    }
  },
};

export default httpPlieguesCutaneos;