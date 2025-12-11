//autorize with role

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: "Accès refusé" });
        }
        next();
    };
};

module.exports = {authorize};
