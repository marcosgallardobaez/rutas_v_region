(function () {
    const lat = -33.0363303;
    const lng = -71.5459269;
    const mapa = L.map('mapa').setView([lat, lng], 13);
    let marker = new L.marker([lat, lng], {
        draggable: true,
        autopan: true
    }).addTo(mapa);

 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    setTimeout(() => {
        mapa.invalidateSize();
        document.getElementById('mapa').style.opacity = 1;
    }, 800);

    

})();

