import PliegueCutaneo from "../models/PliegueCutaneo.js";

const httpPlieguesCutaneos = {
  // Obtener todos los registros de pliegues cutáneos
  getAll: async (req, res) => {
    try {
      const registros = await PliegueCutaneo.find().populate("idCliente", "nombre apellido correo");
      res.json(registros);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los registros de pliegues cutáneos" });
    }
  },

  // Obtener un registro de pliegues cutáneos por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const registro = await PliegueCutaneo.findById(id).populate("idCliente", "nombre apellido correo");

      if (!registro) {
        return res.status(404).json({ error: "Registro no encontrado" });
      }

      res.json(registro);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el registro de pliegues cutáneos" });
    }
  },

  // Crear un nuevo registro de pliegues cutáneos
  crear: async (req, res) => {
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
        idCliente,
      } = req.body;

      const nuevoRegistro = new PliegueCutaneo({
        biceps,
        triceps,
        escapula,
        abdomen,
        suprailiaco,
        pectoral,
        pierna,
        pantorrilla,
        idCliente,
      });

      await nuevoRegistro.save();
      res.status(201).json(nuevoRegistro);
    } catch (error) {
      res.status(500).json({ error: "Error al crear el registro de pliegues cutáneos" });
    }
  },

  // Actualizar un registro de pliegues cutáneos
  editar: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        biceps,
        triceps,
        escapula,
        abdomen,
        suprailiaco,
        pectoral,
        pierna,
        pantorrilla,
      } = req.body;

      const registroActualizado = await PliegueCutaneo.findByIdAndUpdate(
        id,
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
        { new: true }
      );

      if (!registroActualizado) {
        return res.status(404).json({ error: "Registro no encontrado" });
      }

      res.json(registroActualizado);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el registro de pliegues cutáneos" });
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