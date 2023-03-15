import type {NextApiResponse} from 'next';
import type {RespostaPadraoMsg} from '../../types/respostaPadraoMsg';
import nc from 'next-connect';
import {upload, uploadImagemCosmic} from '../../services/uploadImagemCosmic';
import {conectarMongoDB} from '../../middlewares/conectarMongoDb';
import {validarTokenJWT} from '../../middlewares/validarTokenJwt';
import {LivroModel} from '../../models/livroModels';
import {UsuarioModel} from '../../models/usuarioModels';

const handler = nc()
    .use(upload.single('file'))
    .post(async (req : any, res : NextApiResponse<RespostaPadraoMsg>) => {
        try{
            const {userId} = req.query;
            const usuario = await UsuarioModel.findById(userId);
            if(!usuario){
                return res.status(400).json({erro : 'Usuario não encontrado'});
            }

            if(!req || !req.body){
                return res.status(400).json({erro : 'Parametros de entrada não informados'});
            }

            const {titulo} = req?.body;
            if(!titulo || titulo.length < 2){
                return res.status(400).json({erro : 'Titulo não é valida'});
            }

            const {autor} = req?.body;
            if(!autor || autor.length < 2){
                return res.status(400).json({erro : 'Autor não é valido'});
            }

            const {editora} = req?.body;
            if(!editora || editora.length < 2){
                return res.status(400).json({erro : 'Editora não é valida'});
            }

            if(!req.file || !req.file.originalname){
                return res.status(400).json({erro : 'Imagem é obrigatoria'});
            }

            const image = await uploadImagemCosmic(req);
            const livro = {
                idUsuario : usuario._id,
                titulo,
                autor,
                editora,
                foto : image.media.url,
                data : new Date()
            }

            usuario.livros++;
            await UsuarioModel.findByIdAndUpdate({_id : usuario._id}, usuario);

            await LivroModel.create(livro);
            return res.status(200).json({msg : 'Livro cadastrado com sucesso'});
        }catch(e){
            console.log(e);
            return res.status(400).json({erro : 'Erro ao cadastrar livro'});
        }
});

export const config = {
    api : {
        bodyParser : false
    }
}

export default validarTokenJWT(conectarMongoDB(handler));