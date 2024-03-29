const classification = "https://conmebol-api.vercel.app/api/classification";
const results = "https://conmebol-api.vercel.app/api/results";
const matches = "https://conmebol-api.vercel.app/api/matches";

const arrowUp =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-badge-up"><path d="M0 0h24v24H0z" stroke="none"/> <path d="M17 11v6l-5-4-5 4v-6l5-4z"/></svg>';

const arrowDowm =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-badge-down"><path d="M0 0h24v24H0z" stroke="none"/><path d="M17 13V7l-5 4-5-4v6l5 4z"/></svg>';

const arrowDif =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrows-diff"><path d="M0 0h24v24H0z" stroke="none"/><path d="M11 16h10M11 16l4 4M11 16l4-4M13 8H3M13 8l-4 4M13 8 9 4"/</svg>';

async function getClassification() {
  try {
    const response = await fetch(classification);
    const data = await response.json();
    fillTable(data.results);
  } catch (error) {
    console.log(error);
  }
}

function fillTable(result) {
  const tableBody = document.querySelector("#clasificicacion-table tbody");
  let tableContent = "";
  result.forEach((result) => {

    if (result.label === "No hay cambios en la posición") {
      result.country = `${result.country} ${arrowDif}`;
    } else if (result.label === "La posición ha bajado") {
      result.country = `${result.country} ${arrowUp}`;
    } else {
      result.country = `${result.country} ${arrowDowm}`;
    }

    if(result.position <=6 ){
        result.country = `<span class="text-success">${result.country}</span>`;
    } else if(result.position >= 8){
        result.country = `<span class="text-danger">${result.country}</span>`;
    } else{
        result.country = `<span class="text-warning">${result.country}</span>`;
    }


    tableContent += `
        <tr>
            <td>${result.position}</td>
            <td>${result.country}</td>
            <td>${result.points}</td>
            <td>${result.matches_played}</td>
            <td>${result.won}</td>
            <td>${result.tied}</td>
            <td>${result.losses}</td>
            <td>${result.goal_difference}</td>
        </tr>
        `;
  });
  tableBody.innerHTML = tableContent;
}

getClassification();
