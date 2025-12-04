document.addEventListener("DOMContentLoaded", () => {
    loadCategoryPie();
    loadTotalSalesDoughnut();
    loadStockBarChart();
});

// ========================================================
// 1. Gráfica de Pastel — ventas por categoría
// ========================================================
async function loadCategoryPie() {
    try {
        const res = await fetch("http://localhost:3000/api/graficas/products-by-category");
        const data = await res.json();

        new Chart(document.getElementById("pieCategory"), {
            type: "pie",
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    borderWidth: 1
                }]
            },
            options: { responsive: true }
        });

    } catch (e) {
        console.error("Error pie:", e);
    }
}

// ========================================================
// 2. Gráfica Doughnut — total de ventas
// ========================================================
async function loadTotalSalesDoughnut() {
    try {
        const res = await fetch("http://localhost:3000/api/graficas/total-sales");
        const { total } = await res.json();

        new Chart(document.getElementById("doughnutTotal"), {
            type: "doughnut",
            data: {
                labels: ["Total de ventas"],
                datasets: [{
                    data: [total],
                    borderWidth: 1
                }]
            },
            options: { responsive: true }
        });

    } catch (e) {
        console.error("Error doughnut:", e);
    }
}

// ========================================================
// 3. Gráfica de Barras — stock por producto
// ========================================================
async function loadStockBarChart() {
    try {
        const res = await fetch("http://localhost:3000/api/graficas/stock-by-product");
        const data = await res.json();

        new Chart(document.getElementById("barStock"), {
            type: "bar",
            data: {
                labels: data.labels,
                datasets: [{
                    label: "Existencias",
                    data: data.values,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                indexAxis: 'y',   // HORIZONTAL
                scales: {
                    x: { beginAtZero: true }
                }
            }
        });

    } catch (e) {
        console.error("Error bar:", e);
    }
}
