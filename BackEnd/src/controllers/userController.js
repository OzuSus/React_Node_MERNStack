import User from "../models/User.js";
import {
    changePasswordService,
    checkUserExistsService,
    confirmCollaboratorService,
    createUserByAdminService,
    getPendingCollaboratorsService,
    getRegularUserMonthlyStatsService,
    getRegularUsersService,
    getUserService, resetPasswordService,
    updateAccountService,
    updateAvatarService,
    validatePasswordService
} from "../services/userService.js";
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
        return res.status(200).json({valid: true, message: "Password hop le!"});
    } catch (err) {
        next(err);
    }
}

export async function getRegularUsers(req, res, next) {
    try {
        const users = await getRegularUsersService();
        return res.status(200).json(users);
    } catch (err) {
        next(err);
    }
}

export async function getRegularUserMonthlyStats(req, res, next) {
    try {
        const stats = await getRegularUserMonthlyStatsService();
        return res.status(200).json(stats);
    } catch (err) {
        next(err);
    }
}

export async function checkUserExists(req, res, next) {
    try {
        const result = await checkUserExistsService(req.query);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

export async function createUserByAdmin(req, res, next) {
    try {
        const user = await createUserByAdminService(req.body);
        return res.status(201).json({message: "Tao user thanh cong", user});
    } catch (err) {
        next(err);
    }
}

export async function getPendingCollaborators(req, res, next) {
    try {
        const users = await getPendingCollaboratorsService();
        return res.status(200).json(users.map(mapCollaborator));
    } catch (err) {
        next(err);
    }
}

export async function confirmCollaborator(req, res, next) {
    try {
        const isConfirmed = req.query.isConfirmed === "true" || req.body?.isConfirmed === true;
        const user = await confirmCollaboratorService(req.params.id, isConfirmed);
        return res.status(200).json({
            responseMessage: isConfirmed ? "Da duyet CTV" : "Da tu choi CTV",
            user
        });
    } catch (err) {
        next(err);
    }
}

export async function updateAccount(req, res, next){
    try{
        const {fullname, address, phone} = req.body;
        const userId = req.user.id;
        const user = await updateAccountService(userId ,fullname, address, phone);
        return res.status(200).json({message: "Update tai khoan thanh cong!", user});
    }catch (err) {
        next(err);
    }
}

export async function uploadAvatar(req,res,next) {
    console.log("👉 vào controller");
    try{
        if (!req.file) {
            return res.status(400).json({ message: "Không có file" });
        }
        const userId = req.user.id;
        const avatarUrl = req.file.path;
        const user = await updateAvatarService(userId, avatarUrl);
        return  res.status(200).json({
                    message: "Upload avatar thanh cong!",
                    user
                });
    }catch (err) {
        next(err);
    }
}

export async function changePassword(req,res,next) {
    try{
        const userId = req.user.id;
        const {oldPass, newPass} = req.query;
        await changePasswordService(userId, oldPass, newPass);
        return res.status(200).json({message: "Đổi mật khẩu thành công!"});
    }catch (err) {
        next(err);
    }
}

export async function resetPassword(req,res,next) {
    try{
        const {username,email} = req.query;
        await resetPasswordService(username, email);
        return res.status(200).json({message: "Reset mật khẩu thành công! Vui lòng kiểm tra email để nhận mật khẩu mới."});
    }catch (err) {
        next(err);
    }
}

function mapCollaborator(user) {
    const [firstName = "", ...rest] = (user.fullname || "").split(" ");
    return {
        id: user._id,
        firstName,
        lastName: rest.join(" "),
        email: user.email,
        phoneNo: user.phone,
        location: user.address,
        experienceAndSkills: user.experienceAndSkills || "",
        sampleWorkLink: user.sampleWorkLink || "",
        reason: user.reason || ""
    };
}
