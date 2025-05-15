// routes/mensajes.routes.js
import express from 'express';
import { obtenerHistorial, guardarMensaje } from '../controllers/mensajes.controller.js';
import { generarRespuestaExperto1 } from '../controllers/mensajes.controller.js';

const router = express.Router();

// Ruta GET para obtener el historial completo
router.get('/historial', obtenerHistorial);

// Ruta POST guardar nuevo mensaje
router.post('/mensaje', guardarMensaje);

//Ruta POST para generar respuesta del experto 1
router.post('/generar-respuesta-experto1', generarRespuestaExperto1);


export default router;
