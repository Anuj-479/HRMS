function isAuthenticated(req, res, next) {
    console.log("isAuthenticated");
    if (req.session.user) {
        console.log("isAuthenticated if");
        next()
    }
    else {
        console.log("isAuthenticated else");
        res.redirect("/logout");
    }
}

module.exports = {
    isAuthenticated
}