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

// const sections = ["id_clasificacion", "id_resultados", "id_proximos_partidos"];

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

const buttons = [ "btnClasificacion","btnResultados","btnPartidos"];
const sections = ["id_clasificacion", "id_resultados", "id_proximos_partidos"];
const functions = [getClassification,getResults,getPartidos];

buttons.forEach((button, index) => {
  document.getElementById(button).addEventListener("click", () => {
    sections.forEach((section, i) => {
      document.getElementById(section).style.display = i === index ? "block" : "none";
    });

    buttons.forEach((btn, i) => {
      const element = document.getElementById(btn);
      if (i === index) {
        element.classList.add("button-active");
      } else {
        element.classList.remove("button-active");
      }
    });

    functions[index]();
  });
});

async function getClassification() {
  try {
    const response = await fetch(classification);
    const data = await response.json();
    fillTable(data.results);
    setTimeout(() => {
      const buttons = [
        "btnLastJornada",
        "btnPenulJornada",
        "btnAnteJornada",
        "btnFirstJornada",
      ];
      buttons.forEach((btn, index) => {
        const button = document.getElementById(btn);
        index === 0
          ? button.classList.add("active")
          : button.classList.remove("active");
      });
    }, 525);
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

    // Create flag for first team
    const flag1 = document.createElement("img");
    flag1.src = `assets/img/${partido.first_team.country}.png`;
    flag1.alt = partido.first_team.country + " flag";
    flag1.classList.add("flag");

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

    // Create flag for second team
    const flag2 = document.createElement("img");
    flag2.src = `assets/img/${partido.second_team.country}.png`;
    flag2.alt = partido.second_team.country + " flag";
    flag2.classList.add("flag");

    const fechaDiv = document.createElement("div");
    fechaDiv.classList.add("fecha");

    const fechaP = document.createElement("p");
    fechaP.innerHTML = `Fecha:<span> ${new Date(
      partido.date
    ).toLocaleDateString()}</span>`;

    // Agregar elementos al DOM
    golesDiv.append(golesTeam1, separator, golesTeam2);
    encuentroDiv.append(flag1, team1, golesDiv, team2, flag2);
    fechaDiv.appendChild(fechaP);
    partidoDiv.append(encuentroDiv, fechaDiv);

    jornadaPartido.appendChild(partidoDiv);
  });
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

    setTimeout(() => {
      const buttons = [
        "btnLastJornada",
        "btnPenulJornada",
        "btnAnteJornada",
        "btnFirstJornada",
      ];
      buttons.forEach((btn, index) => {
        const button = document.getElementById(btn);
        index === 0
          ? button.classList.add("active")
          : button.classList.remove("active");
      });
    }, 524);
  } catch (error) {
    console.log(error);
  }
}

function displayMatchesProx(jornada) {
  const proximos_encuentros = document.getElementById("proximos_encuentros");

  // Clear existing content
  proximos_encuentros.innerHTML = "";

  // Iterate over each match of the jornada
  jornada.forEach((partido) => {
    const encuentro = document.createElement("div");
    encuentro.className = "proximo_encuentro";

    const encuentroInfo = document.createElement("div");
    encuentroInfo.className = "proximo_encuentro_info";

    const team1Info = document.createElement("div");
    team1Info.className = "team_info";

    const team1Img = document.createElement("div");
    team1Img.className = "team_info_img";

    const team1Flag = document.createElement("img");
    team1Flag.src = `assets/img/${partido.first_team}.png`;
    team1Flag.alt = `Bandera de ${partido.first_team}`;

    const teamContentName = document.createElement("div");
    teamContentName.className = "team_content_name";

    const team1Name = document.createElement("h3");
    team1Name.id = "equipo_1";
    team1Name.textContent = partido.first_team;

    team1Img.appendChild(team1Flag);
    team1Info.appendChild(team1Img);
    teamContentName.appendChild(team1Name);
    team1Info.appendChild(teamContentName);

    const team2Info = document.createElement("div");
    team2Info.className = "team_info";

    const team2Img = document.createElement("div");
    team2Img.className = "team_info_img";

    const team2Flag = document.createElement("img");
    team2Flag.src = `assets/img/${partido.second_team}.png`;
    team2Flag.alt = `Bandera de ${partido.second_team}`;

    const teamContentName2 = document.createElement("div");
    teamContentName2.className = "team_content_name";

    const team2Name = document.createElement("h3");
    team2Name.id = "equipo_2";
    team2Name.textContent = partido.second_team;

    team2Img.appendChild(team2Flag);
    team2Info.appendChild(team2Img);
    teamContentName2.appendChild(team2Name);
    team2Info.appendChild(teamContentName2);

    encuentroInfo.appendChild(team1Info);
    encuentroInfo.appendChild(team2Info);

    const encuentroFecha = document.createElement("div");
    encuentroFecha.className = "proximo_encuentro_fecha";

    const fechaEncuentro = document.createElement("p");
    fechaEncuentro.id = "fecha_encuentro_proximo";
    fechaEncuentro.textContent = `Fecha: ${new Date(
      partido.date
    ).toLocaleDateString()}`;

    encuentroFecha.appendChild(fechaEncuentro);

    encuentro.appendChild(encuentroInfo);
    encuentro.appendChild(encuentroFecha);

    proximos_encuentros.appendChild(encuentro);
  });
}

getClassification();
getResults();
getPartidos();