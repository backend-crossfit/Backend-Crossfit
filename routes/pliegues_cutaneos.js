import { Router } from "express";
import { check } from "express-validator";
import validarCampos from "../middlewares/validar.js";
import httpPlieguesCutaneos from "../controllers/pliegues_cutaneos.js";

const router = new Router();

// Obtener todos los registros de pliegues cutáneos
router.get("/all", httpPlieguesCutaneos.getAll);

router.get("/por-usuario/:idUsuario", httpPlieguesCutaneos.getByIdUsuario);

// Obtener un registro de pliegues cutáneos por ID
router.get(
  "/:id",
  [
    check("id", "El ID no es válido").isMongoId(),
    validarCampos,
  ],
  httpPlieguesCutaneos.getById
);



// Crear un nuevo registro de pliegues cutáneos
router.post(
  "/crear",
  [
    check("biceps", "El pliegue del bíceps es obligatorio y debe ser un número").optional().isNumeric(),
    check("triceps", "El pliegue del tríceps es obligatorio y debe ser un número").optional().isNumeric(),
    check("escapula", "El pliegue de la escápula es obligatorio y debe ser un número").optional().isNumeric(),
    check("abdomen", "El pliegue abdominal es obligatorio y debe ser un número").optional().isNumeric(),
    check("suprailiaco", "El pliegue suprailíaco es obligatorio y debe ser un número").optional().isNumeric(),
    check("pectoral", "El pliegue pectoral es obligatorio y debe ser un número").optional().isNumeric(),
    check("pierna", "El pliegue de la pierna es obligatorio y debe ser un número").optional().isNumeric(),
    check("pantorrilla", "El pliegue de la pantorrilla es obligatorio y debe ser un número").optional().isNumeric(),
    check("idUsuario", "El ID del cliente es obligatorio y debe ser un MongoId válido").not().isEmpty().isMongoId(),
    validarCampos,
  ],
  httpPlieguesCutaneos.crearOActualizarPlieguesCutaneos
);

// Inactivar un registro de pliegues cutáneos
router.put(
  "/inactivar/:id",
  [
    check("id", "El ID no es válido").isMongoId(),
    validarCampos,
  ],
  httpPlieguesCutaneos.inactivar
);

// Activar un registro de pliegues cutáneos
router.put(
  "/activar/:id",
  [
    check("id", "El ID no es válido").isMongoId(),
    validarCampos,
  ],
  httpPlieguesCutaneos.activar
);

export default router;