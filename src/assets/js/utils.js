function loadHeaderAndFooter() {
    Promise.all([
        fetch('/src/layout/header.html').then(response => response.text()),
        fetch('/src/layout/footer.html').then(response => response.text())
    ]).then(([headerData, footerData]) => {
        document.getElementById('header').innerHTML = headerData;
        document.getElementById('footer').innerHTML = footerData;
    });
}

window.onload = loadHeaderAndFooter;
