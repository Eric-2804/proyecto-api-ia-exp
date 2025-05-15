import axios from 'axios';

export const obtenerRespuestaGemini = async (promptFinal) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-002:generateContent?key=${apiKey}`,
            {
                contents: [{ parts: [{ text: promptFinal }] }],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        // Obtener el texto de la respuesta de Gemini
        const textoGenerado = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

        // Condicional para manejar la respuesta
        if (textoGenerado) {
            return textoGenerado;
        } else {
            return 'Error: respuesta vacía de Gemini';
        }

    } catch (error) {
        console.error('Error al consultar Gemini:', error?.response?.data || error.message);
        return 'Error al generar la respuesta con Gemini.';
    }
};