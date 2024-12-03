import DatosAntropometricos from "../models/datos_antropometricos.js";

const httpDatosAntropometricos = {
  // Obtener todos los datos antropométricos
  getAll: async (req, res) => {
    try {
      const datos = await DatosAntropometricos.find().populate("idUsuario");
      res.json(datos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los datos antropométricos" });
    }
  },

  // Obtener datos antropométricos por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const dato = await DatosAntropometricos.findById(id).populate("idUsuario");

      if (!dato) {
        return res.status(404).json({ error: "Datos antropométricos no encontrados" });
      }

      res.json(dato);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los datos antropométricos" });
    }
  },

    // Obtener datos antropométricos por idUsuario
    getByIdUsuario: async (req, res) => {
      try {
        const { idUsuario } = req.params;
        const datos = await DatosAntropometricos.find({ idUsuario })
  
        if (!datos || datos.length === 0) {
          return res.status(404).json({ error: "No se encontraron datos antropométricos para este usuario" });
        }
  
        res.json(datos);
      } catch (error) {
        res.status(500).json({ error: "Error al obtener los datos antropométricos por idUsuario" });
      }
    },
  

  // Crear un nuevo registro de datos antropométricos
  crearOActualizarDatosAntropometricos: async (req, res) => {
    try {
      const { estatura, peso, idUsuario } = req.body;

      // Buscar si ya existe un registro para el idUsuario
      let dato = await DatosAntropometricos.findOne({ idUsuario });

      if (dato) {
        // Si existe, actualizar el registro
        dato = await DatosAntropometricos.findByIdAndUpdate(
          dato._id,
          { estatura, peso },
          { new: true } // Retornar el documento actualizado
        );
        res.json(dato);
      } else {
        // Si no existe, crear un nuevo registro
        dato = new DatosAntropometricos({ estatura, peso, idUsuario });
        await dato.save();
        res.json(dato);
      }
    } catch (error) {
      console.error("Error al crear o actualizar los datos antropométricos:", error);
      res.status(500).json({ error: "Error al gestionar los datos antropométricos" });
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

      res.json(datoInactivado);
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

      res.json(datoActivado);
    } catch (error) {
      res.status(500).json({ error: "Error al activar los datos antropométricos" });
    }
  },
};

export default httpDatosAntropometricos;