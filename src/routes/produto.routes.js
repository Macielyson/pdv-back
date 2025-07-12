import express from 'express';
import Produto from '../models/Produto.js';
import upload from '../middlewares/upload.js';

import fs from 'fs';
import path from 'path';

const router = express.Router();

// CREATE
router.post('/', upload.single('foto'), async (req, res) => {
  try {
    const { nome, preco, quantidade, descricao, categoriaId } = req.body;
    const foto = req.file ? `/uploads/${req.file.filename}` : '';
    const produto = new Produto({
      nome,
      preco,
      quantidade,
      descricao,
      categoriaId,
      foto
    });

    await produto.save();
    res.json({ error: false, produto });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    const produtos = await Produto.find().populate('categoriaId', 'nome');
    res.json({ error: false, produtos });
  } catch (err) {
    res.json({ error: true, message: err.message })
  }

});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id).populate('categoria');
    res.json({ error: false, produto })
  } catch (err) {
    res.json({ error: true, message: "produto nao encontrado" })
  }

});

// UPDATE
router.put('/:id', upload.single('foto'), async (req, res) => {
  try {
    const { nome, preco, quantidade, descricao, categoriaId } = req.body;

    const produtoAntigo = await Produto.findById(req.params.id);
    if (!produtoAntigo) {
      return res.status(404).json({ error: true, message: 'Produto não encontrado' });
    }

    const updateData = { nome, preco, quantidade, descricao, categoriaId }

    // Se enviou nova foto, atualiza também o campo foto
    if (req.file) {
      // deletar foto antiga se existir
      if (produtoAntigo.foto) {
        const caminhoFotoAntiga = path.join('src', produtoAntigo.foto);
        fs.unlink(caminhoFotoAntiga, (err) => {
          if (err) {
            console.error('Erro ao deletar a foto antiga:', err.message);
          }
        });
      }
      // Atualizar o campo foto
      updateData.foto = `/uploads/${req.file.filename}`;
    }
    const produtoAtualizado = await Produto.findByIdAndUpdate(req.params.id, updateData, { new: true });


    res.json({ error: false, produto: produtoAtualizado });

  } catch (err) {
    res.status(500).json({ error: true, message: err.message })
  }

});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);

    if (!produto) {
      return res.status(404).json({ error: true, message: 'Produto não encontrado' });
    }

    // Se o produto tiver uma foto, deletar o arquivo da pasta uploads
    if (produto.foto) {
      const caminhoFoto = path.join('src', produto.foto);
      fs.unlink(caminhoFoto, (err) => {
        if (err) {
          console.error('Erro ao deletar a foto:', err.message);
        }
      });
    }

    // Excluir o produto do banco
    await Produto.findByIdAndDelete(req.params.id);

    res.json({ error: false, message: 'Produto removido' });
  } catch (err) {
    res.json({ error: true, message: err.message })
  }

});

export default router;
