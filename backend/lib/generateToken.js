import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
    if (!userId) return null;
    const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
        expiresIn: "15d",
    });
    return token;
};