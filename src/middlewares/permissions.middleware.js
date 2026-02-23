exports.checkRole = (requiredRole) => {

    return (req, res, next) => {

        if (!req.auth)
            return res.status(403).json({ message: "Not authenticated" });

        if (req.auth.role !== requiredRole)
            return res.status(403).json({ message: "Forbidden: insufficient permissions" });

        next();
    };
};