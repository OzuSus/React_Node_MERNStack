import {ApiError} from "../utils/ApiError.js";
import User from "../models/User.js";

export async function getUserService({ requester, userId }) {
    let id = userId || requester.id;
    if (requester.id !== id && requester.role !== "ADMIN") {
        throw new ApiError(403, "Ban khong co quyen truy cap tai nguyen nay");
    }
    const user = await User.findById(id).select("-password").lean();
    if (!user) {
        throw new ApiError(404, "Khong tim thay user");
    }
    return user;
}
