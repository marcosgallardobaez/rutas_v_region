
export  function setAuthLocals (req, res, next) {
    res.locals.isAuth = req.session.isAuth || false;
    res.locals.user = req.session.user || null;
    next();
}

