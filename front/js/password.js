  // js/auth.js

  document.addEventListener("DOMContentLoaded", () => {
    const formCambiarPass = document.getElementById("formCambiarPass");

    formCambiarPass.addEventListener("submit", async (e) => {
      e.preventDefault();

      const passwordNueva = document.getElementById("passwordNueva").value.trim();
      const passwordNueva2 = document.getElementById("passwordNueva2").value.trim();

      // Aquí deberías obtener el código del usuario (ej. desde sesión, localStorage o querystring)
      // Para pruebas, lo pongo fijo:
      const codigo = localStorage.getItem("codigoVerificado") || "123"; 

      try {
        const response = await fetch("http://localhost:3000/api/actualizarPassword", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            codigo,
            newPassword: passwordNueva,
            newPassword2: passwordNueva2
          })
        });

        const data = await response.json();

        if (!response.ok) {
          // Error (contraseñas no coinciden o servidor)
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message || "No se pudo actualizar la contraseña"
          });
        } else {
          // Éxito
          Swal.fire({
            icon: "success",
            title: "¡Contraseña actualizada!",
            text: data.message,
            confirmButtonText: "Aceptar"
          }).then(() => {
            // Opcional: redirigir al login
            window.location.href = "login.html";
          });
        }
      } catch (error) {
        console.error("Error en la petición:", error);
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "No se pudo conectar con el servidor"
        });
      }
    });
  });
