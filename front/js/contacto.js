//enviar comentario al backend
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1. Tomar valores del formulario
    const correo = document.getElementById("correo").value;
    const comentario = document.getElementById("comentario").value;

    // 2. Construir objeto de datos
    const data = {
      correo: correo,
      respuesta: comentario
    };

    try {
      // 3. Enviar al backend
      const response = await fetch("http://localhost:3000/api/responderComentario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      // 4. Manejo de respuesta
      if (response.ok) {
        Swal.fire({
          title: '¡Comentario enviado!',
          text: result.message,
          icon: 'success'
        });
        form.reset();
      } else {
        Swal.fire({
          title: 'Error',
          text: result.message || "Error desconocido",
          icon: 'error'
        });
      }

    } catch (err) {
      console.error("Error al enviar comentario:", err);
      Swal.fire({
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor. Verifica que esté encendido.',
        icon: 'error'
      });
    }
  });
});
