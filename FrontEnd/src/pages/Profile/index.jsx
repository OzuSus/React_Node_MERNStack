import "./profile.css";
// import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {NavLink} from "react-router-dom";
import {CartContext} from "../../context/CartContext";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../../context/UserContext";
import {ProfileContext} from "../../context/ProfileContext";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";
import CameraAltIcon from '@mui/icons-material/CameraAlt';

export default function Profile() {
    const {fetchUserInfo} = useContext(ProfileContext);
    const {user} = useContext(UserContext);
    const {userInfo} = useContext(ProfileContext);
    const {
        handleChangeAvatar,
        handleChangeProfile,
        handleUploadFile,
        changeStatus,
        setChangeStatus,
    } = useContext(ProfileContext);

    useEffect(() => {
        if (user?.id) {
            fetchUserInfo(user.id);
        }
    }, [user]);

    useEffect(() => {
        if (changeStatus === "success") {
            setChangeStatus(null);
        }
    }, [changeStatus]);


    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [fullname, setFullname] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [avatar, setAvatar] = useState("");

    useEffect(() => {
        if (userInfo) {
            setUsername(userInfo.username || "");
            setEmail(userInfo.email || "");
            setFullname(userInfo.fullname || "");
            setPhone(userInfo.phone || "");
            setAddress(userInfo.address || "");
            setAvatar(userInfo.avatar || "");
        }
    }, [userInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleChangeProfile(user.id, username, fullname, address, phone, email);
    };

    return (
        <div className="container-xl container-xl-profile">
            <div className="row_Profile">
                <div className="col-3">
                    <div className="service__list">
                        <a className="service__item service__item--clicked" href="#">Tài khoản</a>
                        <NavLink to={"/ChangePassWord"} className="service__item" href="ChangePassword">Đổi mật
                            khẩu</NavLink>
                        <a className="service__item" href="PurchaseHistory">Lịch sử mua hàng</a>
                    </div>
                </div>
                <div className="col-9 col_9_profile">
                    <section className="service__section service__section--show">
                        <h1 className="title title_profile">Tài khoản</h1>

                        <div className="user__maininfo block_info">
                            <div className="user__img user">
                                <div id="avatarContainer">
                                    <img id="photo"
                                         src={userInfo?.avatar && userInfo.avatar !== "null" ?"http://localhost:8080/uploads/"+ userInfo.avatar : "/assets/userDefautAvatar.jpg"}
                                         alt="Avatar"/>
                                    <input type="file" id="file" name="userCoverPhoto" accept="image/*"
                                           onChange={(e) => {
                                               const file = e.target.files[0];
                                               if (file) {
                                                   handleChangeAvatar(user.id, file);
                                               }
                                           }}/>
                                    <label htmlFor="file" id="uploadbtn"><CameraAltIcon fontSize="small"/></label>
                                </div>
                            </div>

                            <form classname="form__updateAccount" onSubmit={handleSubmit} enctype="multipart/form-data">
                                <div className="user__info user">
                                    {/*<input type="hidden" name="userId" value={user.id}/>*/}

                                    <div className="info-compo">
                                        <label for="Username">Tên người dùng</label>
                                        <input readOnly="true"  type="text" id="Username" className="input-compo readonly-input" value={username}
                                               onChange={(e) => setUsername(e.target.value)}/>
                                    </div>

                                    <div className="info-compo">
                                        <label for="Email">Email</label>
                                        <input readOnly="true" type="email" id="Email" className="input-compo readonly-input" value={email}
                                               onChange={(e) => setEmail(e.target.value)}/>
                                    </div>

                                    <div className="info-compo">
                                        <label for="FullName">Họ tên</label>
                                        <input type="text" id="FullName" className="input-compo" value={fullname}
                                               onChange={(e) => setFullname(e.target.value)}/>
                                    </div>

                                    <div className="info-compo">
                                        <label for="Phone">Số điện thoại</label>
                                        <input type="number" id="Phone" className="input-compo" value={phone}
                                               onChange={(e) => setPhone(e.target.value)}/>
                                    </div>

                                    <div className="info-compo">
                                        <label for="Address">Địa chỉ</label>
                                        <input type="text" className="input-compo" id="Address" value={address}
                                               onChange={(e) => setAddress(e.target.value)}/>
                                    </div>

                                    <div className="save save__userInfo">
                                        <button type="submit">Lưu thay đổi</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
