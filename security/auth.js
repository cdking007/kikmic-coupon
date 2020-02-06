function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
function ensureNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    console.log("user is not loged in!");
    return next();
  }
  res.redirect("/admin/coupons");
}
module.exports = {
  ensureAuthenticated,
  ensureNotAuthenticated
};
