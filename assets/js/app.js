const classification = "https://conmebol-api.vercel.app/api/classification";

const arrowUp = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-badge-up">
<path d="M0 0h24v24H0z" stroke="none"/> <path d="M17 11v6l-5-4-5 4v-6l5-4z"/></svg>`;

const arrowDown = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-badge-down">
<path d="M0 0h24v24H0z" stroke="none"/><path d="M17 13V7l-5 4-5-4v6l5 4z"/></svg>`;

const arrowDif = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrows-diff">
<path d="M0 0h24v24H0z" stroke="none"/><path d="M11 16h10M11 16l4 4M11 16l4-4M13 8H3M13 8l-4 4M13 8 9 4"/></svg>`;

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
    switch (label) {
      case "No hay cambios en la posición":
        country = `${country} ${arrowDif}`;
        break;
      case "La posición ha bajado":
        country = `${country} ${arrowUp}`;
        break;
      default:
        country = `${country} ${arrowDown}`;
    }

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

getClassification();
