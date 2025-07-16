const panel = (req, res) => {
    res.render('caminatas/caminatas', {
        pagina: 'Caminatas'
    });
}

const crear = (req, res) => {
    res.render('caminatas/crear', {
        pagina: 'Crear CAminata',
        ocultarBarra: true
    });
}

export {
    panel,
    crear
}
