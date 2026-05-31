import {createContext, useEffect, useState} from "react";
import {api} from "../utils/api";

export const UserContext = createContext();

const normalizeUser = (user) => user ? ({
    ...user,
    id: user.id || user._id,
    _id: user._id || user.id,
}) : null;

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [allUser, setAllUser] = useState([]);

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const res = await api.get("/auth/me");
            const data = normalizeUser(res.data);
            setUser(data);
            setUserInfo(data);
        } catch (err) {
            console.error("Error fetching current user:", err);
            setUser(null);
            setUserInfo(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = (userData) => {
        const data = normalizeUser(userData);
        setUser(data);
        setUserInfo(data);
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (err) {
            console.error("Logout error:", err);
        }
        setUser(null);
        setUserInfo(null);
    };

    const fetchUserDetail = async (userId) => {
        try {
            const res = await api.get("/users", {params: {id: userId}});
            setUserInfo(normalizeUser(res.data));
        } catch (error) {
            console.error("Loi fetch user detail:", error);
        }
    };

    const getAllUser = async () => {
        try {
            const res = await api.get("/users/regular");
            const users = Array.isArray(res.data) ? res.data : res.data.users || [];
            setAllUser(users.map(normalizeUser));
        } catch (error) {
            console.error("Loi fetch all users:", error);
            setAllUser([]);
        }
    };

    return (
        <UserContext.Provider value={{user, userInfo, login, logout, isLoading, fetchUserDetail, allUser, getAllUser}}>
            {children}
        </UserContext.Provider>
    );
};
