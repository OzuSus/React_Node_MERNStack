import "./login.css";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import {useContext, useEffect, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {UserContext} from "../../context/UserContext";
import axios from "axios";
import {showSuccessDialog} from "../../utils/Alert";
import Loader from "../../components/Loader";

export default function ForgotPassword() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const {login, user} = useContext(UserContext);

    useEffect(() => {
        if (user) {
            navigate("/Home", {replace: true});
        }
    }, [user, navigate]);
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError("");
        try {
            setLoading(true);
            await axios.post("http://localhost:5000/users/reset-password",
                {},
                {
                    params: {
                        username,
                        email
                    }
                }
            )
                setLoading(false);
            // setError("Đã gửi yêu cầu đặt lại mật khẩu. Vui lòng kiểm tra email của bạn.");
            await showSuccessDialog("Thành công", "Đã gửi mật khẩu mới cho bạn. Vui lòng kiểm tra email của bạn.")
            navigate("/Login");
        } catch (err) {
            setLoading(false);
            const message =
                err?.response?.data?.message ||
                err?.response?.data ||
                "Lỗi không xác định. Vui lòng thử lại sau.";

            setError(typeof message === "string" ? message : JSON.stringify(message));
        }
    };

    return (
        <section className="loginSection">
            {loading && <Loader/>}
            <div className="formBox">
                <div className="formValue">
                    <form onSubmit={handleForgotPassword}>
                        <h2>Forgot Password</h2>
                        {error && <p className="error">️ ⚠️ {error}</p>}
                        <div className="inputBox">
                            <PersonIcon/>
                            <input autoComplete={"off"} type="text" name="loginUsername" id="loginUsername" required
                                   placeholder=" " value={username} onChange={(e) => setUsername(e.target.value)}/>
                            <label htmlFor="loginUsername">Username</label>
                        </div>
                        <div className="inputBox">
                            <MailOutlineRoundedIcon/>
                            <input type="text" name="loginEmail" id="loginEmail" required placeholder=" " value={email}
                                   onChange={(e) => setEmail(e.target.value)}/>
                            <label htmlFor="loginEmail">Email</label>
                        </div>
                        <div className="buttons" style={{fontFamily: "abel"}}>
                            <button type="submit">Forgot Password</button>
                        </div>
                        <div className="signUp">
                            <p> Remembered your password ?{" "}
                                <a href="/Login">
                                    Log in now
                                </a>{" "}
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}