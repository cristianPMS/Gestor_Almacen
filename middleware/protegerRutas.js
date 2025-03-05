const jwt = require('jsonwebtoken');

const protegerRutas = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Acceso denegado, token no proporcionado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; // Guardar datos del usuario en la petición
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token inválido o expirado" });
    }
};

const verificarRol = (rolRequerido) => {
    return (req, res, next) => {
        if (!req.user || req.user.rol !== rolRequerido) {
            return res.status(403).json({ message: "No tienes permisos para acceder a esta página" });
        }
        next();
    };
};

module.exports = { protegerRutas, verificarRol };
