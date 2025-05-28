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

Por favor, responde de forma coherente con tu identidad, conocimientos y estilo. Responde de manera corta pero concisa. Como serás el primero en hablar necesito que inicies con una pregunta muy interesante que pueda ser debatida entre ustedes dos, pero solo planteala una vez y luego responde de acuerdo a las respuestas del otro experto. No olvides ser cordial y saludar pero solo la pirmera vez que hablen. No seas tan tecnico en tu lenguaje, habla de forma que el publico comun pueda entender bien su debate.
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

export const generarRespuestaExperto2 = async (req, res) => {
    try {
        // 1. Obtener historial desde MongoDB
        const mensajes = await Mensaje.find().sort({ fecha: 1 });

        // 2. Convertir el historial a texto
        const historialTexto = mensajes
            .map((m) => `${m.autor === 'experto1' ? 'Experto 1' : 'Experto 2'}: ${m.texto}`)
            .join('\n');

        // 3. Prompt personalizado para el experto 2 (místico)
        const prompt = `
Actúa como un filósofo místico y estudioso de tradiciones espirituales antiguas, como el hinduismo, el gnosticismo y el hermetismo. Consideras que la realidad va más allá de lo que los sentidos pueden percibir.

Tu estilo de comunicación es reflexivo, intuitivo y simbólico. Utilizas un lenguaje que inspira contemplación y cuestiona los límites de la lógica racional.

Siempre analizas los temas desde la perspectiva de la conciencia, la espiritualidad y la existencia de planos no físicos. No descartas lo intangible por carecer de evidencia empírica.

Historial de la conversación hasta ahora:
${historialTexto}

Por favor, responde de forma coherente con tu identidad, conocimientos y estilo. Recuerda responder de forma corta y concisa. El experto 1 te hará preguntas interesantes, así que trata de responder de manera que se haga un debate interesante y puedan sacar una conclusion. Se cordial, y solo responde el saludo del experto 1, de lo contrario no se saluden más.
        `;

        // 4. Llamar a Gemini
        const respuesta = await obtenerRespuestaGemini(prompt);

        // 5. Guardar la respuesta en MongoDB
        const nuevoMensaje = new Mensaje({
            autor: 'experto2',
            texto: respuesta,
        });
        await nuevoMensaje.save();

        res.status(201).json(nuevoMensaje);
    } catch (error) {
        console.error('Error al generar respuesta del experto 2:', error);
        res.status(500).json({ error: 'No se pudo generar la respuesta del experto 2.' });
    }
};

export const limpiarHistorial = async (req, res) => {
    try {
        await Mensaje.deleteMany({});
        res.status(200).json({ mensaje: 'Historial eliminado correctamente.' });
    } catch (error) {
        console.error('Error al limpiar el historial:', error);
        res.status(500).json({ error: 'No se pudo limpiar el historial.' });
    }
};

import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

// GET: exportar historial como PDF
export const exportarHistorialPDF = async (req, res) => {
    try {
        const mensajes = await Mensaje.find().sort({ fecha: 1 });

        const doc = new PDFDocument();
        const stream = Readable.from(doc);

        // Configurar cabecera para que el navegador lo descargue
        res.setHeader('Content-disposition', 'attachment; filename="historial.pdf"');
        res.setHeader('Content-type', 'application/pdf');

        // Pipear el PDF a la respuesta
        doc.pipe(res);

        doc.fontSize(16).text('Historial de Conversación entre Expertos', {
            align: 'center',
        });

        doc.moveDown();

        mensajes.forEach((m) => {
            doc.fontSize(12).text(
                `${m.autor === 'experto1' ? 'Experto 1' : 'Experto 2'}:\n${m.texto}\n`,
                { lineGap: 10 }
            );
            doc.moveDown();
        });

        doc.end();
    } catch (error) {
        console.error('Error al exportar PDF:', error);
        res.status(500).json({ error: 'No se pudo generar el PDF.' });
    }
};
