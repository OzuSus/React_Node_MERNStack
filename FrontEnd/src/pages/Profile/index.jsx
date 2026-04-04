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
    const {user,isLoading} = useContext(UserContext);
    const {
        fetchUserInfo,
        userInfo,
        handleChangeAvatar,
        handleChangeProfile,
        changeStatus,
        setChangeStatus,
        isUploading
    } = useContext(ProfileContext);
    if (isLoading) {
        return <Loader/>;
    }
    useEffect(() => {
        console.log("user:", user);
        console.log("userInfo:", userInfo);

        if (user?._id) {
            fetchUserInfo(user._id);
        }
    }, [user?.id]);

    // useEffect(() => {
    //     if (changeStatus === "success") {
    //         setChangeStatus(null);
    //     }
    // }, [changeStatus]);


    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [fullname, setFullname] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [avatar, setAvatar] = useState("");

    useEffect(() => {
        if (userInfo) {
            setUsername(userInfo?.username || "");
            setEmail(userInfo?.email || "");
            setFullname(userInfo?.fullname || "");
            setPhone(userInfo?.phone || "");
            setAddress(userInfo?.address || "");
            setAvatar(userInfo?.avatar || "");
        }
    }, [userInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleChangeProfile(user.id, username, fullname, address, phone, email);
    };

    return (
        <>
            {isUploading && <Loader />}
            <div className="container-xl container-xl-profile">
                <div className="row_Profile">
                    <div className="col-3">
                        <div className="service__list">
                            <NavLink to={"/Profile"} className="service__item service__item--clicked" href="#">Tài khoản</NavLink>
                            <NavLink to={"/ChangePassWord"} className="service__item" href="ChangePassword">Đổi mật
                                khẩu</NavLink>
                            <NavLink className="service__item" to={"/PurchaseHistory"}>Lịch sử mua hàng</NavLink>
                        </div>
                    </div>
                    <div className="col-9 col_9_profile">
                        <section className="service__section service__section--show">
                            <h1 className="title title_profile">Tài khoản</h1>

                            <div className="user__maininfo block_info">
                                <div className="user__img user">
                                    <div id="avatarContainer">
                                        <img id="photo"
                                             src={userInfo?.avatar ? userInfo.avatar : "/assets/userDefautAvatar.jpg"}
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

                                <form className="form__updateAccount" onSubmit={handleSubmit}
                                      encType="multipart/form-data">
                                    <div className="user__info user">
                                        {/*<input type="hidden" name="userId" value={user.id}/>*/}

                                        <div className="info-compo">
                                            <label htmlFor="Username">Tên người dùng</label>
                                            <input readOnly="true" type="text" id="Username"
                                                   className="input-compo readonly-input" value={username}
                                                   onChange={(e) => setUsername(e.target.value)}/>
                                        </div>

                                        <div className="info-compo">
                                            <label htmlFor="Email">Email</label>
                                            <input readOnly="true" type="email" id="Email"
                                                   className="input-compo readonly-input" value={email}
                                                   onChange={(e) => setEmail(e.target.value)}/>
                                        </div>

                                        <div className="info-compo">
                                            <label htmlFor="FullName">Họ tên</label>
                                            <input type="text" id="FullName" className="input-compo" value={fullname}
                                                   onChange={(e) => setFullname(e.target.value)}/>
                                        </div>

                                        <div className="info-compo">
                                            <label htmlFor="Phone">Số điện thoại</label>
                                            <input type="number" id="Phone" className="input-compo" value={phone}
                                                   onChange={(e) => setPhone(e.target.value)}/>
                                        </div>

                                        <div className="info-compo">
                                            <label htmlFor="Address">Địa chỉ</label>
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
        </>

    );
}
