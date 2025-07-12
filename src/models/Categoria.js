import mongoose from 'mongoose';

const categoriaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    }
});

const Categoria = mongoose.model('Categoria', categoriaSchema);
export default Categoria;
