const jwt = require('jsonwebtoken');
async function auth(req, res, next) {
    try {
        const token = req?.headers?.authorization?.split(" ").pop() || null
        if (!token) {
            return res.status(401).json({ error: 'Avtorizatsiyadan o\'tmadingiz' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: 'Berilgan token xato' });
        }
        req.user = decoded;
        next();
    } catch (e) {
        console.error(e.message);
        return res.status(401).json({ message: "Ошибка сервера или вы не авторизованы" });
    }
}

module.exports = auth;