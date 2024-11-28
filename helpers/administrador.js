import Administrador from "../models/usuario.js";

const helpersAdministrador = {
  // Verifica si el administrador existe por ID
  existeHolderById: async (id, req) => {
    const existe = await Administrador.findById(id);

    if (!existe) {
      throw new Error(`El ID no existe: ${id}`);
    }

    req.req.AdministradorUpdate = existe;
  },

  // Verifica si la cédula ya existe en la base de datos
  existeCedula: async (cedula, req) => {
    if (cedula.length < 7) throw new Error("Cédula no válida");
    const existe = await Administrador.findOne({ cedula });

    if (existe) {
      if (req.req.method === "PUT" && req.req.body._id != existe._id) {
        throw new Error(`Ya existe esa cédula en la base de datos`);
      } else if (req.req.method === "POST") {
        throw new Error(`Ya existe esa cédula en la base de datos`);
      }
    }

    req.req.AdministradorUpdate = existe;
  },

  // Verifica si el correo ya existe en la base de datos
  existeCorreo: async (correo, req) => {
    const existe = await Administrador.findOne({ correo });

    if (!existe && req.req.method === "GET") {
      throw new Error(`El correo no se encuentra registrado`);
    }

    if (existe) {
      if (req.req.method === "PUT" && req.req.body._id != existe._id) {
        throw new Error(`Ya existe ese correo en la base de datos`);
      } else if (req.req.method === "POST") {
        throw new Error(`Ya existe ese correo en la base de datos`);
      }
    }

    req.req.AdministradorUpdate = existe;
  },

  // Verifica si el teléfono ya existe en la base de datos
  existeTelefono: async (telefono, req) => {
    if (telefono.length != 10) throw new Error("Teléfono inválido");
    const existe = await Administrador.findOne({ telefono });

    if (existe) {
      if (req.req.method === "PUT" && req.req.body._id != existe._id) {
        throw new Error(`Ya existe ese teléfono en la base de datos`);
      } else if (req.req.method === "POST") {
        throw new Error(`Ya existe ese teléfono en la base de datos`);
      }
    }

    req.req.AdministradorUpdate = existe;
  },

  // Valida que la contraseña cumpla con los requisitos
  validarPassword: async (password, req) => {
    const vali = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
    if (!vali.test(password)) {
      throw new Error("La contraseña no cumple con los requisitos.");
    }
    return true;
  },
};

export default helpersAdministrador;
