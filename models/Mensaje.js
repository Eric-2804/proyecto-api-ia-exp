// models/Mensaje.js
import mongoose from 'mongoose';

const mensajeSchema = new mongoose.Schema({
    autor: {
        type: String,
        required: true,
        enum: ['experto1', 'experto2'], // Solo permite estos dos valores
    },
    texto: {
        type: String,
        required: true,
    },
    
    fecha: {
        type: Date,
        default: Date.now, // Se asigna automáticamente al guardar
    },
});

// Exportamos el modelo para poder usarlo en rutas/controladores
export default mongoose.model('Mensaje', mensajeSchema);
