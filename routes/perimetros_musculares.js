import { Router } from "express";
import { check } from "express-validator";
import validarCampos from "../middlewares/validar.js";
import httpPerimetrosMusculares from "../controllers/perimetros_musculares.js";

const router = new Router();

// Obtener todos los registros de perímetros musculares
router.get("/all", httpPerimetrosMusculares.getAll);

// Obtener un registro de perímetros musculares por ID
router.get(
  "/:id",
  [
    check("id", "El ID no es válido").isMongoId(),
    validarCampos,
  ],
  httpPerimetrosMusculares.getById
);

// Crear un nuevo registro de perímetros musculares
router.post(
  "/crear",
  [
    check("pectoral", "El valor de pectoral debe ser un número").optional().isNumeric(),
    check("hombro", "El valor de hombro debe ser un número").optional().isNumeric(),
    check("cuello", "El valor de cuello debe ser un número").optional().isNumeric(),
    check("biceps_relajado", "El valor de bíceps relajado debe ser un número").optional().isNumeric(),
    check("biceps_contraido", "El valor de bíceps contraído debe ser un número").optional().isNumeric(),
    check("abdomen", "El valor de abdomen debe ser un número").optional().isNumeric(),
    check("cintura", "El valor de cintura debe ser un número").optional().isNumeric(),
    check("cadera", "El valor de cadera debe ser un número").optional().isNumeric(),
    check("muslo_mayor", "El valor de muslo mayor debe ser un número").optional().isNumeric(),
    check("pantorrilla", "El valor de pantorrilla debe ser un número").optional().isNumeric(),
    check("idCliente", "El ID del cliente es obligatorio").not().isEmpty(),
    check("idCliente", "El ID del cliente no es válido").isMongoId(),
    validarCampos,
  ],
  httpPerimetrosMusculares.crear
);

// Actualizar un registro de perímetros musculares
router.put(
  "/editar/:id",
  [
    check("id", "El ID no es válido").isMongoId(),
    check("pectoral", "El valor de pectoral debe ser un número").optional().isNumeric(),
    check("hombro", "El valor de hombro debe ser un número").optional().isNumeric(),
    check("cuello", "El valor de cuello debe ser un número").optional().isNumeric(),
    check("biceps_relajado", "El valor de bíceps relajado debe ser un número").optional().isNumeric(),
    check("biceps_contraido", "El valor de bíceps contraído debe ser un número").optional().isNumeric(),
    check("abdomen", "El valor de abdomen debe ser un número").optional().isNumeric(),
    check("cintura", "El valor de cintura debe ser un número").optional().isNumeric(),
    check("cadera", "El valor de cadera debe ser un número").optional().isNumeric(),
    check("muslo_mayor", "El valor de muslo mayor debe ser un número").optional().isNumeric(),
    check("pantorrilla", "El valor de pantorrilla debe ser un número").optional().isNumeric(),
    validarCampos,
  ],
  httpPerimetrosMusculares.editar
);

// Inactivar un dato antropométrico (cambio de estado a falso)
router.put(
  "/inactivar/:id",
  [
    check("id", "El ID no es válido").isMongoId(),
    validarCampos,
  ],
  httpPerimetrosMusculares.inactivar
);

// Activar un dato antropométrico (cambio de estado a verdadero)
router.put(
  "/activar/:id",
  [
    check("id", "El ID no es válido").isMongoId(),
    validarCampos,
  ],
  httpPerimetrosMusculares.activar
);

export default router;
