require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes'); // Asegúrate de que la ruta sea la correcta

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Conexión a MongoDB
const dbURI = process.env.DB_CONNECT;
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('Conectado a la base de datos MongoDB en la nube');
  })
  .catch(err => {
    console.error('Error al conectar con MongoDB en la nube', err);
  });

// Usar las rutas
app.use('/api', routes);

app.post('/test', (req, res) => {
    res.send('Test successful');
  });

// Iniciar el servidor de Express
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
