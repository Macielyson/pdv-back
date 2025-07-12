import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    endereco: {
        type: String
    }
});

const Cliente = mongoose.model('Cliente', clienteSchema);
export default Cliente;
