document.addEventListener("DOMContentLoaded", () => {
    //obtener el formulario 
    const form = document.getElementById("formAgregar");

    form.addEventListener("submit", async (e)=>{
        e.preventDefault();
    //tomar los valores de los campos del formulario
    const data = {
        id: document.querySelector('input[name="id"]').value,
        nombre: document.querySelector('input[name="nombre"]').value,
        descripcion: document.querySelector('textarea[name="descripcion"]').value,
        precio: document.querySelector('input[name="precio"]').value,
        stock: document.querySelector('input[name="stock"]').value,
        imagen: document.querySelector('input[name="imagen"]').value,
        categoria: document.querySelector('input[name="categoria"]').value,
    };
    try{
        const response = await fetch("http://localhost:3000/api/agregarProducto",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if(response.ok){
        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Producto agregado correctamente",
            confrimButtonText: "Aceptar"
        });
            form.reset();
        }else{
            Swal.fire({
                icon: "error",
                title: "Error",
                text: result.message || "Error al agregar el producto",
                confirmButtonText:"Aceptar"
            });
        }
    }catch(err){
        console.error("Error al agregar el producto:", err);
        alert("Error al agregar el producto");
            }
        });
    });
    document.getElementById("back").addEventListener("click", () => {
    window.history.back();
});
