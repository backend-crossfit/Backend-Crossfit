import DatosAntropometricos from "../models/DatosAntropometricos.js";

const httpDatosAntropometricos = {
  // Obtener todos los datos antropométricos
  getAll: async (req, res) => {
    try {
      const datos = await DatosAntropometricos.find().populate("idCliente", "nombre apellido correo");
      res.json(datos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los datos antropométricos" });
    }
  },

  // Obtener datos antropométricos por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const dato = await DatosAntropometricos.findById(id).populate("idCliente", "nombre apellido correo");

      if (!dato) {
        return res.status(404).json({ error: "Datos antropométricos no encontrados" });
      }

      res.json(dato);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los datos antropométricos" });
    }
  },

  // Crear un nuevo registro de datos antropométricos
  crear: async (req, res) => {
    try {
      const { estatura, peso, idCliente } = req.body;

      const nuevoDato = new DatosAntropometricos({
        estatura,
        peso,
        idCliente,
      });

      await nuevoDato.save();
      res.status(201).json(nuevoDato);
    } catch (error) {
      res.status(500).json({ error: "Error al crear los datos antropométricos" });
    }
  },

  // Actualizar un registro de datos antropométricos
  editar: async (req, res) => {
    try {
      const { id } = req.params;
      const { estatura, peso } = req.body;

      const datoActualizado = await DatosAntropometricos.findByIdAndUpdate(
        id,
        { estatura, peso },
        { new: true }
      );

      if (!datoActualizado) {
        return res.status(404).json({ error: "Datos antropométricos no encontrados" });
      }

      res.json(datoActualizado);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar los datos antropométricos" });
    }
  },

  // Eliminar un registro de datos antropométricos (cambio de estado)
  inactivar: async (req, res) => {
    try {
      const { id } = req.params;

      const datoInactivado = await DatosAntropometricos.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
      );

      if (!datoInactivado) {
        return res.status(404).json({ error: "Datos antropométricos no encontrados" });
      }

      res.json({ message: "Datos antropométricos inactivados", datoInactivado });
    } catch (error) {
      res.status(500).json({ error: "Error al inactivar los datos antropométricos" });
    }
  },

  // Reactivar un registro de datos antropométricos
  activar: async (req, res) => {
    try {
      const { id } = req.params;

      const datoActivado = await DatosAntropometricos.findByIdAndUpdate(
        id,
        { estado: true },
        { new: true }
      );

      if (!datoActivado) {
        return res.status(404).json({ error: "Datos antropométricos no encontrados" });
      }

      res.json({ message: "Datos antropométricos activados", datoActivado });
    } catch (error) {
      res.status(500).json({ error: "Error al activar los datos antropométricos" });
    }
  },
};

export default httpDatosAntropometricos;