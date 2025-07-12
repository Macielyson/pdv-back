import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // impede que emails duplicados sejam cadastrados
        lowercase: true,
        trim: true,
    },
    senha: {
        type: String,
        required: true,
    },
    tipo: {
        type: String,
        enum: ['user', 'adm'],
        default: 'user',
    },
}, {
    timestamps: true, // adiciona createdAt e updatedAt automaticamente
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

export default Usuario;
