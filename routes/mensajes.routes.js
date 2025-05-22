// routes/mensajes.routes.js
import express from 'express';
import { obtenerHistorial, guardarMensaje } from '../controllers/mensajes.controller.js';
import { generarRespuestaExperto1 } from '../controllers/mensajes.controller.js';
import { generarRespuestaExperto2 } from '../controllers/mensajes.controller.js';
import { limpiarHistorial } from '../controllers/mensajes.controller.js';
import { exportarHistorialPDF } from '../controllers/mensajes.controller.js';


const router = express.Router();

// Ruta GET para obtener el historial completo
router.get('/historial', obtenerHistorial);

// Ruta POST guardar nuevo mensaje
router.post('/mensaje', guardarMensaje);

//Ruta POST para generar respuesta del experto 1
router.post('/generar-respuesta-experto1', generarRespuestaExperto1);

//Ruta POST para generar respuesta del experto 2
router.post('/generar-respuesta-experto2', generarRespuestaExperto2);

//Ruta POST para limpiar el historial de los expertos
router.delete('/historial', limpiarHistorial);

//Ruta POST para exportar el historial a PDF
router.get('/exportar-pdf', exportarHistorialPDF);



export default router;
