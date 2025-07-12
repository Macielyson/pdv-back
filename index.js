import express from 'express';
const app = express();
import morgan from 'morgan';

import path from 'path';
import { fileURLToPath } from 'url';

import cors from 'cors';

// DATABASE
// MIDDLEWARES
import './database.js';

// Configurar caminho estático
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));


app.use(express.json());
app.use(cors());
app.use(morgan('dev'));


app.set('port', 8000);

/* ROTAS */
import clienteRoutes from './src/routes/cliente.routes.js';
import categoriaRoutes from './src/routes/categoria.routes.js';
import produtoRoutes from './src/routes/produto.routes.js';
import usuarioRoutes from './src/routes/usuario.routes.js';
import vendaRoutes from './src/routes/venda.routes.js';
import orcamentoRoutes from './src/routes/orcamento.routes.js';

app.use('/cliente', clienteRoutes); // FOI FEITA
app.use('/categoria', categoriaRoutes); // FOI FEITA
app.use('/produto', produtoRoutes); // FOI FEITA
app.use('/usuario', usuarioRoutes); // FOI FEITA
app.use('/venda', vendaRoutes); // FOI FEITA
app.use('/orcamento', orcamentoRoutes); // FOI FEITA


app.listen(app.get('port'), function () {
  console.log('WS escutando porta ' + app.get('port'));
});
