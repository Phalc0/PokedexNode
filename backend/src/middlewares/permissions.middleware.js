exports.checkRole = (rolesAllowed) => {

    return (req, res, next) => {

        if (!req.auth)
            return res.status(401).json({ message: "Not authenticated" });

        if (!rolesAllowed.includes(req.auth.role))
            return res.status(403).json({ message: "Forbidden: insufficient permissions" });

        next();
    };
};