import "./login.css";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import {useContext, useEffect, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {Visibility, VisibilityOff} from "@mui/icons-material";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate()

    return (
        <section className="loginSection">
            <div className="formBox">
                <div className="formValue">
                    <form >
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