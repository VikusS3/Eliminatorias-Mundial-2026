const classification = "https://conmebol-api.vercel.app/api/classification";
const results = "https://conmebol-api.vercel.app/api/results";
const matches = "https://conmebol-api.vercel.app/api/matches";

document.addEventListener('DOMContentLoaded', (event) => {
  getResults();
  getClassification();
  getPartidos();
});


const arrows = {
  up: getArrowSvg("green", "arrow-badge-up", "M17 11v6l-5-4-5 4v-6l5-4z"),
  down: getArrowSvg("red", "arrow-badge-down", "M17 13V7l-5 4-5-4v6l5 4z"),
  diff: getArrowSvg(
    "gray",
    "arrows-diff",
    "M11 16h10M11 16l4 4M11 16l4-4M13 8H3M13 8l-4 4M13 8 9 4"
  ),
};

const btns = [
  "btnLastJornada",
  "btnPenulJornada",
  "btnAnteJornada",
  "btnFirstJornada",
];

const jornada_numbers = [
  "jornada_number_1",
  "jornada_number_2",
  "jornada_number_3",
  "jornada_number_4",
];

const jornada_numbers_proximos = [
  "jornada_number_1_prox",
  "jornada_number_2_prox",
  "jornada_number_3_prox",
];

const btnsProxJornada = [
  "btnProximaJornada",
  "btnPosteriorJornada",
  "btnUltimaJornada",
];

function getArrowSvg(color, badge, path) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-${badge}">
    <path d="M0 0h24v24H0z" stroke="none"/> <path d="${path}"/></svg>`;
}

const buttons = ["btnClasificacion", "btnResultados", "btnPartidos"];
const sections = ["id_clasificacion", "id_resultados", "id_proximos_partidos"];
const functions = [getClassification, getResults, getPartidos];

buttons.forEach((button, index) => {
  document.getElementById(button).addEventListener("click", () => {
    sections.forEach((section, i) => {
      document.getElementById(section).style.display =
        i === index ? "block" : "none";
    });

    buttons.forEach((btn, i) => {
      const element = document.getElementById(btn);
      if (i === index) {
        element.classList.add("button-active");
      } else {
        element.classList.remove("button-active");
      }
    });

    [btns, btnsProxJornada].forEach(btnGroup => {
      btnGroup.forEach((btn, i) => {
        const element = document.getElementById(btn);
        element.classList[i === 0 ? 'add' : 'remove']("active");
      });
    });

    functions[index]();
  });
});

async function getClassification() {
  try {
    const response = await fetch(classification);
    const data = await response.json();
    fillTable(data.results);
  } catch (error) {
    console.log(error);
  }
}

function fillTable(results) {
  const tableBody = document.querySelector("#clasificicacion-table tbody");

  const tableContent = results
    .map(
      ({
        label,
        country,
        position,
        points,
        matches_played,
        won,
        tied,
        losses,
        goal_difference,
      }) => {
        country = `${country} ${
          arrows[
            label === "No hay cambios en la posición"
              ? "diff"
              : label === "La posición ha bajado"
              ? "up"
              : "down"
          ]
        }`;
        const colorClass =
          position <= 6
            ? "text-success"
            : position >= 8
            ? "text-danger"
            : "text-warning";
        country = `<span class="${colorClass}">${country}</span>`;

        return `
      <tr>
        <td>${position}</td>
        <td>${country}</td>
        <td>${points}</td>
        <td>${matches_played}</td>
        <td>${won}</td>
        <td>${tied}</td>
        <td>${losses}</td>
        <td>${goal_difference}</td>
      </tr>
    `;
      }
    )
    .join("");

  tableBody.innerHTML = tableContent;
}

async function getResults() {
  try {
    const response = await fetch(results);
    const data = await response.json();

    const jornadas = Object.keys(data);

    jornada_numbers.forEach((id, index) => {
      const element = document.getElementById(id);
      element.textContent = jornadas[index];
    });

    btns.forEach((id, index) => {
      const btn = document.getElementById(id);
      btn.addEventListener("click", () => {
        btns.forEach((otherId) => {
          const otherBtn = document.getElementById(otherId);
          otherBtn.classList.remove("active");
        });
        btn.classList.add("active");
        const jornada = data[jornadas[index]];
        displayMatches(jornada);
      });
    });

    displayMatches(data[jornadas[0]]);
  } catch (error) {
    console.log(error);
  }
}

function displayMatches(jornada) {
  let html = '';

  jornada.forEach((partido) => {
    html += `
      <div class="partido">
        <div class="encuentro">
          <img class="flag" loading="lazy" src="assets/public/${partido.first_team.country.toLowerCase()}.png" alt="${partido.first_team.country} flag">
          <p id="team-1">${partido.first_team.country}</p>
          <div class="goles">
            <p>${partido.first_team.goals}</p>
            <span>:</span>
            <p>${partido.second_team.goals}</p>
          </div>
          <p id="team-2">${partido.second_team.country}</p>
          <img class="flag" loading="lazy" src="./assets/public/${partido.second_team.country.toLowerCase()}.png" alt="${partido.second_team.country} flag">
        </div>
        <div class="fecha">
          <p>Fecha:<span> ${new Date(partido.date).toLocaleDateString()}</span></p>
        </div>
      </div>
    `;
  });

  document.getElementById("jornada_partido").innerHTML = html;
}

async function getPartidos() {
  try {
    const response = await fetch(matches);
    const data = await response.json();

    const prox_jornadas = Object.keys(data);

    jornada_numbers_proximos.forEach((id, index) => {
      const element = document.getElementById(id);
      element.textContent = prox_jornadas[index];
    });

    btnsProxJornada.forEach((id, index) => {
      const btn = document.getElementById(id);
      btn.addEventListener("click", () => {
        btnsProxJornada.forEach((otherId) => {
          const otherBtn = document.getElementById(otherId);
          otherBtn.classList.remove("active");
        });
        btn.classList.add("active");
        const jornada = data[prox_jornadas[index]];
        displayMatchesProx(jornada);
      });
    });

    displayMatchesProx(data[prox_jornadas[0]]);
  } catch (error) {
    console.log(error);
  }
}

function displayMatchesProx(jornada) {
  let html = '';

  // Iterate over each match of the jornada
  jornada.forEach((partido) => {
    html += `
      <div class="proximo_encuentro">
        <div class="proximo_encuentro_info">
          <div class="team_info">
            <div class="team_info_img">
              <img loading="lazy" src="assets/public/${partido.first_team.toLowerCase()}.png" alt="Bandera de ${partido.first_team}">
            </div>
            <div class="team_content_name">
              <h3 id="equipo_1">${partido.first_team}</h3>
            </div>
          </div>
          <div class="team_info">
            <div class="team_info_img">
              <img loading="lazy" src="assets/public/${partido.second_team.toLowerCase()}.png" alt="Bandera de ${partido.second_team}">
            </div>
            <div class="team_content_name">
              <h3 id="equipo_2">${partido.second_team}</h3>
            </div>
          </div>
        </div>
        <div class="proximo_encuentro_fecha">
          <p id="fecha_encuentro_proximo">Fecha: ${new Date(partido.date).toLocaleDateString()}</p>
        </div>
      </div>
    `;
  });

  document.getElementById("proximos_encuentros").innerHTML = html;
}

