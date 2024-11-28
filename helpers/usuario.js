import Administrador from "../models/usuario.js";

const helpersAdministrador = {
  existeHolderById: async (id, req) => {
    const existe = await Administrador.findById(id);

    if (!existe) {
      throw new Error(`El id no existe ${id}`);
    }

    req.req.AdministradorUpdate = existe;
  },

  desactivarAdmin: async (id, req) => {
    const rol = req.req.AdministradorUpdate.rol;

    if (rol == "admin") {
      const administradores = await Administrador.find({ rol: "admin" });
      if (administradores.length <= 1)
        throw new Error(`No se pueden desactivar todos los admin`);
    }
  },

  desactivarLogeado: async (id, req) => {
    const idLogeado = req.req.administrador._id;
    console.log(idLogeado);

    if (idLogeado == id) {
      throw new Error(`No puedes desactivarte a ti mismo`);
    }
  },

  existeIdentificacion: async (identificacion, req) => {
    if (identificacion.length < 7) throw new Error("Identificación no válida");
    const existe = await Administrador.findOne({
      $text: { $search: identificacion },
    });

    if (existe) {
      if (req.req.method === "PUT" && req.req.body._id != existe._id) {
        throw new Error(`Ya existe ese identificacion en la base de datos!!! `);
      } else if (req.req.method === "POST") {
        throw new Error(`Ya existe ese identificacion en la base de datos!!! `);
      }
    }

    req.req.AdministradorUpdate = existe;
  },

  existeTelefono: async (telefono, req) => {
    if (telefono.length != 10) throw new Error("Teléfono inválido");
    const existe = await Administrador.findOne({ telefono });

    if (existe) {
      if (req.req.method === "PUT" && req.req.body._id != existe._id) {
        throw new Error(`Ya existe ese teléfono en la base de datos!!! `);
      } else if (req.req.method === "POST") {
        throw new Error(`Ya existe ese teléfono en la base de datos!!! `);
      }
    }

    req.req.AdministradorUpdate = existe;
  },

  existeCorreo: async (correo, req) => {
    const existe = await Administrador.findOne({ correo });

    if (!existe && req.req.method === "GET") {
      throw new Error(`El correo no se encuentra registrado`);
    }

    if (existe) {
      if (req.req.method === "PUT" && req.req.body._id != existe._id) {
        throw new Error(`Ya existe ese correo en la base de datos!!! `);
      } else if (req.req.method === "POST") {
        throw new Error(`Ya existe ese correo en la base de datos!!! `);
      }
    }

    req.req.AdministradorUpdate = existe;
  },

  existeCorreoNewPass: async (correo, req) => {
    const existe = await Administrador.findOne({ correo });

    if (!existe) {
      throw new Error(`El correo no se encuentra registrado`);
    }

    req.req.AdministradorUpdate = existe;
  },

  validarPassword: async (password, req) => {
    const vali = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
    if (!vali.test(password)) {
      throw new Error("La contraseña no cumple con los requisitos.");
    }
    return true;
  },

  validarRol: async (rol, req) => {
    const roles = ["admin", "instructor", "bodega", "supervisor"];
    if (!roles.includes(rol.toLowerCase())) {
      throw new Error("Rol no válido");
    }
  },
};
export default helpersAdministrador;
