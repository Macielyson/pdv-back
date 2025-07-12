import express from 'express';
import Usuario from '../models/Usuario.js';

const router = express.Router();

// 🔍 Listar todos os usuários
router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json({ error: false, usuarios });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

// 🔍 Buscar usuário por ID
router.get('/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar o usuário.' });
    }
});

// ➕ Criar novo usuário
router.post('/', async (req, res) => {
    try {
        const usuario = new Usuario(req.body);
        await usuario.save();
        res.json({ error: false, usuario });
    } catch (error) {
        res.json({ error: true, message: error.message });
    }
});

// ✏️ Atualizar um usuário
router.put('/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }
        res.json({ error: false, usuario });
    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
});

// ❌ Deletar um usuário
router.delete('/:id', async (req, res) => {
    try {
        const usuarioDeletado = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuarioDeletado) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }
        res.json({ error: false, message: 'Usuário excluído com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

// Rota de Login
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(404).json({ error: true, message: 'Usuário não encontrado.' });
        }

        if (usuario.senha !== senha) {
            return res.status(401).json({ error: true, message: 'Senha incorreta.' });
        }

        // ✅ Login bem-sucedido
        res.json({ error: false, message: 'Login realizado com sucesso!', usuario });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Erro ao realizar login.' });
    }
});


export default router;
