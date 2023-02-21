import { setTokenCookie } from "@/lib/cookies";
import { createNewUser, isNewUser } from "@/lib/db/hasura";
import { magicAdmin } from "@/lib/magic-admin";
import jwt from 'jsonwebtoken';

export default async function Login(req, res) {
    if (req.method === "POST") {
        try {
            const auth = req.headers.authorization;
            const didToken = auth ? auth.substr(7) : "";
            const metadata = await magicAdmin.users.getMetadataByToken(didToken);

            const token = jwt.sign({
                ...metadata,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
                "https://hasura.io/jwt/claims": {
                    "x-hasura-allowed-roles": ["user", "admin"],
                    "x-hasura-default-role": "user",
                    "x-hasura-user-id": `${metadata.issuer}`,
                },
            }, process.env.HASURA_TOKEN_SECRET);

            const isNewUserQuery = await isNewUser(token, metadata.issuer);
            isNewUserQuery && await createNewUser(token, metadata);
            setTokenCookie(token, res);
            res.status(200).send({ done: true });
        }
        catch (error) {
            console.error("Something went wrong with Login API", error);
            res.status(500).send(error);
        }
    }
    else {
        res.status(500).send("Method is not POST");
    }
}