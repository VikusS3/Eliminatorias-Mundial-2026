const classification = "https://conmebol-api.vercel.app/api/classification";
const results = "https://conmebol-api.vercel.app/api/results";
const matches = "https://conmebol-api.vercel.app/api/matches";

const btns = {
  clasificacion: document.getElementById('btnClasificacion'),
  resultados: document.getElementById('btnResultados'),
  partidos: document.getElementById('btnPartidos')
};

const arrows = {
  up: getArrowSvg('green', 'arrow-badge-up', 'M17 11v6l-5-4-5 4v-6l5-4z'),
  down: getArrowSvg('red', 'arrow-badge-down', 'M17 13V7l-5 4-5-4v6l5 4z'),
  diff: getArrowSvg('gray', 'arrows-diff', 'M11 16h10M11 16l4 4M11 16l4-4M13 8H3M13 8l-4 4M13 8 9 4')
};

const sections = ['id_clasificacion', 'id_resultados', 'id_proximos_partidos'];

function getArrowSvg(color, badge, path) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-${badge}">
    <path d="M0 0h24v24H0z" stroke="none"/> <path d="${path}"/></svg>`;
}

function toggleSection(activeSection) {
  sections.forEach(section => {
    document.getElementById(section).style.display = section === activeSection ? 'block' : 'none';
  });
}

function toggleButton(activeButton) {
  Object.keys(btns).forEach(btn => {
    btns[btn].classList.toggle('button-active', btn === activeButton);
  });
}

Object.keys(btns).forEach(btn => {
  btns[btn].addEventListener('click', () => {
    toggleSection(`id_${btn}`);
    toggleButton(btn);
    if (btn === 'clasificacion') getClassification();
    if (btn === 'resultados') getResults();
    if (btn === 'partidos') getPartidos();
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

  const tableContent = results.map(({ label, country, position, points, matches_played, won, tied, losses, goal_difference }) => {
    country = `${country} ${arrows[label === "No hay cambios en la posición" ? 'diff' : label === "La posición ha bajado" ? 'up' : 'down']}`;
    const colorClass = position <= 6 ? 'text-success' : position >= 8 ? 'text-danger' : 'text-warning';
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
  }).join('');

  tableBody.innerHTML = tableContent;
}

async function getResults() {
  try {
    const response = await fetch(results);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

async function getPartidos(){
  try{
    const response = await fetch(matches);
    const data = await response.json();
    console.log(data);
  }catch(error){
    console.log(error);
  }
}

getClassification();
