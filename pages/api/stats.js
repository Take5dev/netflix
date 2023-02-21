import { createNewStats, findVideoIdByUser, updateStats } from '../../lib/db/hasura';
import { verifyToken } from '../../lib/utils';

export default async function Stats(req, res) {

    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(403).send("Token is not provided");
        }
        else {
            const inputParams = req.method === "POST" ? req.body : req.query;
            const { videoId } = inputParams;
            if (videoId) {
                const userId = await verifyToken(token);
                const findVideo = await findVideoIdByUser(token, userId, videoId);
                const doesStatsExist = findVideo?.length > 0;
                if (req.method === "POST") {
                    const { favourited, watched = true } = req.body;
                    if (doesStatsExist) {
                        const response = await updateStats(token, {
                            userId,
                            videoId,
                            favourited,
                            watched
                        });
                        res.status(200).send({ data: response });
                    }
                    else {
                        const response = await createNewStats(token, {
                            userId,
                            videoId,
                            favourited,
                            watched
                        });
                        res.status(200).send({ data: response });
                    }
                }
                else {
                    if (doesStatsExist) {
                        res.status(200).send(findVideo);
                    }
                    else {
                        res.status(404).send("VideoID not found for this userId");
                    }
                }
            }
            else {
                console.error("VideoID is not provided");
                res.status(500).send("VideoID is not provided");
            }
        }
    }
    catch (error) {
        console.error("Something went wrong in Stats function", error);
        res.status(500).send({ error });
    }
}