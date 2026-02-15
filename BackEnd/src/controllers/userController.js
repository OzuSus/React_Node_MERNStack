import User from "../models/User.js";
import {getUserService, validatePasswordService} from "../services/userService.js";
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

export async function validatePassword(req, res, next) {
    try {
        const { password } = req.body;
        await validatePasswordService(password);
        return res.status(200).json({message: "Password OK!"});
    } catch (err) {
        next(err);
    }
}
