const bodyChat = document.querySelector('.body');
const [btnIA1, btnEliminar, btnIA2] = document.querySelectorAll('button');

// Crea y muestra un mensaje visualmente
const crearMensaje = (autor, texto) => {
    const p = document.createElement('p');
    p.className = autor === 'experto1' ? 'msgiauno' : 'mgsiados';
    p.textContent = texto;
    bodyChat.appendChild(p);
};

// Cargar historial al entrar
const cargarHistorial = async () => {
    try {
        const res = await fetch('/api/historial');
        const historial = await res.json();
        bodyChat.innerHTML = '';
        historial.forEach(m => crearMensaje(m.autor, m.texto));
    } catch (err) {
        console.error('Error cargando historial:', err);
    }
};

// IA 1 responde
btnIA1.addEventListener('click', async () => {
    try {
        const res = await fetch('/api/generar-respuesta-experto1', { method: 'POST' });
        const msg = await res.json();
        crearMensaje(msg.autor, msg.texto);
    } catch (err) {
        console.error('Error al generar respuesta IA 1:', err);
    }
});

// IA 2 responde
btnIA2.addEventListener('click', async () => {
    try {
        const res = await fetch('/api/generar-respuesta-experto2', { method: 'POST' });
        const msg = await res.json();
        crearMensaje(msg.autor, msg.texto);
    } catch (err) {
        console.error('Error al generar respuesta IA 2:', err);
    }
});

// Eliminar historial
btnEliminar.addEventListener('click', async () => {
    try {
        await fetch('/api/historial', { method: 'DELETE' });
        bodyChat.innerHTML = '';
    } catch (err) {
        console.error('Error al eliminar historial:', err);
    }
});

window.addEventListener('DOMContentLoaded', cargarHistorial);

const btnExportar = document.getElementById('btnExportar');

btnExportar.addEventListener('click', () => {
    window.open('/api/exportar-pdf', '_blank');
});


