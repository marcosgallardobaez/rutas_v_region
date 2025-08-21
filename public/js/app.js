document.getElementById('ubicacionId').addEventListener('change', function(){
    const option = this.options[this.selectedIndex];

    if (option.value) {
        document.getElementById('nombre').value = option.dataset.nombre;
        document.getElementById('direccion').value = option.dataset.direccion;
        document.getElementById('comuna').value = option.dataset.comuna;
        document.getElementById('provincia').value = option.dataset.provincia;
        document.getElementById('region').value = option.dataset.region;
        document.getElementById('pais').value = option.dataset.pais;
        document.getElementById('lat').value = option.dataset.lat;
        document.getElementById('lng').value = option.dataset.lng;
    } else {
        //limpiar inputs si no hay selección
        document.querySelectorAll('#nombre, #direccion, #comuna, #provincia, #region, #pais, #lat, #lng')
        .forEach(input => input.value = '');
    }
});