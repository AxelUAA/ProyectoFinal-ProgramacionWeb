document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const inputs = document.querySelectorAll(".codigo-inputs input");

  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      if (input.value.length === 1 && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const codigo = Array.from(inputs).map(input => input.value).join("");

    if (codigo.length !== inputs.length) {
      Swal.fire({
        icon: "warning",
        title: "Código incompleto",
        text: "Por favor ingresa todos los dígitos."
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/verificarCodigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo })
      });

      const data = await response.json();

      if (data.valid) {
        localStorage.setItem("codigoVerificado", codigo);

        Swal.fire({
          icon: "success",
          title: "Código verificado",
          text: "¡Bienvenido a SNEAKERCLON5G!"
        }).then(() => {
          window.location.href = "password.html";
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Código inválido",
          text: "El código ingresado no coincide."
        });
      }
    } catch (error) {
      console.error("Error al verificar:", error);
      Swal.fire({
        icon: "error",
        title: "Error del servidor",
        text: "Intenta nuevamente más tarde."
      });
    }
  });
});
