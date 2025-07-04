const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const conexion = require('./database');

const miapp = express();

miapp.use(cors());
miapp.use(bodyParser.json());

miapp.get('/', (req, res) => {
  res.send('Servidor conectado correctamente ✅');
});


// Listar productos activos
miapp.get('/api/productos', (req, res) => {
  conexion.query('SELECT * FROM productos WHERE activo = 1', (error, results) => {
    if (error) return res.status(500).json(error);
    res.json(results);
  });
});

// Crear un producto
miapp.post('/api/productos', (req, res) => {
  const { nombre, descripcion } = req.body;
  const precio = parseFloat(req.body.precio);
  const sql = 'INSERT INTO productos (nombre, descripcion, precio) VALUES (?, ?, ?)';
  conexion.query(sql, [nombre, descripcion, precio], (error, results) => {
    if (error) return res.status(500).json(error);
    res.json({ id: results.insertId, nombre, descripcion, precio });
  });
});

// Obtener producto por ID
miapp.get('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  conexion.query('SELECT * FROM productos WHERE id = ?', [id], (error, results) => {
    if (error) return res.status(500).json(error);
    if (results.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(results[0]);
  });
});

// Actualizar producto
miapp.put('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio } = req.body;
  const sql = 'UPDATE productos SET nombre = ?, descripcion = ?, precio = ? WHERE id = ?';
  conexion.query(sql, [nombre, descripcion, precio, id], (error) => {
    if (error) return res.status(500).json(error);
    res.json({ message: 'Producto actualizado' });
  });
});

// Eliminar producto
miapp.delete('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'UPDATE productos SET activo = 0 WHERE id = ?';
  conexion.query(sql, [id], (error) => {
    if (error) return res.status(500).json(error);
    res.json({ message: 'Producto eliminado' });
  });
});

const PORT = 3000;
miapp.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
