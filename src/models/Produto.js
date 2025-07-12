import mongoose from 'mongoose';

const produtoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    preco: {
        type: Number,
        required: true
    },
    foto: {
        type: String // pode ser uma URL ou caminho local
    },
    quantidade: {
        type: Number,
        default: 0
    },
    descricao: {
        type: String
    },
    categoriaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    }
});

const Produto = mongoose.model('Produto', produtoSchema);
export default Produto;
