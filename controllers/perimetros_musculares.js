import PerimetrosMusculares from "../models/perimetros_musculares.js";

const httpPerimetrosMusculares = {
  // Obtener todos los registros de perímetros musculares
  getAll: async (req, res) => {
    try {
      const registros = await PerimetrosMusculares.find().populate(
        "idUsuario",
        "nombre apellido correo"
      );
      res.json(registros);
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener los registros de perímetros musculares",
      });
    }
  },

  // Obtener un registro de perímetros musculares por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const registro = await PerimetrosMusculares.findById(id).populate(
        "idUsuario",
        "nombre apellido correo"
      );

      if (!registro) {
        return res.status(404).json({ error: "Registro no encontrado" });
      }

      res.json(registro);
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener el registro de perímetros musculares",
      });
    }
  },

  // Obtener perimetros musculares por idUsuario
  getByIdUsuario: async (req, res) => {
    try {
      const { idUsuario } = req.params;
      const datos = await PerimetrosMusculares.find({ idUsuario })

      if (!datos || datos.length === 0) {
        return res.status(404).json({ error: "No se encontraron perimetros musculares para este usuario" });
      }

      res.json(datos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los perimetros musculares por idUsuario" });
    }
  },

  crearOActualizarPerimetrosMusculares: async (req, res) => {
    try {
      const {
        pectoral,
        hombro,
        cuello,
        biceps_relajado,
        biceps_contraido,
        abdomen,
        cintura,
        cadera,
        muslo_mayor,
        pantorrilla,
        idUsuario,
      } = req.body;

      // Buscar si ya existe un registro para el idUsuario
      let registro = await PerimetrosMusculares.findOne({ idUsuario });

      if (registro) {
        // Actualizar registro existente
        registro = await PerimetrosMusculares.findByIdAndUpdate(
          registro._id,
          {
            pectoral,
            hombro,
            cuello,
            biceps_relajado,
            biceps_contraido,
            abdomen,
            cintura,
            cadera,
            muslo_mayor,
            pantorrilla,
          },
          { new: true } // Retornar el documento actualizado
        );
        res.json(registro);
      } else {
        // Crear un nuevo registro si no existe
        registro = new PerimetrosMusculares({
          pectoral,
          hombro,
          cuello,
          biceps_relajado,
          biceps_contraido,
          abdomen,
          cintura,
          cadera,
          muslo_mayor,
          pantorrilla,
          idUsuario,
        });
        await registro.save();
        res.json(registro);
      }
    } catch (error) {
      console.error("Error al gestionar el registro de perímetros musculares:", error);
      res
        .status(500)
        .json({ error: "Error al gestionar el registro de perímetros musculares" });
    }
  },


  inactivar: async (req, res) => {
    try {
      const { id } = req.params;

      const datoInactivado = await PerimetrosMusculares.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
      );

      if (!datoInactivado) {
        return res
          .status(404)
          .json({ error: "Perimetros musculares no encontrados" });
      }

      res.json(
        datoInactivado,
      );
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al inactivar los datos antropométricos" });
    }
  },


  activar: async (req, res) => {
    try {
      const { id } = req.params;

      const datoActivado = await PerimetrosMusculares.findByIdAndUpdate(
        id,
        { estado: true },
        { new: true }
      );

      if (!datoActivado) {
        return res
          .status(404)
          .json({ error: "perimetros musculares no encontrados" });
      }

      res.json(datoActivado);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al activar los perimetros musculares" });
    }
  },
};

export default httpPerimetrosMusculares;