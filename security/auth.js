function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
function ensureNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
function isAdmin(req, res, next) {
  if (req.user.role === "admin") {
    return next();
  }
  res.status(404).send("<h1>404 Page Not Found!</h1>");
}
function isAdmin2(req, res) {
  if (req.user.role === "admin") {
    return true;
  }
  return false;
}
module.exports = {
  ensureAuthenticated,
  ensureNotAuthenticated,
  isAdmin,
  isAdmin2
};
