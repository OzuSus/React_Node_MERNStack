import React, { useEffect, useState } from "react";
import { Modal, Box } from "@mui/material";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PersonIcon from "@mui/icons-material/Person";
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import PlaceIcon from '@mui/icons-material/Place';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { showSuccessDialog, showErrorDialog } from "../../../utils/Alert";
import Loader from "../../../components/Loader";
import './AddUserModal.css';

const AddUserModal = ({ open, onClose, onUserAdded }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullname: '',
        email: '',
        phone: '',
        address: ''
    });
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        phone: ''
    });
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [currentPasswordErrorIndex, setCurrentPasswordErrorIndex] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [labelStates, setLabelStates] = useState({
        username: false, password: false,
        fullname: false, email: false, phone: false, address: false
    });
    const [isCancelHovered, setIsCancelHovered] = useState(false);
    const [isSubmitHovered, setIsSubmitHovered] = useState(false);

    const handleFocus = (field) => setLabelStates(prev => ({ ...prev, [field]: true }));
    const handleBlur = (field, value) => {
        if (!value) {
            setLabelStates(prev => ({ ...prev, [field]: false }));
        }
    };

    useEffect(() => {
        if (open) {
            const newLabelStates = {};
            for (const key in formData) {
                newLabelStates[key] = !!formData[key];
            }
            setLabelStates(newLabelStates);
        }
    }, [open]);

    useEffect(() => {
        const checkUsernameEmail = async () => {
            if (formData.username.trim() || formData.email.trim()) {
                try {
                    const res = await axios.get("http://localhost:8080/api/users/check-user", {
                        params: {
                            username: formData.username,
                            email: formData.email
                        }
                    });
                    const { usernameExists, emailExists } = res.data;
                    setErrors(prev => ({
                        ...prev,
                        username: usernameExists ? "User đã tồn tại!" : "",
                        email: emailExists ? "Email đã tồn tại!" : ""
                    }));
                } catch (error) {
                    console.error("Lỗi kiểm tra username/email:", error);
                }
            }
        };
        const timer = setTimeout(() => checkUsernameEmail(), 500);
        return () => clearTimeout(timer);
    }, [formData.username, formData.email]);

    useEffect(() => {
        const validatePassword = async () => {
            if (formData.password.trim()) {
                try {
                    const res = await axios.post("http://localhost:8080/api/users/validate-password", {
                        password: formData.password
                    });
                    if (res.data.valid) {
                        setPasswordErrors([]);
                        setCurrentPasswordErrorIndex(0);
                        setErrors(prev => ({ ...prev, password: "" }));
                    }
                } catch (err) {
                    if (err.response?.status === 400) {
                        const list = err.response.data.errors;
                        setPasswordErrors(list);
                        setCurrentPasswordErrorIndex(0);
                        setErrors(prev => ({ ...prev, password: list[0] }));
                    }
                }
            }
        };
        validatePassword();
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
            if (value) {
                setLabelStates(prev => ({ ...prev, [name]: true }));
            }
            if (errors[name]) {
                setErrors(prev => ({ ...prev, [name]: "" }));
            }
        }
    };

    const resetForm = () => {
        setFormData({
            username: '',
            password: '',
            fullname: '',
            email: '',
            phone: '',
            address: ''
        });
        setErrors({
            username: '',
            email: '',
            password: '',
            phone: ''
        });
        setPasswordErrors([]);
        setCurrentPasswordErrorIndex(0);
        setShowPassword(false);
        const newLabelStates = {};
        for (const key in labelStates) {
            newLabelStates[key] = false;
        }
        setLabelStates(newLabelStates);
    };

    const handleCloseModal = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {

            const res = await axios.post("http://localhost:8080/api/users/register", formData);
            setLoading(false);
            onClose();
            await showSuccessDialog("Thêm thành công!", "Người dùng mới đã được tạo.");
            if (onUserAdded) onUserAdded(res.data);
            resetForm();

        } catch (err) {
            setLoading(false);
            let errorText = "Đã xảy ra lỗi. Vui lòng thử lại sau.";
            if (err.response?.data) {
                const data = err.response.data;
                errorText =
                    typeof data === 'string' ? data :
                        data.message ||
                        (Array.isArray(data.errors) ? data.errors.join("\n") :
                            typeof data.errors === 'object' ? Object.values(data.errors).join("\n") : errorText);

                if (Array.isArray(data.errors)) {
                    setPasswordErrors(data.errors);
                    setCurrentPasswordErrorIndex(0);
                    setErrors(prev => ({ ...prev, password: data.errors[0] }));
                }
            }

            await showErrorDialog("Thêm thất bại!", errorText);
        }
    };

    const combinedError = errors.username || errors.email || errors.password || errors.phone;

    const getLabelClassName = (field) => labelStates[field] ? "input-box-label floated" : "input-box-label";

    return (
        <Modal
            open={open}
            onClose={loading ? undefined : handleCloseModal}
            disableEscapeKeyDown={loading}
            disableBackdropClick={loading}
        >
            <Box className="modal-box">
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <h2 className="form-title">Thêm User Mới</h2>
                        {combinedError && <p className="error-text">⚠️ {combinedError}</p>}

                        {[
                            { name: 'username', label: 'UserName', type: 'text', icon: <PersonIcon className="input-icon" /> },
                            {
                                name: 'password',
                                label: 'Password',
                                type: showPassword ? 'text' : 'password',
                                icon: null,
                                toggle: (
                                    <span onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                                        {showPassword ? <VisibilityOff className="input-icon" /> : <Visibility className="input-icon" />}
                                    </span>
                                )
                            },
                            { name: 'fullname', label: 'Fullname', type: 'text', icon: <PersonIcon className="input-icon" /> },
                            { name: 'email', label: 'Email', type: 'email', icon: <MailOutlineRoundedIcon className="input-icon" /> },
                            { name: 'phone', label: 'Phone number', type: 'text', icon: <PhoneEnabledIcon className="input-icon" /> },
                            { name: 'address', label: 'Address', type: 'text', icon: <PlaceIcon className="input-icon" /> },
                        ].map(field => (
                            <div key={field.name} className="input-box">
                                {field.icon}
                                <input
                                    className="input-field"
                                    autoComplete="off"
                                    type={field.type}
                                    name={field.name}
                                    id={`modal_${field.name}`}
                                    required={field.name !== 'address'}
                                    placeholder=" "
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus(field.name)}
                                    onBlur={(e) => handleBlur(field.name, e.target.value)}
                                />
                                <label htmlFor={`modal_${field.name}`} className={getLabelClassName(field.name)}>
                                    {field.label}
                                </label>
                                {field.toggle}
                            </div>
                        ))}

                        <div className="button-container">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                disabled={loading}
                                className={`btn-cancel ${isCancelHovered ? 'hovered' : ''}`}
                                onMouseEnter={() => setIsCancelHovered(true)}
                                onMouseLeave={() => setIsCancelHovered(false)}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !!combinedError}
                                className={`btn-submit ${isSubmitHovered ? 'hovered' : ''}`}
                                onMouseEnter={() => setIsSubmitHovered(true)}
                                onMouseLeave={() => setIsSubmitHovered(false)}
                            >
                                {loading ? "Đang thêm..." : "Thêm"}
                            </button>
                        </div>
                    </form>
                    {loading && <Loader />}
                </div>
            </Box>
        </Modal>
    );
};

export default AddUserModal;