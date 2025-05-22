import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import rutasMensajes from './routes/mensajes.routes.js';

// Cargar variables de entorno del archivo .env
dotenv.config();

const app = express();

// Middleware para leer JSON y permitir peticiones externas
app.use(express.json());
app.use(cors());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Rutas API
app.use('/api', rutasMensajes);

// Puerto donde se ejecutará la app
const PORT = process.env.PORT || 3200;

// Conexión a MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Conectado a MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ Error al conectar a MongoDB:', error);
    });