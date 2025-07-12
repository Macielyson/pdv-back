import mongoose from 'mongoose';

const VendaSchema = new mongoose.Schema({
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: false, // ← cliente opcional
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  itens: [
    {
      produtoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produto',
        required: true,
      },
      nome: String,
      quantidade: {
        type: Number,
        required: true,
        min: 1,
      },
      preco: {
        type: Number,
        required: true,
      },
    },
  ],
  formaPagamento: {
    type: String,
    enum: ['dinheiro', 'cartão', 'cred-loja', 'pix'],
    required: true,
  },
  entrada: {
    type: Number,
    required: false,
  },
  parcelas: {
    type: Number,
    default: 1,
  },
  dataVencimento: {
    type: Date,
    required: false,
  },
  parcelasDetalhes: [
    {
      numero: Number,
      valor: Number,
      dataVencimento: Date,
      status: {
        type: String,
        enum: ['pago', 'pendente' ],
        default: 'pendente',
      },
      dataPagamento: Date,
    },
  ],
  desconto: Number,
  acrescimo: Number,
  descricao: String,
  subtotal: Number,
  valorRestante: Number,
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pendente', 'finalizada', 'aguardando'],
    default: 'pendente', // ← melhor para lógica condicional
  },
  dataHora: Date,
});


const Venda = mongoose.model('Venda', VendaSchema);

export default Venda;
