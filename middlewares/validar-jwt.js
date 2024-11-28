import jwt from "jsonwebtoken"
import Administrador from "../models/usuario.js";

const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: "24h"
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject("No se pudo generar el token")
            } else {
                resolve(token)
            }
        })
    })
}

const validarJWT = async (req, res, next) => {
    const token = req.header("x-token");
    if (!token) {
        return res.status(401).json({
            error: "No hay token en la peticion"
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        let usuario = await Administrador.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                error: "Token no válido"//- usuario no existe DB
            })
        }


        if (usuario.estado == 0) {
            return res.status(401).json({
                error: "Token no válido" //- usuario con estado: false
            })
        }
        req.usuario=usuario

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            error
        })
    }
}


export { generarJWT, validarJWT }