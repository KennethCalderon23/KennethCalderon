const express = require('express');
const router = express.Router();
const conexion = require('../database');

// Listar productos activos
router.get('/', (req, res) => {
  conexion.query('SELECT * FROM productos WHERE activo = 1', (err, resultados) => {
    if (err) return res.status(500).json({ error: err });
    res.json(resultados);
  });
});

// Obtener producto por ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  conexion.query('SELECT * FROM productos WHERE id = ? AND activo = 1', [id], (err, resultados) => {
    if (err) return res.status(500).json({ error: err });
    if (resultados.length === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(resultados[0]);
  });
});

// Crear un producto
router.post('/', (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  conexion.query('INSERT INTO productos (nombre, descripcion, precio) VALUES (?, ?, ?)', [nombre, descripcion, precio], (err, resultado) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ mensaje: 'Producto creado', id: resultado.insertId });
  });
});

// Actualizar un producto
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, descripcion, precio } = req.body;
  conexion.query('UPDATE productos SET nombre = ?, descripcion = ?, precio = ? WHERE id = ?', [nombre, descripcion, precio, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ mensaje: 'Producto actualizado' });
  });
});

// Eliminar un producto
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  conexion.query('UPDATE productos SET activo = 0 WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ mensaje: 'Producto eliminado (soft delete)' });
  });
});

module.exports = router;
