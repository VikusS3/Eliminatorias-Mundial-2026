const countries = [
  "argentina",
  "brasil",
  "chile",
  "colombia",
  "ecuador",
  "paraguay",
  "peru",
  "uruguay",
  "venezuela",
];

async function getGoleadores() {
  try {
    const response = await fetch("../assets/js/goleadores/goleadores.json");
    const data = await response.json();
    console.log(data.goleadores);
    createDivs(data.goleadores);
  } catch (error) {
    console.log(error);
  }
}

function createDivs(goleadores) {
  const contenedor = document.getElementById("goleadores_goleadores");
  contenedor.innerHTML = goleadores
    .map((goleador, index) => {
      let className = `goleador${index + 1}`;
      if (countries.includes(goleador.pais)) {
        className += ` ${goleador.pais}`;
      }
      return `
                <div class="${className}">
                        <h2 class="goleador">${goleador.jugador}</h2>
                        <p class="goles">${goleador.goles}</p>
                </div>
        `;
    })
    .join("");
}

getGoleadores();
