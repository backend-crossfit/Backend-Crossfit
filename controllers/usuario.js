import bcryptjs from "bcryptjs";
import Usuario from "../models/usuario.js";
import nodemailer from "nodemailer";
import { generarJWT } from "../middlewares/validar-jwt.js";

let codigoEnviado = {}; // Almacena temporalmente el código de verificación

function generarCodigoAleatorio() {
  const primerDigito = Math.floor(Math.random() * 9) + 1;
  const restoNumero = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
  const numero = primerDigito + restoNumero;
  const fechaCreacion = new Date();
  codigoEnviado = { codigo: numero, fechaCreacion };

  return numero;
}

const httpUsuario = {
  // Obtener todos los usuarios
  getAll: async (req, res) => {
    try {
      const usuarios = await Usuario.find();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  // Obtener usuario por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findById(id);
      if (!usuario) {
        res.status(404).json({ message: "Usuario no encontrado" });
      } else {
        res.json(usuario);
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  // Crear un usuario
  crearUsuario: async (req, res) => {
    try {
      const { nombre, apellido, tipo_documento, num_documento, edad, rol, tipo_sexo, correo, password } = req.body;

      const usuarioExistente = await Usuario.findOne({ correo });
      if (usuarioExistente) {
        return res.status(400).json({ error: "El correo ya está registrado" });
      }

      const usuario = new Usuario({
        nombre,
        apellido,
        tipo_documento,
        num_documento,
        edad,
        rol,
        tipo_sexo,
        correo,
        password,
        codigo_verificacion: generarCodigoAleatorio(),
      });

      const salt = bcryptjs.genSaltSync();
      usuario.password = bcryptjs.hashSync(password, salt);

      await usuario.save();

      res.status(201).json(usuario);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  // Actualizar un usuario
  editarUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, apellido, tipo_documento, num_documento, edad, rol, tipo_sexo, correo } = req.body;

      const usuario = await Usuario.findByIdAndUpdate(
        id,
        { nombre, apellido, tipo_documento, num_documento, edad, rol, tipo_sexo, correo },
        { new: true }
      );

      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  // Eliminar un usuario
  eliminarUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByIdAndDelete(id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json({ message: "Usuario eliminado con éxito" });
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  // Login de usuario
  login: async (req, res) => {
    try {
      const { correo, password } = req.body;
      const usuario = await Usuario.findOne({ correo });

      if (!usuario || !bcryptjs.compareSync(password, usuario.password)) {
        return res.status(400).json({ error: "Correo o contraseña incorrectos" });
      }

      if (!usuario.estado) {
        return res.status(400).json({ error: "Usuario inactivo" });
      }

      const token = await generarJWT(usuario.id);
      res.json({ usuario, token });
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  // Recuperar contraseña
  recuperarPassword: async (req, res) => {
    try {
      const { correo } = req.body;

      const usuario = await Usuario.findOne({ correo });
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const codigo = generarCodigoAleatorio();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.userEmail,
          pass: process.env.password,
        },
      });

      const mailOptions = {
        from: process.env.userEmail,
        to: correo,
        subject: "Recuperación de Contraseña",
        text: `Tu código para restablecer tu contraseña es: ${codigo}`,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          return res.status(500).json({ error: "Error al enviar el correo" });
        }
        res.json({ message: "Correo enviado con éxito" });
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  // Confirmar código de recuperación
  confirmarCodigo: async (req, res) => {
    try {
      const { codigo } = req.body;

      if (!codigoEnviado || codigo !== codigoEnviado.codigo) {
        return res.status(400).json({ error: "Código incorrecto o no generado" });
      }

      const tiempoDiferencia = new Date() - codigoEnviado.fechaCreacion;
      if (tiempoDiferencia / (1000 * 60) > 30) {
        return res.status(400).json({ error: "El código ha expirado" });
      }

      res.json({ message: "Código verificado con éxito" });
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  // Actualizar contraseña
  actualizarPassword: async (req, res) => {
    try {
      const { correo, password } = req.body;

      const usuario = await Usuario.findOne({ correo });
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const salt = bcryptjs.genSaltSync();
      const newPassword = bcryptjs.hashSync(password, salt);

      usuario.password = newPassword;
      await usuario.save();

      res.json({ message: "Contraseña actualizada con éxito" });
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  putCambioPassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { password, newPassword } = req.body;
      const administrador = await Administrador.findById(id);

      if (!administrador) {
        return res.status(404).json({ error: "Administrador no encontrado" });
      }

      const passAnterior = administrador.password;

      const validPassword = bcryptjs.compareSync(
        String(password),
        String(passAnterior)
      );

      if (!validPassword) {
        return res.status(401).json({ error: "Contraseña actual incorrecta" });
      }

      const salt = bcryptjs.genSaltSync();
      const cryptNewPassword = bcryptjs.hashSync(newPassword, salt);

      await Administrador.findByIdAndUpdate(
        administrador.id,
        { password: cryptNewPassword },
        { new: true }
      );

      return res.status(200).json({ msg: "Contraseña actualizada con éxito" });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msgError: "Error interno del servidor", error });
    }
  },

  // Activar usuario
  activarUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByIdAndUpdate(id, { estado: true }, { new: true });
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  // Desactivar usuario
  desactivarUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true });
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error });
    }
  },
};

export default httpUsuario;