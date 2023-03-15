import mongoose, {Schema}from "mongoose";

const LivroShema = new Schema({
    idUsuario : {type : String, required : true},
    titulo: {type: String, required : true},
    autor: {type : String, required : true},
    editora: {type : String, required : true},
    foto: {type : String, required: false},
    data : {type : Date, required : true},
   });

export const LivroModel = (mongoose.models.Livros ||
    mongoose.model('Livros', LivroShema));
