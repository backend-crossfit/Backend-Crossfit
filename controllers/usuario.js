import bcryptjs from "bcryptjs";
import Usuario from "../models/usuario.js";
import DatosAntropometricos from "../models/datos_antropometricos.js";
import PerimetrosMusculares from "../models/perimetros_musculares.js";
import PliegueCutaneo from "../models/pliegues_cutaneos.js";
import nodemailer from "nodemailer";
import { generarJWT } from "../middlewares/validar-jwt.js";

let codigoEnviado = {}; // Almacena temporalmente el código de verificación

function generarCodigoAleatorio() {
  const primerDigito = Math.floor(Math.random() * 9) + 1;
  const restoNumero = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
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

  obtenerDatosCompletos: async (req, res) => {
    try {
      const { idUsuario } = req.params;

      // Verificar si el usuario existe
      const usuario = await Usuario.findById(idUsuario);
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Consultar datos relacionados
      const datosAntropometricos = await DatosAntropometricos.findOne({ idUsuario }).populate('idUsuario');
      const perimetrosMusculares = await PerimetrosMusculares.findOne({ idUsuario }).populate('idUsuario');
      const plieguesCutaneos = await PliegueCutaneo.findOne({ idUsuario }).populate('idUsuario');


      // Responder con los datos
      res.status(200).json({
        usuario: {
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          num_documento: usuario.num_documento,
          correo: usuario.correo,
          telefono: usuario.telefono,
          _id: usuario._id,
          estado: usuario.estado,
        },
        datos: {
          antropometricos: datosAntropometricos || {},
          perimetrosMusculares: perimetrosMusculares || {},
          plieguesCutaneos: plieguesCutaneos || {},
        },
      });
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },


  // Crear un usuario
  crearUsuario: async (req, res) => {
    try {
      const {
        nombre,
        apellido,
        tipo_documento,
        num_documento,
        edad,
        rol,
        tipo_sexo,
        correo,
        telefono,
        password,
      } = req.body;

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
        telefono,
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
      const {
        nombre,
        apellido,
        tipo_documento,
        num_documento,
        edad,
        rol,
        tipo_sexo,
        correo,
        telefono,
        password,
      } = req.body;

      // Encontrar el usuario antes de actualizar
      const usuario = await Usuario.findById(id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Actualizar los campos enviados en el cuerpo
      if (nombre) usuario.nombre = nombre;
      if (apellido) usuario.apellido = apellido;
      if (tipo_documento) usuario.tipo_documento = tipo_documento;
      if (num_documento) usuario.num_documento = num_documento;
      if (edad) usuario.edad = edad;
      if (rol) usuario.rol = rol;
      if (tipo_sexo) usuario.tipo_sexo = tipo_sexo;
      if (correo) usuario.correo = correo;
      if (telefono) usuario.telefono = telefono;

      // Encriptar la contraseña solo si se envía una nueva
      if (password) {
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);
      }

      // Guardar los cambios en la base de datos
      const usuarioActualizado = await usuario.save();

      res.json(usuarioActualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
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
      const { num_documento, password } = req.body;
      const usuario = await Usuario.findOne({ num_documento });

      if (!usuario || !bcryptjs.compareSync(password, usuario.password)) {
        return res
          .status(400)
          .json({ error: "Usuario o contraseña incorrectos" });
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
      const { correo } = req.params;

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
      const { codigo } = req.params;

      if (!codigoEnviado || codigo !== codigoEnviado.codigo) {
        return res
          .status(400)
          .json({ error: "Código incorrecto o no generado" });
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
      const usuario = await Usuario.findByIdAndUpdate(
        id,
        { estado: true },
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

  // Desactivar usuario
  desactivarUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByIdAndUpdate(
        id,
        { estado: false },
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
};

export default httpUsuario;
