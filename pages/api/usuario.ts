import type { NextApiRequest, NextApiResponse } from "next";
import {validarTokenJWT} from '../../middlewares/validarTokenJwt';
import type {RespostaPadraoMsg} from '../../types/respostaPadraoMsg';
import { conectarMongoDB } from "@/middlewares/conectarMongoDb";
import { UsuarioModel } from "@/models/usuarioModels";

const usuarioEndpoint =async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any>) =>{
    try {
    const{userId} = req?.query;
    const usuario = await UsuarioModel.findById(userId);
    usuario.senha = null;
    return res.status(200).json(usuario);
    } catch (e) {
        console.log(e)
    }

    return res.status(400).json( {erro: 'não foi possivel obter dados'});
}
export default validarTokenJWT(conectarMongoDB(usuarioEndpoint));