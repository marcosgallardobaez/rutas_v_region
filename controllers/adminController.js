const formularioLogin = (req, res) => {
    res.render('admin/login')
}

const formularioRegistro = (req, res) => {
    res.render('admin/registro')
};

const formularioOlvidePassword = (req, res) => {
    res.render('admin/olvide-password')
};

export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword
}