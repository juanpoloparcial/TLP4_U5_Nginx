import { Router } from 'express';
import Task from '../models/task';
import { Types } from 'mongoose';

const router = Router();

// Listar
router.get('/', async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});

// Obtener uno
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

// Crear
router.post('/', async (req, res) => {
  try {
    const { titulo, descripcion, estado } = req.body;
    if (!titulo) return res.status(400).json({ message: 'El titulo es requerido' });
    const newTask = new Task({ titulo, descripcion, estado });
    const saved = await newTask.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task', error: err });
  }
});

// Editar
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
  const { titulo, descripcion, estado } = req.body;
  const updated = await Task.findByIdAndUpdate(id, { titulo, descripcion, estado }, { new: true });
  if (!updated) return res.status(404).json({ message: 'Task not found' });
  res.json(updated);
});

// Eliminar
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
  const deleted = await Task.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: 'Task not found' });
  res.json({ message: 'Deleted' });
});

export default router;
