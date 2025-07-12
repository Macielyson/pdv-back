import express from 'express';
import Categoria from '../models/Categoria.js';

const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
  try {
    const categoria = new Categoria(req.body);
    await categoria.save();
    res.json({ error: false, categoria });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json({ error: false, categorias });

  } catch (err) {
    res.json({ error: true, message: err.message })
  }
});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    res.json({ error: false, categoria });
  } catch (err) {
    res.json({ error: true, message: err.message })
  }

});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ error: false, categoria });
  } catch (err) {
    res.json({ error: true, message: err.message })
  }

});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Categoria.findByIdAndDelete(req.params.id);
    res.json({ error: false, message: 'Categoria removida' });
  } catch (err) {
    res.json({ error: true, message: err.message })
  }

});

export default router;
