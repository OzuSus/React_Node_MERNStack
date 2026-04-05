import React, {createContext, useState} from "react";
import axios from "axios";
import {showConfirmDialog, showErrorDialog, showSuccessDialog} from "../utils/Alert";

export const ChangePasswordContext = createContext();

export const ChangePasswordProvider = ({children}) => {
    const [changeStatus, setChangeStatus] = useState(null); // lưu trạng thái: "success", "error", v.v.
    const [errorMessage, setErrorMessage] = useState("");

    const handleChangePassword = async (userId, oldPassword, newPassword) => {
        // const result = await showConfirmDialog("Bạn có chắc muốn đổi mật khẩu?");
        // if (!result.isConfirmed) return;

        try {
            await axios.put(
                "http://localhost:5000/users/change-password",
                null,
                {
                    params: {
                        oldPass: oldPassword,
                        newPass: newPassword
                    },
                    withCredentials: true
                }
            );

            setChangeStatus("success");
            setErrorMessage("");
            await showSuccessDialog("Thành công", "Mật khẩu đã được thay đổi.");
        } catch (error) {
            console.error("Lỗi đổi mật khẩu:", error);
            setChangeStatus("error");
            // setErrorMessage(error.response?.data?.message || "Không thể đổi mật khẩu.");
            setErrorMessage(error.response?.data?.message || "Mật khẩu cũ ko hợp lệ");
            // await showErrorDialog("Lỗi", errorMessage || "Không thể đổi mật khẩu.");
            await showErrorDialog("Lỗi", errorMessage || "Mật khẩu cũ ko hợp lệ");
        }
    };

    const validatePassword = (password) => {
        const errors = [];
        if (!password || !password.trim()) {
            return { valid: false, errors: ["Mật khẩu không được để trống"] };
        }
        if (password.length < 8) {
            errors.push("Mật khẩu phải có ít nhất 8 ký tự");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Phải có ít nhất 1 chữ hoa");
        }
        if (!/[a-z]/.test(password)) {
            errors.push("Phải có ít nhất 1 chữ thường");
        }
        if (!/[0-9]/.test(password)) {
            errors.push("Phải có ít nhất 1 số");
        }
        if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
            errors.push("Phải có ít nhất 1 ký tự đặc biệt");
        }
        return {
            valid: errors.length === 0,
            errors
        };
    };

    return (
        <ChangePasswordContext.Provider
            value={{handleChangePassword, validatePassword, changeStatus, setChangeStatus, errorMessage}}>
            {children}
        </ChangePasswordContext.Provider>
    );
};