const mysql = require('mysql2');

const conexion = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '', 
  database: 'prueba_pasante'
});

conexion.connect((error) => {
  if (error) {
    console.error('Error conectando a MySQL:', error);
    return;
  }
  console.log('Conexión a MySQL exitosa');
});

module.exports = conexion;
