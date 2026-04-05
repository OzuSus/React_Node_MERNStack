import "./changePassWord.css";
import {NavLink} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {ChangePasswordContext} from "../../context/ChangePasswordContext";
import {UserContext} from "../../context/UserContext";

export default function ChangePassWord() {
    const {user} = useContext(UserContext);
    const {
        handleChangePassword,
        validatePassword,
        changeStatus,
        setChangeStatus,
    } = useContext(ChangePasswordContext);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordErrors, setNewPasswordErrors] = useState([]);
    const [confirmPassword, setConfirmPassword] = useState("");

    // Lắng nghe sự thay đổi của changeStatus và reset form khi thành công
    useEffect(() => {
        if (changeStatus === "success") {
            setChangeStatus(null); // Reset trạng thái sau khi thành công
            setOldPassword("");
            setNewPassword("");
            setNewPasswordErrors([]);
            setConfirmPassword("");
        }
    }, [changeStatus]); // Chỉ thực hiện khi changeStatus thay đổi

    const handleOldPasswordChange = (e) => {
        const value = e.target.value;
        setOldPassword(value);
    };

    // Hàm xử lý khi người dùng nhập mật khẩu mới
    const handleNewPasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value); // Cập nhật mật khẩu mới vào state
    };

    useEffect(() => {
        const checkPassword = async () => {
            if (newPassword.trim().length > 0) {
                const result = await validatePassword(newPassword);
                setNewPasswordErrors(result.errors);
            } else {
                setNewPasswordErrors([]);
            }
        };
        checkPassword();
    }, [newPassword]);

    // Hàm xử lý khi người dùng nhập xác nhận mật khẩu mới
    const handleConfirmPassword = (e) => {
        const value = e.target.value;
        setConfirmPassword(value); // Cập nhật giá trị mật khẩu xác nhận
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // chưa nhập input số 2 thì ko cần gửi
        if (newPassword.trim().length === 0)
            return;
        // input số 2 sai
        if (newPasswordErrors.length > 0) {
            return;
        }
        // input số 3 sai
        if (newPassword !== confirmPassword) {
            return;
        }
        await handleChangePassword(user.id, oldPassword, newPassword);
    };

    return (
        <div className="container-xl container-xl-profile">
            <div className="row_Profile">
                <div className="col-3">
                    <div className="service__list">
                        <NavLink to={"/Profile"} className="service__item">Tài khoản</NavLink>
                        <a className="service__item service__item--clicked">Đổi mật khẩu</a>
                        <a className="service__item" href="PurchaseHistory">Lịch sử mua hàng</a>
                    </div>
                </div>
                <div className="col-9 col_9_profile">
                    <section className="service__section service__section--show">
                        <form onSubmit={handleSubmit}>
                            <h1 className="title title_profile">Đổi mật khẩu</h1>

                            <div className="form contains">
                                <div className="info__oldPass info-compo">
                                    <label className="lable__oldPass lable-compo" for="oldPassword">Mật khẩu
                                        cũ</label>
                                    <div className="input__form">
                                        <input className="input__oldPass input-compo" type="password"
                                               id="oldPassword"
                                               name="oldPassword" onChange={handleOldPasswordChange}
                                               value={oldPassword}/>
                                        <i className="icon__eye icon__eye--close fa-regular fa-eye-slash"></i>
                                        <i className="icon__eye icon__eye--open fa-regular fa-eye"></i>
                                    </div>
                                    <p className="form__error"
                                       style={{display: changeStatus === "error" ? "block" : "none"}}
                                       id="errorOldPass">Sai mật khẩu cũ</p>
                                </div>

                                <div className="info__newPass info-compo">
                                    <label className="lable__newPass lable-compo" for="password">Mật khẩu
                                        mới</label>
                                    <div className="input__form">
                                        <input type="password" id="password" name="newPassword"
                                               className="input__newPass input-compo"
                                               onChange={handleNewPasswordChange}
                                               value={newPassword}/>
                                        <i className="icon__eye icon__eye--close fa-regular fa-eye-slash"></i>
                                        <i className="icon__eye icon__eye--open fa-regular fa-eye"></i>
                                    </div>
                                    <p className="form__error"
                                       style={{display: newPasswordErrors.length > 0 ? "block" : "none"}}
                                       id="errorNewPass">{newPasswordErrors.length > 0 ? newPasswordErrors[0] : "Mật khẩu hợp lệ"}</p>
                                </div>

                                <div className="info__newPass--confirm info-compo">
                                    <label className="lable__newPass--confirm lable-compo" for="confirm-password">Nhập
                                        lại mật khẩu mới</label>
                                    <div className="input__form">
                                        <input type="password" id="confirm-password" name="confirmPassword"
                                               className="input__newPass--confirm input-compo"
                                               onChange={handleConfirmPassword}
                                               value={confirmPassword}/>
                                        <i className="icon__eye icon__eye--close fa-regular fa-eye-slash"></i>
                                        <i className="icon__eye icon__eye--open fa-regular fa-eye"></i>
                                    </div>
                                    <p className="form__error"
                                       style={{display: confirmPassword.trim().length > 0 && newPassword !== confirmPassword ? "block" : "none"}}
                                       id="errorConfirmPass">Nhập lại mật khẩu mới không khớp</p>
                                </div>

                                <div className="save save__changePass">
                                    <button id="form__submit" type="submit"
                                            className="form__submit button button--hover">Lưu thay đổi
                                    </button>
                                </div>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}
