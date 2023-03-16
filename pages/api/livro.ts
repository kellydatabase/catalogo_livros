import type { NextApiRequest, NextApiResponse } from "next";
import {validarTokenJWT} from '../../middlewares/validarTokenJwt';
import type {RespostaPadraoMsg} from '../../types/respostaPadraoMsg';
import { conectarMongoDB } from "@/middlewares/conectarMongoDb";
import { LivroModel } from "@/models/livroModels";
import nc from 'next-connect';
import{upload, uploadImagemCosmic} from '../../services/uploadImagemCosmic';

const handler = nc()
.use(upload.single('file'))
.put(async(req : any, res : NextApiResponse<RespostaPadraoMsg>) => {
    try{
       const {livroId} = req?.query;
       const {livro} = await LivroModel.findById(livroId);
        
        if(!livro){
         return res.status(400).json({erro : 'livro não encontrado'});
        }

        const {titulo} = req?.body;
        if(titulo && titulo.length > 2){
            livro.titulo = titulo;
        }

        const {file} = req;
        if(file && file.originalname){
            const image = await uploadImagemCosmic(req);
            if(image && image.media && image.media.url){
                livro.foto = image.media.url;
            } 
        }

        await LivroModel
            .findByIdAndUpdate({_id : livro._id}, livro);

        return res.status(200).json({msg : 'Livro alterado com sucesso'});
    }catch(e){
        console.log(e);
        return res.status(400).json({erro : 'Nao foi possivel atualizar livro:' + e});
    }
})
.get(async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any>) => {
    try{
        const {livroId} = req?.query;
        const livro = await LivroModel.findById(livroId);
        console.log('livro', livro);
              return res.status(200).json(livro);
    }catch(e){
        console.log(e);
    }

    return res.status(400).json({erro : 'Nao foi possivel obter dados do livro'})
});

export const config = {
api : {
    bodyParser : false
}
}

export default conectarMongoDB(handler);