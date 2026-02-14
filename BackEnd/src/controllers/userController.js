import User from "../models/User.js";
import {getUserService} from "../services/userService.js";
export async function getUser(req, res, next) {
    try {
        const result = await getUserService({
            requester: req.user,
            userId: req.query.id
        });
        return res.json(result);
    } catch (err) {
        next(err);
    }
}
