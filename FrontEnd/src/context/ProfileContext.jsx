import React, {createContext, useState} from "react";
import axios from "axios";
import {showConfirmDialog, showErrorDialog, showSuccessDialog} from "../utils/Alert";

export const ProfileContext = createContext();

export const ProfileProvider = ({children}) => {
    const [changeStatus, setChangeStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [userInfo, setUserInfo] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    // const [user, setUser] = useState(null);

    const fetchUserInfo = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/auth/me`,{
                method: "GET",
                credentials: "include",
                // headers: {
                //     "Content-Type": "application/json",
                //     Authorization: `Bearer ${localStorage.getItem("token")}`
                // }
            })
            const data = await response.json();
            setUserInfo(data);
            return data
        } catch (error) {
            console.error("Lỗi tải thông tin người dùng:", error);
        }
    }


    const handleChangeAvatar = async (id, avatarFile) => {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        try {
            setIsUploading(true);
            await axios.put("http://localhost:5000/users/upload-avatar",
                formData,
                {
                    withCredentials: true
                }
            );
            setChangeStatus("success");
            setErrorMessage("");
            await fetchUserInfo(id);
            setIsUploading(false);
            await showSuccessDialog("Thành công", "Avatar đã được thay đổi.");
        } catch (error) {
            setIsUploading(false);
            console.error("Lỗi đổi avatar:", error);
            setChangeStatus("error");
            const msg = error.response?.data?.message || "Không thể đổi avatar.";
            setErrorMessage(msg);
            await showErrorDialog("Lỗi", msg);
        }
    };

    const handleChangeProfile = async (id, username, fullname, address, phone, email) => {
        try {
            const response =  await fetch(`http://localhost:5000/users/updateAccount`,{
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({fullname, address, phone})
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Update thất bại");
            }
            setChangeStatus("success");
            setErrorMessage("");
            await fetchUserInfo(id);
            await showSuccessDialog("Thành công", "Thông tin đã được thay đổi.");

        } catch (error) {
            console.error("Lỗi đổi thông tin:", error);
            setChangeStatus("error");
            const msg = error.message || "Không thể đổi thông tin.";
            setErrorMessage(msg);
            await showErrorDialog("Lỗi", msg);
        }
    }

    return (
        <ProfileContext.Provider value={{
            handleChangeAvatar,
            handleChangeProfile,
            fetchUserInfo,
            userInfo,
            changeStatus,
            setChangeStatus,
            errorMessage,
            isUploading
        }}>
            {children}
        </ProfileContext.Provider>
    );
}