import PerimetrosMusculares from "../models/PerimetrosMusculares.js";

const httpPerimetrosMusculares = {
  // Obtener todos los registros de perímetros musculares
  getAll: async (req, res) => {
    try {
      const registros = await PerimetrosMusculares.find().populate(
        "idCliente",
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
        "idCliente",
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

  // Crear un nuevo registro de perímetros musculares
  crear: async (req, res) => {
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
        idCliente,
      } = req.body;

      const nuevoRegistro = new PerimetrosMusculares({
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
        idCliente,
      });

      await nuevoRegistro.save();
      res.status(201).json(nuevoRegistro);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al crear el registro de perímetros musculares" });
    }
  },

  // Actualizar un registro de perímetros musculares
  editar: async (req, res) => {
    try {
      const { id } = req.params;
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
      } = req.body;

      const registroActualizado = await PerimetrosMusculares.findByIdAndUpdate(
        id,
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
        { new: true }
      );

      if (!registroActualizado) {
        return res.status(404).json({ error: "Registro no encontrado" });
      }

      res.json(registroActualizado);
    } catch (error) {
      res.status(500).json({
        error: "Error al actualizar el registro de perímetros musculares",
      });
    }
  },

  // Eliminar un registro de perímetros musculares (cambio de estado)
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

  // Reactivar un registro de datos antropométricos
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
