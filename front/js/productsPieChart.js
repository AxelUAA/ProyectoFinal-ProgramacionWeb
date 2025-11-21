document.addEventListener("DOMContentLoaded", async () => {

    const ctx = document.getElementById("productsPieChart");

    try {
        const res = await fetch("http://localhost:3000/api/graficas/products-by-category");
        const data = await res.json();

        new Chart(ctx, {
            type: "pie",
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true
            }
        });

    } catch (error) {
        console.error("Error cargando gráfica:", error);
    }
});
