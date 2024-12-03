import { Router } from "express";
import { check } from "express-validator";
import validarCampos from "../middlewares/validar.js";
import httpDatosAntropometricos from "../controllers/datos_antropometricos.js";

const router = new Router();

// Obtener todos los datos antropométricos
router.get("/all", httpDatosAntropometricos.getAll);

router.get("/por-usuario/:idUsuario", httpDatosAntropometricos.getByIdUsuario);

// Obtener un dato antropométrico por ID
router.get(
  "/:id",
  [
    check("id", "El ID no es válido").isMongoId(),
    validarCampos,
  ],
  httpDatosAntropometricos.getById
);

// Crear un nuevo dato antropométrico
router.post(
  "/crear",
  [
    check("estatura", "La estatura es obligatoria").not().isEmpty(),
    check("estatura", "La estatura debe ser un número").isNumeric(),
    check("peso", "El peso es obligatorio").not().isEmpty(),
    check("peso", "El peso debe ser un número").isNumeric(),
    check("idUsuario", "El ID del cliente es obligatorio").not().isEmpty(),
    check("idUsuario", "El ID del cliente no es válido").isMongoId(),
    validarCampos,
  ],
  httpDatosAntropometricos.crearOActualizarDatosAntropometricos
);

// Inactivar un dato antropométrico (cambio de estado a falso)
router.put(
  "/inactivar/:id",
  [
    check("id", "El ID no es válido").isMongoId(),
    validarCampos,
  ],
  httpDatosAntropometricos.inactivar
);

// Activar un dato antropométrico (cambio de estado a verdadero)
router.put(
  "/activar/:id",
  [
    check("id", "El ID no es válido").isMongoId(),
    validarCampos,
  ],
  httpDatosAntropometricos.activar
);

export default router;