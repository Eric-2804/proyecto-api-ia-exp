// controllers/mensajes.controller.js
import Mensaje from '../models/Mensaje.js';

// GET: obtener historial completo
export const obtenerHistorial = async (req, res) => {
    try {
        const mensajes = await Mensaje.find().sort({ fecha: 1 }); // Ordenado por fecha ascendente
        res.json(mensajes);
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({ error: 'Error al obtener el historial de mensajes.' });
    }
};

// POST: guardar nuevo mensaje
export const guardarMensaje = async (req, res) => {
    try {
        const { autor, texto } = req.body;

        // Validación simple
        if (!autor || !texto) {
            return res.status(400).json({ error: 'Faltan campos obligatorios (autor, texto).' });
        }

        const nuevoMensaje = new Mensaje({ autor, texto });
        const mensajeGuardado = await nuevoMensaje.save();

        res.status(201).json(mensajeGuardado);
    } catch (error) {
        console.error('Error al guardar mensaje:', error);
        res.status(500).json({ error: 'No se pudo guardar el mensaje.' });
    }
};

import { obtenerRespuestaGemini } from '../services/gemini.service.js';

export const generarRespuestaExperto1 = async (req, res) => {
    try {
        // 1. Obtener historial desde MongoDB
        const mensajes = await Mensaje.find().sort({ fecha: 1 });

        // 2. Convertir el historial a texto
        const historialTexto = mensajes
            .map((m) => `${m.autor === 'experto1' ? 'Experto 1' : 'Experto 2'}: ${m.texto}`)
            .join('\n');

        // 3. Armar prompt para el experto 1
        const prompt = `
Actúa como un físico teórico con décadas de experiencia en campos como la relatividad general, la mecánica cuántica y la teoría de cuerdas.

Tu estilo de comunicación es técnico, claro y basado en evidencia científica. Siempre respondes con precisión y haces referencia a teorías reconocidas dentro de la física moderna.

Siempre analiza cualquier pregunta desde la perspectiva del método científico, el empirismo y la lógica matemática. No aceptas afirmaciones que no se puedan justificar con modelos físicos o evidencia empírica.

Historial de la conversación hasta ahora:
${historialTexto}

Por favor, responde de forma coherente con tu identidad, conocimientos y estilo.
    `;

        // 4. Llamar a Gemini
        const respuesta = await obtenerRespuestaGemini(prompt);

        // 5. Guardar la respuesta en MongoDB
        const nuevoMensaje = new Mensaje({
            autor: 'experto1',
            texto: respuesta,
        });
        await nuevoMensaje.save();

        res.status(201).json(nuevoMensaje);
    } catch (error) {
        console.error('Error al generar respuesta:', error);
        res.status(500).json({ error: 'No se pudo generar la respuesta del experto.' });
    }
};
