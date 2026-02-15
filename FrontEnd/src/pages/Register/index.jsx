import "./register.css";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import PlaceIcon from '@mui/icons-material/Place';

import {useContext, useEffect, useState} from "react";
import {NavLink, useNavigate, Link} from "react-router-dom";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import axios from "axios";

import Swal from "sweetalert2";
import Loader from "../../components/Loader";
import 'sweetalert2/dist/sweetalert2.min.css';
import {showErrorDialog} from "../../utils/Alert.js";
import {UserContext} from "../../context/UserContext.jsx";
export default function Register() {
    const {user} = useContext(UserContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
            navigate("/Home", {replace: true});
        }
    }, [user, navigate]);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        fullname: "",
        email: "",
        phone: "",
        address: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
        phone: ""
    });

    const [success, setSuccess] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [currentPasswordErrorIndex, setCurrentPasswordErrorIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const validatePassword = async () => {
            if (!formData.password.trim()) return;
            try {
                const res = await fetch(
                    "http://localhost:5000/users/validate-password",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            password: formData.password,
                        }),
                    }
                );
                const data = await res.json();
                if (!res.ok) {setErrors(prev => ({...prev, password: data.message}));
                    return;
                }
                setErrors(prev => ({...prev, password: ""}));
            } catch (err) {
                console.error(err);
            }
        };

        const timeout = setTimeout(validatePassword, 500);
        return () => clearTimeout(timeout);
    }, [formData.password]);

    useEffect(() => {
        if (
            passwordErrors.length > 0 &&
            currentPasswordErrorIndex < passwordErrors.length &&
            !formData.password.includes(passwordErrors[currentPasswordErrorIndex])
        ) {
            const nextIndex = currentPasswordErrorIndex + 1;
            if (nextIndex < passwordErrors.length) {
                setCurrentPasswordErrorIndex(nextIndex);
                setErrors(prev => ({ ...prev, password: passwordErrors[nextIndex] }));
            } else {
                setPasswordErrors([]);
                setCurrentPasswordErrorIndex(0);
                setErrors(prev => ({ ...prev, password: "" }));
            }
        }
    }, [formData.password]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            const numericValue = value.replace(/\D/g, "");
            if (numericValue.length > 15) return;

            setFormData(prev => ({ ...prev, [name]: numericValue }));

            setErrors(prev => ({
                ...prev,
                phone: numericValue.length > 10 ? "Số điện thoại không hợp lệ" : ""
            }));

        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ username: "", email: "", password: "" });
        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setLoading(false);
                setErrors(prev => ({
                    ...prev,
                    username: data.message,
                    email: data.message
                }));
                return;
            }
            setLoading(false);
            Swal.fire({
                title: "Đăng ký thành công!",
                text: "Vui lòng kiểm tra email để xác thực.",
                icon: "success",
                confirmButtonText: "OK",
                background: '#f0f9ff',
                color: '#1d3557',
            }).then(() => {
                navigate("/Login");
            });

            setSuccess(true);

        } catch (err) {
            setLoading(false);
            showErrorDialog("Đã xảy ra lỗi!","Vui lòng thử lại sau.")
            console.error(err);
        }
    };


    return (
        <section className="signUpSection">
            <div className="formBox">
                <div className="formValue">
                    <form onSubmit={handleSubmit}>
                        <h2>Sign Up</h2>
                        {(errors.username || errors.email || errors.password || errors.phone) && (
                            <p className="error">
                                ⚠️ {errors.username || errors.email || errors.password || errors.phone}
                            </p>
                        )}
                        <div className="inputBox">
                            <PersonIcon />
                            <input autoComplete={"off"} type="text" name="username" id="username" required placeholder=" " value={formData.username} onChange={handleChange}/>
                            <label htmlFor="username">UserName</label>
                        </div>
                        <div className="inputBox">
                            <input type={showPassword ? "text" : "password"} name="password" id="password" required placeholder=" " value={formData.password} onChange={handleChange}/>
                            <label htmlFor="password">Password</label>
                            <span onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </span>
                        </div>
                        <div className="inputBox">
                            <PersonIcon />
                            <input autoComplete={"nope"} type="text" name="fullname" id="fullname" required placeholder=" " value={formData.fullname} onChange={handleChange}/>
                            <label htmlFor="fullname">Fullname</label>
                        </div>
                        <div className="inputBox">
                            <MailOutlineRoundedIcon />
                            <input autoComplete={"nope123"} type="email" name="email" id="email" required placeholder=" " value={formData.email} onChange={handleChange}/>
                            <label htmlFor="email">Email</label>
                        </div>
                        <div className="inputBox">
                            <PhoneEnabledIcon />
                            <input autoComplete={"nope123"} type="text" name="phone" id="phone" required placeholder=" " value={formData.phone} onChange={handleChange}/>
                            <label htmlFor="phone">Phone number</label>
                        </div>
                        <div className="inputBox">
                            <PlaceIcon />
                            <input autoComplete={"nope"} type="text" name="address" id="address" required placeholder=" " value={formData.address} onChange={handleChange}/>
                            <label htmlFor="address">Address</label>
                        </div>
                        <div className="buttons">
                            <button type="submit" disabled={loading}>
                                Sign Up
                            </button>


                        </div>
                        <div className="signUp">
                        <p>
                                Already have an account? <Link to="/login">Sign In</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
            {loading && (
                <Loader></Loader>
            )}
        </section>
    );
}