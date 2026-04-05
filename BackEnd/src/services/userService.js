import {ApiError} from "../utils/ApiError.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import {sendResetPasswordEmail} from "./EmailService.js";
import {createRandomPassword} from "../utils/CreatePassword.js";

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

export async function updateAccountService(userId, fullname, address, phone) {
    if (!fullname || !address || !phone) {
        throw new ApiError(400, "fullname, address va phone khong duoc de trong");
    }
    const user = await User.findByIdAndUpdate(userId, { fullname, address, phone }, { new: true }).select("-password").lean();
    if (!user) {
        throw new ApiError(404, "Khong tim thay user");
    }
    return user;
}

export async function updateAvatarService(userId, avatarUrl) {
    const user = await User.findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true }).select("-password").lean();
    if (!user) {
        throw new ApiError(404, "Khong tim thay user");
    }
    return user;
}

export async function changePasswordService(userId, oldPass, newPassword) {
      const user = await User.findById(userId);
      if (!user) {
          throw new ApiError(404, "Khong tim thay user");
      }
      const isMatchPass = await bcrypt.compare(oldPass, user.password);
      if(!isMatchPass){
          throw new ApiError(400, "Mat khau cu khong chinh xac");
      }
      const isvalidNewPass = await validatePasswordService(newPassword);
      if (!isvalidNewPass) {
          throw new ApiError(400, "Mat khau moi khong hop le");
      }
      const SALT_ROUNDS = 10;
      const newHashPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
      user.password = newHashPassword;
      await user.save();
}

export async function resetPasswordService(username, email) {
    const user = await User.findOne({ username, email });
    if (!user) {
        throw new ApiError(404, "Tai khoan ko dung");
    }
    const passwordReset = createRandomPassword();
    const SALT_ROUNDS = 10;
    const newHashPassword = await bcrypt.hash(passwordReset, SALT_ROUNDS);
    user.password = newHashPassword;
    await user.save();
    await sendResetPasswordEmail(email, username,passwordReset);
}
