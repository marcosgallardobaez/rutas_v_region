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

    // servicio de geocodificación
    const geocodeService = L.esri.Geocoding.geocodeService();

    function moverPin(lat, lng) {
        const nuevaPosicion = new L.LatLng(lat, lng);
        marker.setLatLng(nuevaPosicion);   // mover el pin
        mapa.panTo(nuevaPosicion);         // centrar el mapa

        // actualizar inputs
        document.querySelector('#lat').value = lat;
        document.querySelector('#lng').value = lng;
    }

    // detectar movimiento del pin
    marker.on('moveend', function (e) {
        marker = e.target;
        const posicion = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));

        geocodeService.reverse().latlng(posicion, 13).run(function (error, resultado) {
            if (error) return;

            marker.bindPopup(resultado.address.LongLabel);

            document.querySelector('#direccion').value = resultado.address.Address ?? '';
            document.querySelector('#comuna').value    = resultado.address.City ?? '';
            document.querySelector('#provincia').value = resultado.address.Subregion ?? '';
            document.querySelector('#region').value    = resultado.address.Region ?? '';
            document.querySelector('#pais').value      = resultado.address.CountryCode ?? '';
            document.querySelector('#lat').value       = posicion.lat ?? '';
            document.querySelector('#lng').value       = posicion.lng ?? '';
        });
    });

    // mover el pin al rellenar dirección
   // mover el pin al rellenar el input de direccion
const inputDireccion = document.querySelector('#direccion');
inputDireccion.addEventListener('change', function () {
    if (this.value.trim() !== '') {
        L.esri.Geocoding.geocode()
            .region("CL")  // 🔹 limita búsqueda a Chile
            .text(this.value)
            .run(function (err, results) {
                if (results && results.results.length > 0) {
                    const coords = results.results[0].latlng;
                    console.log("Geocode resultado:", coords.lat, coords.lng); // debug
                    moverPin(coords.lat, coords.lng);
                }
            });
    }
});

// mover el pin si cambian lat/lng manualmente
document.querySelector('#lat').addEventListener('change', function () {
    const lat = parseFloat(this.value.replace(',', '.'));  // 🔹 corrige coma
    const lng = parseFloat(document.querySelector('#lng').value.replace(',', '.'));
    if (!isNaN(lat) && !isNaN(lng)) {
        moverPin(lat, lng);
    }
});

document.querySelector('#lng').addEventListener('change', function () {
    const lat = parseFloat(document.querySelector('#lat').value.replace(',', '.'));
    const lng = parseFloat(this.value.replace(',', '.'));  // 🔹 corrige coma
    if (!isNaN(lat) && !isNaN(lng)) {
        moverPin(lat, lng);
    }
});

// mover el pin si seleccionan ubicación existente
document.querySelector('#ubicacionId')?.addEventListener('change', function () {
    const option = this.options[this.selectedIndex];
    if (option && option.dataset.lat && option.dataset.lng) {
        moverPin(
            parseFloat(option.dataset.lat.replace(',', '.')),
            parseFloat(option.dataset.lng.replace(',', '.'))
        );
    }
});

})();  // <-- cierre de la IIFE
