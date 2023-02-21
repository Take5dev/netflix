//import jwt from 'jsonwebtoken';
import { jwtVerify } from 'jose';

export async function verifyToken(token) {
    try {
        if (token) {
            const verified = await jwtVerify(
                token,
                new TextEncoder().encode(process.env.HASURA_TOKEN_SECRET)
            );
            return verified.payload && verified.payload?.issuer;
        }
        return null;
    } catch (err) {
        console.error("JWT Verification Error", { err });
        return null;
    }

    // if (token) {
    //     const decodedToken = jwt.verify(token, process.env.HASURA_TOKEN_SECRET);
    //     return decodedToken.issuer;
    // }
    // return null;
}