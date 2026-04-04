import React, {createContext, useState} from "react";
import axios from "axios";
import {showConfirmDialog, showErrorDialog, showSuccessDialog} from "../utils/Alert";

export const ProfileContext = createContext();

export const ProfileProvider = ({children}) => {
    const [changeStatus, setChangeStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [userInfo, setUserInfo] = useState(null);
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

    const handleUploadFile = async (filename) => {
        try {
            const response = await axios.get(`http://localhost:8080/uploads/${encodeURIComponent(filename)}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi tải lên tệp:", error);
            setChangeStatus("error");
            setErrorMessage(error.response?.data?.message || "Không thể tải lên tệp.");
            await showErrorDialog("Lỗi", errorMessage || "Không thể tải lên tệp.");
        }
    }

    const handleChangeAvatar = async (id, avatarFile) => {

        const formData = new FormData();
        formData.append("id", id);
        formData.append("avatarFile", avatarFile);

        try {
            await axios.put(`http://localhost:8080/api/users/updateAvatar`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }

            });

            setChangeStatus("success");
            setErrorMessage("");
            await handleUploadFile(avatarFile.name);
            await fetchUserInfo(id);
            await showSuccessDialog("Thành công", "Avatar đã được thay đổi.");

        } catch (error) {
            console.error("Lỗi đổi avatar:", error);
            setChangeStatus("error");
            setErrorMessage(error.response?.data?.message || "Không thể đổi avatar.");
            await showErrorDialog("Lỗi", errorMessage || "Không thể đổi avatar.");
        }
    }

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
            handleUploadFile,
            fetchUserInfo,
            userInfo,
            changeStatus,
            setChangeStatus,
            errorMessage
        }}>
            {children}
        </ProfileContext.Provider>
    );
}