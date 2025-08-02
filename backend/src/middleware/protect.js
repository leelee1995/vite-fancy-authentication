import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    const token = req.cookies.authtoken;

    try {
        if (!token)
            return res
                .status(401)
                .json({ message: "Unauthorized - no token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded)
            return res
                .status(401)
                .json({ message: "Unauthorized - invalid token" });

        req.userId = decoded.userId;

        next();
    } catch (error) {
        console.log("Error in verifyToken", error);
        return res.status(500).json({ message: "Server error" });
    }
};
