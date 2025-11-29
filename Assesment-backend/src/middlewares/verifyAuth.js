import jwt from 'jsonwebtoken';

export const verifyAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access token missing or invalid" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_FOR_ACCESS_TOKEN, {
            issuer: process.env.JWT_ISSUER,
        });
        
        req.user = { id: decoded.userId };
        next();
    } catch (err) {
        console.error("JWT verification error:", err.message);
        return res.status(401).json({ message: "Unauthorized" });
    }
};