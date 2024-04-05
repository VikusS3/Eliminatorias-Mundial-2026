function loadHeaderAndFooter() {
  Promise.all([
    fetch("/src/layout/footer.html").then((response) => response.text()),
  ]).then(([footerData]) => {
    document.getElementById("footer").innerHTML = footerData;
  });
}

window.onload = loadHeaderAndFooter;
