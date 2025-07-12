import express from 'express';
import Cliente from '../models/Cliente.js';

const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
  try {
    const cliente = new Cliente(req.body);
    await cliente.save();
    res.json({ error: false, cliente })
  } catch (err) {
    res.json({ error: true, message: err.message })
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json({ error: false, clientes });
  } catch (err) {
    res.json({ error: true, message: err.message })
  }

});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    res.json({ error: false, cliente });
  } catch (err) {
    res.json({ error: true, message: err.message })
  }

});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ error: false, cliente });
  } catch (err) {
    res.json({ error: true, message: err.message })
  }

});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Cliente.findByIdAndDelete(req.params.id);
    res.json({ error: false, message: 'Cliente removido' });
  } catch (err) {
    res.json({ error: true, message: err.message })
  }

});

export default router;
