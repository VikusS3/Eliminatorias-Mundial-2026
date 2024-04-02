const classification = "https://conmebol-api.vercel.app/api/classification";
const results = "https://conmebol-api.vercel.app/api/results";
const matches = "https://conmebol-api.vercel.app/api/matches";

const arrows = {
  up: getArrowSvg("green", "arrow-badge-up", "M17 11v6l-5-4-5 4v-6l5-4z"),
  down: getArrowSvg("red", "arrow-badge-down", "M17 13V7l-5 4-5-4v6l5 4z"),
  diff: getArrowSvg(
    "gray",
    "arrows-diff",
    "M11 16h10M11 16l4 4M11 16l4-4M13 8H3M13 8l-4 4M13 8 9 4"
  ),
};

const sections = ["id_clasificacion", "id_resultados", "id_proximos_partidos"];

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

function getArrowSvg(color, badge, path) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-${badge}">
    <path d="M0 0h24v24H0z" stroke="none"/> <path d="${path}"/></svg>`;
}

const btnPartidos = document
  .getElementById("btnPartidos")
  .addEventListener("click", () => {
    const partidos = (document.getElementById(
      "id_proximos_partidos"
    ).style.display = "block");
    const clasificacion = (document.getElementById(
      "id_clasificacion"
    ).style.display = "none");
    const resultados = (document.getElementById("id_resultados").style.display =
      "none");

    const btnPartidos = document.getElementById("btnPartidos");
    btnPartidos.classList.add("button-active");
    const btnResultados = document
      .getElementById("btnResultados")
      .classList.remove("button-active");
    const btnClasificacion = document
      .getElementById("btnClasificacion")
      .classList.remove("button-active");

    getPartidos();
  });

const btnResultados = document
  .getElementById("btnResultados")
  .addEventListener("click", () => {
    const partidos = (document.getElementById(
      "id_proximos_partidos"
    ).style.display = "none");
    const clasificacion = (document.getElementById(
      "id_clasificacion"
    ).style.display = "none");
    const resultados = (document.getElementById("id_resultados").style.display =
      "block");

    const btnResultados = document.getElementById("btnResultados");
    btnResultados.classList.add("button-active");
    const btnPartidos = document
      .getElementById("btnPartidos")
      .classList.remove("button-active");
    const btnClasificacion = document
      .getElementById("btnClasificacion")
      .classList.remove("button-active");

    getResults();
  });

const btnClasificacion = document
  .getElementById("btnClasificacion")
  .addEventListener("click", () => {
    const partidos = (document.getElementById(
      "id_proximos_partidos"
    ).style.display = "none");
    const clasificacion = (document.getElementById(
      "id_clasificacion"
    ).style.display = "block");
    const resultados = (document.getElementById("id_resultados").style.display =
      "none");

    const btnClasificacion = document.getElementById("btnClasificacion");
    btnClasificacion.classList.add("button-active");
    const btnPartidos = document
      .getElementById("btnPartidos")
      .classList.remove("button-active");
    const btnResultados = document
      .getElementById("btnResultados")
      .classList.remove("button-active");

    getClassification();
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
  const jornadaPartido = document.getElementById("jornada_partido");

  // Clear existing content
  jornadaPartido.innerHTML = "";

  // Iterar sobre cada partido de la jornada
  jornada.forEach((partido) => {
    // Crear elementos HTML con los datos del partido
    const partidoDiv = document.createElement("div");
    partidoDiv.classList.add("partido");

    const encuentroDiv = document.createElement("div");
    encuentroDiv.classList.add("encuentro");

    const team1 = document.createElement("p");
    team1.id = "team-1";
    team1.textContent = partido.first_team.country;

    const golesDiv = document.createElement("div");
    golesDiv.classList.add("goles");

    const golesTeam1 = document.createElement("p");
    golesTeam1.textContent = partido.first_team.goals;

    const separator = document.createElement("span");
    separator.textContent = ":";

    const golesTeam2 = document.createElement("p");
    golesTeam2.textContent = partido.second_team.goals;

    const team2 = document.createElement("p");
    team2.id = "team-2";
    team2.textContent = partido.second_team.country;

    const fechaDiv = document.createElement("div");
    fechaDiv.classList.add("fecha");

    const fechaP = document.createElement("p");
    fechaP.innerHTML = `Fecha:<span> ${new Date(
      partido.date
    ).toLocaleDateString()}</span>`;

    // Agregar elementos al DOM
    golesDiv.append(golesTeam1, separator, golesTeam2);
    encuentroDiv.append(team1, golesDiv, team2);
    fechaDiv.appendChild(fechaP);
    partidoDiv.append(encuentroDiv, fechaDiv);

    jornadaPartido.appendChild(partidoDiv);
  });
}

async function getPartidos() {
  try {
    const response = await fetch(matches);
    const data = await response.json();
    console.log(data);
    setTimeout(() => {
      const buttons = ["btnLastJornada", "btnPenulJornada", "btnAnteJornada", "btnFirstJornada"];
      buttons.forEach((btn, index) => {
        const button = document.getElementById(btn);
        index === 0 ? button.classList.add("active") : button.classList.remove("active");
      });
    }, 525);

  } catch (error) {
    console.log(error);
  }
}

getClassification();
getResults();
