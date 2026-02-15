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

export async function validatePasswordService(password) {
    if (!password) {
        throw new ApiError(400, "Password khong duoc de trong");
    }
    if (password.length < 8) {
        throw new ApiError(400, "Password phai co it nhat 8 ky tu");
    }
    if (!/[A-Z]/.test(password)) {
        throw new ApiError(400, "Password phai co it nhat 1 chu in hoa");
    }
    if (!/\d/.test(password)) {
        throw new ApiError(400, "Password phai co it nhat 1 chu so");
    }
    if (!/[^A-Za-z\d]/.test(password)) {
        throw new ApiError(400, "Password phai co it nhat 1 ky tu dac biet");
    }
    return true;
}
