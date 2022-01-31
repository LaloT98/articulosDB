const helpersUSer = {};

helpersUSer.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'No estas logeado aun');
    res.redirect('/');
};


module.exports = helpersUSer;