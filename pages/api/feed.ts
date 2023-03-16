import type { NextApiRequest, NextApiResponse } from "next";
import {validarTokenJWT} from '../../middlewares/validarTokenJwt';
import type {RespostaPadraoMsg} from '../../types/respostaPadraoMsg';
import { conectarMongoDB } from "@/middlewares/conectarMongoDb";
import { LivroModel } from "@/models/livroModels";






const livroEndpoint = async(req : any, res : NextApiResponse<RespostaPadraoMsg | any>) => {
    try {
        if(req.method === 'GET'){
            if(req?.query.id){
                 //agora tenho o id do usuario
                //como eu valido se o usuario é válido                
                const livro = await LivroModel.findById(req?.query?.id);          
                    if(!livro){
                    return res.status(400).json({erro : 'Usuario nao encontrado'});                  
                }
                // e como eu busco as publicações
                const livros = await LivroModel
                .find({_id : -1})
                .sort({data : -1});
                return res.status(200).json(livros);
            }        
        }
        res.status(405).json({erro: 'Metodo informado não é válido'});
    } catch (e) {
        console.log(e);
    }
    return res.status(400).json({erro: 'Não foi possivel obter os livros'});

}

export default validarTokenJWT(conectarMongoDB(livroEndpoint));