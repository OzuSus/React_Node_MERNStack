import "./login.css";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import {useContext, useEffect, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {UserContext} from "../../context/UserContext";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate()

    const {login, user} = useContext(UserContext);

    useEffect(() => {
        if (user) {
            navigate("/Home", {replace: true});
        }
    }, [user, navigate]);
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    account: username,
                    password: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // nếu backend trả { user }:
                const userFromServer = data.user ?? data;
                login(userFromServer); // dùng context
                navigate("/Home"); // chú ý trùng case với cấu hình route của bạn
            } else if (response.status === 401) {
                setError("Sai tên đăng nhập hoặc mật khẩu.");
            } else if (response.status === 403) {
                setError("Tài khoản chưa được xác thực.");
            } else {
                const errBody = await response.json().catch(() => null);
                setError(errBody?.message || "Đã xảy ra lỗi không xác định.");
            }
        } catch (err) {
            console.error("Login fetch error:", err);
            setError("Không thể kết nối đến máy chủ.");
        }
    };

    return (
        <section className="loginSection">
            <div className="formBox">
                <div className="formValue">
                    <form onSubmit={handleLogin}>
                        <h2>Login</h2>
                        {error && <p className="error">️ ⚠️ {error}</p>}
                        <div className="inputBox">
                            <MailOutlineRoundedIcon/>
                            <input autoComplete={"off"} type="text" name="loginEmail" id="loginEmail" required
                                   placeholder=" " value={username} onChange={(e) => setUsername(e.target.value)}/>
                            <label htmlFor="loginEmail">Username</label>
                        </div>
                        <div className="inputBox">
                            <input type={showPassword ? "text" : "password"} name="loginPassword" id="loginPassword"
                                   required placeholder=" " value={password}
                                   onChange={(e) => setPassword(e.target.value)}/>
                            <label htmlFor="loginPassword">Password</label>
                            <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityOff/> : <Visibility/>}
              </span>
                        </div>
                        <div className="forget">
                            <NavLink to="/forgot-password">
                                <span>Forgot Password ?</span>
                            </NavLink>
                        </div>
                        <div className="buttons" style={{fontFamily: "abel"}}>
                            <button type="submit">Log in</button>
                        </div>
                        <div className="signUp">
                            <p> Don't have an account?{" "}
                                <a href="/Register">
                                    Sign Up...
                                </a>{" "}
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}