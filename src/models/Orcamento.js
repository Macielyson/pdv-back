import mongoose from 'mongoose';
import Venda from './Venda.js';

// Acessa o schema através do modelo
const Orcamento = mongoose.model('Orcamento', Venda.schema);

export default Orcamento;