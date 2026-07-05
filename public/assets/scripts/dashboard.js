// ===== DATOS DEL GRAFICO (mock, luego vendrán de tu backend/API) =====

const evolucionData = {

    6: {
        labels: ["Dic", "Ene", "Feb", "Mar", "Abr", "May"],
        valores: [3.0, 2.7, 2.5, 2.1, 1.95, 2.2]
    },

    3: {
        labels: ["Mar", "Abr", "May"],
        valores: [2.1, 1.95, 2.2]
    },

    12: {
        labels: ["Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May"],
        valores: [3.4, 3.3, 3.5, 3.2, 3.1, 3.0, 3.0, 2.7, 2.5, 2.1, 1.95, 2.2]
    }

};

let evolucionChart = null;

function renderEvolucionChart(rango = 6) {

    const canvas = document.getElementById("evolucionChart");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const data = evolucionData[rango];

    if (evolucionChart) {
        evolucionChart.destroy();
    }

    evolucionChart = new Chart(ctx, {

        type: "line",

        data: {

            labels: data.labels,

            datasets: [{

                label: "kg CO₂e",
                data: data.valores,
                borderColor: "#16a34a",
                backgroundColor: "rgba(22, 163, 74, 0.1)",
                fill: true,
                tension: 0.35,
                pointRadius: 4,
                pointBackgroundColor: "#16a34a",
                pointBorderColor: "#ffffff",
                pointBorderWidth: 2,
                borderWidth: 2

            }]

        },

        options: {

            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.parsed.y} kg CO₂e`
                    }
                }
            },

            scales: {

                y: {
                    beginAtZero: true,
                    grid: {
                        color: "#e5e7eb"
                    },
                    ticks: {
                        font: {
                            family: "Montserrat"
                        },
                        callback: (value) => value.toFixed(1)
                    }
                },

                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: "Montserrat"
                        }
                    }
                }

            }

        }

    });

}

function initEvolucionSelect() {

    const select = document.getElementById("evolucionRango");

    if (!select) return;

    select.addEventListener("change", (e) => {
        renderEvolucionChart(Number(e.target.value));
    });

}

document.addEventListener("DOMContentLoaded", () => {

    renderEvolucionChart(6);
    initEvolucionSelect();

});