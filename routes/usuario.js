import { Router } from "express";
import httpUsuario from "../controllers/usuario.js";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import validarCampos from "../middlewares/validar.js";
import helpersUsuario from "../helpers/usuario.js";

const router = new Router();

// Get all users
router.get("/all", httpUsuario.getAll);

router.get("/datos-usuario/:idUsuario", httpUsuario.obtenerDatosCompletos);

// Get user by ID
router.get(
  "/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "No es un ID válido").isMongoId(),
    validarCampos,
  ],
  httpUsuario.getById
);

// Recover password code
router.get(
  "/codigo-recuperar/:correo",
  [
    check("correo", "Por favor ingrese el correo").not().isEmpty(),
    validarCampos,
  ],
  httpUsuario.recuperarPassword
);

// Confirm recovery code
router.get(
  "/confirmar-codigo/:codigo",
  [check("codigo", "Ingrese el código").not().isEmpty(), validarCampos],
  httpUsuario.confirmarCodigo
);

// Register a new user
router.post(
  "/registro",
  [
    check("nombre", "Digite el nombre").not().isEmpty(),
    check("apellido", "Digite el apellido").not().isEmpty(),
    check("tipo_documento", "Digite el tipo de documento").not().isEmpty(),
    check("num_documento", "Digite el número de documento").not().isEmpty(),
    check("correo", "Digite el correo").not().isEmpty(),
    check("correo", "El correo no es válido").isEmail(),
    check("edad", "Digite la edad").not().isEmpty(),
    check("tipo_sexo", "Digite el tipo de sexo").not().isEmpty(),
    check("rol", "Digite el rol del usuario").not().isEmpty(),
    check("telefono", "Digite el teléfono").not().isEmpty(),
    check("password", "Digite la contraseña").not().isEmpty(),
    validarCampos,
  ],
  httpUsuario.crearUsuario
);

// User login
router.post(
  "/login",
  [
    check("num_documento", "Digite su cédula").not().isEmpty(),
    check("password", "Digite la contraseña").not().isEmpty(),
    validarCampos,
  ],
  httpUsuario.login
);

// Edit user details
router.put(
  "/editar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "No es un ID válido").isMongoId(),
    check("nombre", "Digite el nombre").not().isEmpty(),
    check("apellido", "Digite el apellido").not().isEmpty(),
    check("tipo_documento", "Digite el tipo de documento").not().isEmpty(),
    check("num_documento", "Digite el número de documento").not().isEmpty(),
    check("edad", "Digite la edad").not().isEmpty(),
    check("rol", "Digite el rol del usuario").not().isEmpty(),
    check("tipo_sexo", "Digite el tipo de sexo").not().isEmpty(),
    check("correo", "Digite el correo").not().isEmpty(),
    check("correo", "El correo no es válido").isEmail(),
    validarCampos,
  ],
  httpUsuario.editarUsuario
);

// Change user password
router.put(
  "/cambioPassword/:id",
  [
    validarJWT,
    check("id", "Digite el ID").not().isEmpty(),
    check("id", "No es un ID válido").isMongoId(),
    check("password", "Digite la contraseña actual").not().isEmpty(),
    check("newPassword", "Digite la nueva contraseña").not().isEmpty(),
    validarCampos,
  ],
  httpUsuario.putCambioPassword
);

// Update password with recovery code
router.put(
  "/nueva-password",
  [
    check("correo", "Por favor ingrese el correo").not().isEmpty(),
    check("correo").custom(helpersUsuario.existeCorreoNewPass),
    check("codigo", "Ingrese el código").not().isEmpty(),
    check("password", "Ingrese la nueva contraseña").not().isEmpty(),
    validarCampos,
  ],
  httpUsuario.actualizarPassword
);

// Deactivate a user
router.put(
  "/inactivar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "No es un ID válido").isMongoId(),
    validarCampos,
  ],
  httpUsuario.desactivarUsuario
);

// Activate a user
router.put(
  "/activar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "No es un ID válido").isMongoId(),
    validarCampos,
  ],
  httpUsuario.activarUsuario
);

export default router;
