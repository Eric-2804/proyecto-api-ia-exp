console.log('chat.js cargado correctamente');

document.addEventListener('DOMContentLoaded', () => {
    const btnIA1 = document.getElementById('btnIA1');
    const btnIA2 = document.getElementById('btnIA2');
    const btnEliminar = document.getElementById('btnEliminar');
    const btnExportar = document.getElementById('btnExportar');
    const chatBody = document.getElementById('chatBody');

    // Función para crear mensajes
    async function agregarMensajeIA(claseMensaje, url, avatarUrl, alineacion = 'izquierda') {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'flex-start';
        wrapper.style.marginBottom = '10px';
        wrapper.style.flexDirection = alineacion === 'derecha' ? 'row-reverse' : 'row';

        const avatar = document.createElement('img');
        avatar.src = avatarUrl;
        avatar.className = 'avatar';

        const mensaje = document.createElement('div');
        mensaje.className = claseMensaje;
        mensaje.textContent = 'Escribiendo...';

        wrapper.appendChild(avatar);
        wrapper.appendChild(mensaje);
        chatBody.appendChild(wrapper);
        chatBody.scrollTop = chatBody.scrollHeight;

        try {
            const res = await fetch(url, { method: 'POST' });
            const data = await res.json();
            mensaje.textContent = data.texto || 'Respuesta vacía';
        } catch (error) {
            mensaje.textContent = 'Error al obtener respuesta';
        }
    }

    btnIA1.addEventListener('click', () => {
        agregarMensajeIA('msgiauno', '/api/generar-respuesta-experto1', './imagenes/IA1.png', 'izquierda');
    });

    btnIA2.addEventListener('click', () => {
        agregarMensajeIA('mgsiados', '/api/generar-respuesta-experto2', './imagenes/IA2.png', 'derecha');
    });

    btnEliminar.addEventListener('click', async () => {
        await fetch('/api/historial', { method: 'DELETE' });
        chatBody.innerHTML = '';
    });

    btnExportar.addEventListener('click', () => {
        window.open('/api/exportar-pdf', '_blank');
    });

});
