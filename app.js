import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Cargar variables de entorno del archivo .env
dotenv.config();

const app = express();

// Middleware para leer JSON y permitir peticiones externas
app.use(express.json());
app.use(cors());

// Puerto donde se ejecutará la app
const PORT = process.env.PORT || 3200;

// Conexión a MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Conectado a MongoDB');
        // Iniciar el servidor solo si la conexión es exitosa
        app.listen(PORT, () => {
            console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ Error al conectar a MongoDB:', error);
    });

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});