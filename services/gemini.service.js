// services/gemini.service.js
import axios from 'axios';

export const obtenerRespuestaGemini = async (promptFinal) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-002:generateContent`
,
            {
                contents: [{ parts: [{ text: promptFinal }] }],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const textoGenerado = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

        return textoGenerado || 'Error: respuesta vacía de Gemini';
    } catch (error) {
        console.error('Error al consultar Gemini:', error?.response?.data || error.message);
        return 'Error al generar la respuesta con Gemini.';
    }
};
