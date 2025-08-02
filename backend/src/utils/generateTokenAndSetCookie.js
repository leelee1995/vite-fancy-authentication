import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("authtoken", token, {
        httpOnly: true, // Can only be accessed by http; Prevents attack from xss
        secure: process.env.NODE_ENV === "production",
        samesite: "strict", //  Prevents csrf attack
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return token;
};
