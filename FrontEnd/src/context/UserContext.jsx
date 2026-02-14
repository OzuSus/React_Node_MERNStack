import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [allUser, setAllUser] = useState([])

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await fetch("http://localhost:5000/auth/me", {
                    method: "GET",
                    credentials: "include" // send cookie
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                    setUserInfo(data);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Error fetching current user:", err);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCurrentUser();
    }, []);

    const login = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setUserInfo(userData);
    };

    const logout = async () => {
        try {
            await fetch("http://localhost:5000/auth/logout", {
                method: "POST",
                credentials: "include"
            });
        } catch (err) {
            console.error("Logout error:", err);
        }
        localStorage.removeItem("user");
        setUser(null);
        setUserInfo(null);
    };

    const fetchUserDetail = async (userId) => {
        try {
            const res = await fetch(`http://localhost:5000/users?id=${userId}`, {
                method: "GET",
                credentials: "include"
            });
            if (!res.ok) throw new Error("Không thể lấy thông tin chi tiết người dùng.");
            const data = await res.json();
            setUserInfo(data);
        } catch (error) {
            console.error("Lỗi fetch user detail:", error);
        }
    };


    return (
        <UserContext.Provider value={{ user, userInfo, login, logout, isLoading, fetchUserDetail, allUser}}>
            {children}
        </UserContext.Provider>
    );
};
