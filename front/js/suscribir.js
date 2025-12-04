const btnSuscripcion = document.getElementById("btnSuscripcion");

if (btnSuscripcion) {
  btnSuscripcion.addEventListener("click", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return Swal.fire({
        icon: "error",
        title: "Inicia sesión primero",
        text: "Necesitas estar logueado para suscribirte.",
        confirmButtonText: "Aceptar"
      });
    }

    try {
      const resp = await fetch("http://localhost:3000/api/sales/suscribir", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await resp.json();

      if (data.ok && data.message === "Ya estas suscrito") {
        Swal.fire({
          icon: "error", // 👈 ahora será error
          title: "Ya estás suscrito",
          text: "No puedes volver a suscribirte porque ya lo estás.",
          confirmButtonText: "Aceptar"
        });
      } else if (data.ok) {
        Swal.fire({
          icon: "success",
          title: "Gracias por suscribirte a SNEAKERCLON5G",
          text: data.message,
          confirmButtonText: "Aceptar"
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Aviso",
          text: data.message || "No se pudo suscribir",
          confirmButtonText: "Aceptar"
        });
      }

    } catch (err) {
      console.error("Error en suscripción:", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo completar la suscripción",
        confirmButtonText: "Aceptar"
      });
    }
  });
}
