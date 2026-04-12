import "./checkout.css";
import HomeIcon from '@mui/icons-material/Home';
import UTurnRightIcon from '@mui/icons-material/UTurnRight';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import {useContext, useEffect, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {CartContext} from "../../context/CartContext";
import {UserContext} from "../../context/UserContext";
import Loader from "../../components/Loader";
import {CheckoutContext} from "../../context/CheckoutContext";

export default function Checkout() {
    const { cartItems, fetchCartItems, totalPrice, categoryNames} = useContext(CartContext);
    const { user, userInfo, isLoading  } = useContext(UserContext);
    const { deliveryMethods, isLoadingDeliveryMethods, handlePlaceOrder, createVnpayPayment, paymentMethods  } = useContext(CheckoutContext);

    const [selectedMethodDelivery, setSelectedMethodDeliverty] = useState();
    const [selectedPayment, setSelectedPayment] = useState();
    const [showPopup, setShowPopup] = useState(false);
    const [deliveryName, setDeliveryName] = useState(userInfo?.fullname || "");
    const [deliveryEmail, setDeliveryEmail] = useState(userInfo?.email || "");
    const [deliveryPhone, setDeliveryPhone] = useState(userInfo?.phone || "");
    const [deliveryAddress, setDeliveryAddress] = useState(userInfo?.address || "");
    const [showQR, setShowQR] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.id) {
            fetchCartItems(user.id);
        }
    }, [user]);
    useEffect(() => {
        if (userInfo) {
            setDeliveryName(userInfo.fullname || "");
            setDeliveryEmail(userInfo.email || "");
            setDeliveryPhone(userInfo.phone || "");
            setDeliveryAddress(userInfo.address || "");
        }
    }, [userInfo]);

    const openPopup = () => setShowPopup(true);
    const handleChangeMethopDelivery = (e) => {
        setSelectedMethodDeliverty(e.target.value);
    };
    const getShippingFee = () => {
        const selected = deliveryMethods.find(
            (method) => method._id === selectedMethodDelivery
        );
        return selected ? selected.price : 0;
    };

    if (isLoading || !userInfo || !cartItems || isLoadingDeliveryMethods) {
        return <Loader/>;
    }
    const handlePaymentChange = (e) => {
        setSelectedPayment(e.target.value);
    };
    const vnpayMethod = paymentMethods.find(method => method.type_Payment === "VNPAY");
    const onPlaceOrderClick = async () => {
        const totalAmount = totalPrice + getShippingFee();

        const orderData = {
            id_payment_method: selectedPayment,
            id_delivery_method: selectedMethodDelivery,
            fullname: deliveryName,
            address: deliveryAddress,
            email: deliveryEmail,
            phone: deliveryPhone,

        };
        if (vnpayMethod && selectedPayment === vnpayMethod._id) {
            localStorage.setItem("pendingOrder", JSON.stringify(orderData));
            const content = `Thanh toán đơn hàng ${totalAmount} VND`;
            const responseData = await createVnpayPayment(totalAmount, content);
            if (responseData && responseData.paymentUrl) {
                window.location.href = responseData.paymentUrl;
            }
        } else {
            const success = await handlePlaceOrder(orderData);
            if (success) {
                navigate("/OrderSuccess");
            }else navigate("/FailedOrder")
        }
    };


    return (
        <div className="container-xl">
            <h1 className="checkout__title">Thanh toán</h1>
            <div className="checkout__container row">

                <div className="checkout__info--left col">
                    <div className="delivery__info--container">
                        <div className="box__flex__title">
                            <HomeIcon className="icon__home__h2" fontSize="small"/>
                            <h2 className="checkout__subtitle">Thông tin giao hàng</h2>
                        </div>
                        <form id="delivery__info--form">
                            <div id="default__info" className="delivery__info">
                                <input type="hidden" name="deliveryInfoKey" value="defaultDeliveryInfo"
                                       data-customer-name="Nguyễn Văn A"
                                       data-customer-email="vana@example.com"
                                       data-customer-phone="0912345678"
                                       data-customer-address="123 Đường ABC, Quận 1, TP.HCM"/>
                                <div className="info__header">
                                    <h3>Giao tới </h3>
                                    <KeyboardDoubleArrowDownIcon className="icon__Keydown_title" fontSize="small"/>
                                    <span className="edit__delivery" onClick={openPopup}>Chỉnh sửa</span>
                                </div>
                                <ul className="info__items">
                                    <li className="info__item customer__name">{deliveryName}
                                        <span className="default__tag">Mặc định</span>
                                    </li>
                                    <li className="info__item">Email: {deliveryEmail}</li>
                                    <li className="info__item">Số điện thoại: {deliveryPhone}</li>
                                    <li className="info__item">Địa chỉ: {deliveryAddress}</li>
                                </ul>

                                <div className="choice__remove">
                                    <button type="button" className="button__choice" name="typeEdit"
                                            value="choiceDeliveryInfo">Đã chọn
                                    </button>
                                </div>
                            </div>
                        </form>

                        {showPopup && (
                            <div className="popup__bg">
                                <div className="popup__form">
                                    <div className="form__header">
                                        <h2 className="form__title">Chỉnh sửa thông tin giao hàng</h2>
                                        <CloseIcon fontSize="small" className="button__close"
                                                   onClick={() => setShowPopup(false)}/>
                                    </div>
                                    <form id="customize__info--form" className="box__sizing" onSubmit={(e) => {
                                        e.preventDefault();
                                        const form = e.target;
                                        const fullName = form.fullName.value;
                                        const email = form.email.value;
                                        const phone = form.phone.value;
                                        const address = form.address.value;

                                        setDeliveryName(fullName);
                                        setDeliveryEmail(email);
                                        setDeliveryPhone(phone);
                                        setDeliveryAddress(address);

                                        setShowPopup(false);
                                    }}
                                    >
                                        <input type="hidden" name="deliveryInfoTarget"/>
                                        <div className="customize__item">
                                            <label htmlFor="fullName">
                                                Họ và tên <span className="compulsory">*</span>
                                            </label>
                                            <input type="text" className="input__content field__content box__sizing"
                                                   id="fullName" name="fullName" placeholder="Họ và tên của bạn"
                                                   defaultValue={deliveryName}/>
                                            <span id="fullNameError" className="error__notice"></span>
                                        </div>
                                        <div className="customize__item">
                                            <label htmlFor="email">
                                                Email <span className="compulsory">*</span>
                                            </label>
                                            <input type="text" id="email"
                                                   className="input__content field__content box__sizing" name="email"
                                                   placeholder="Email của bạn" defaultValue={deliveryEmail}/>
                                            <span id="emailError" className="error__notice"></span>
                                        </div>
                                        <div className="customize__item">
                                            <label htmlFor="phone">
                                                Số điện thoại <span className="compulsory">*</span>
                                            </label>
                                            <input type="text" id="phone"
                                                   className="input__content field__content box__sizing"
                                                   placeholder="Số điện thoại của bạn" defaultValue={deliveryPhone}/>
                                            <span id="phoneError" className="error__notice"></span>
                                        </div>
                                        <div className="customize__item">
                                            <label htmlFor="address">
                                                Địa chỉ <span className="compulsory">*</span>
                                            </label>
                                            <textarea className="mapad__0" id="address" name="address" rows="6"
                                                      placeholder="Địa chỉ của bạn"
                                                      defaultValue={deliveryAddress}></textarea>
                                            <span id="addressError" className="error__notice"></span>
                                        </div>
                                        <div className="button__forward">
                                            <button type="button" className="button__cancel"
                                                    onClick={() => setShowPopup(false)}>
                                                Hủy bỏ
                                            </button>
                                            <button type="submit" className="button__custom">
                                                Lưu
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}


                        <div className="delivery__method--container">
                            <div className="box__flex__title box__title">
                                <LocalShippingIcon className="icon__home__h2" fontSize="small"/>
                                <h2 className="checkout__subtitle">Phương thức vận chuyển</h2>
                            </div>
                            <form id="delivery__method--form" className="radio__section">
                                <input type="hidden" name="action" value="choiceDeliveryMethod"/>
                                {deliveryMethods.map((method) => (
                                    <div key={method._id} className="method__content">
                                        <div
                                            className={"method__item section__info--selection" + (selectedMethodDelivery === method._id ? " method__checked" : "")}>
                                            <input type="radio" name="delivery__method" className="radio__button"
                                                   value={method._id} id={`delivery__method${method._id}`}
                                                   checked={selectedMethodDelivery === method._id}
                                                   onChange={handleChangeMethopDelivery}/>
                                            <label className="label__selection"
                                                   htmlFor={`delivery__method${method._id}`}>
                                                <span>Giao hàng {method.name}</span>
                                                <span>{method.price.toLocaleString()} ₫</span>
                                            </label>
                                        </div>
                                        {selectedMethodDelivery === method._id && (
                                            <span className="description__method">
                                                <p>{method.description}</p>
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </form>
                        </div>


                        <div className="payment__method--container">
                            <div className="box__flex__title">
                                <CreditCardIcon className="icon__home__h2" fontSize="small"/>
                                <h2 className="checkout__subtitle">Phương thức thanh toán</h2>
                            </div>
                            <form id="payment__method--form" className="radio__section">
                                <input type="hidden" name="action" value="choicePaymentMethod"/>
                                {paymentMethods.map((method) => (
                                    <div className="method__content">
                                        <div
                                            className={"method__item section__info--selection" + (selectedPayment === method._id ? " method__checked" : "")}>
                                            <input type="radio" name="payment__method" className="radio__button"
                                                   id="payment__method1" value={method._id} checked={selectedPayment === method._id}
                                                   onChange={handlePaymentChange}/>
                                            <label className="lable__payment__title" htmlFor="payment__method1">
                                                Thanh Toan bang {method.type_Payment}
                                            </label>
                                        </div>
                                    </div>
                                ))}

                                {/* COD */}
                                {/*<div className="method__content">*/}
                                {/*    <div*/}
                                {/*        className={"method__item section__info--selection" + (selectedPayment === "1" ? " method__checked" : "")}>*/}
                                {/*        <input type="radio" name="payment__method" className="radio__button"*/}
                                {/*               id="payment__method1" value="1" checked={selectedPayment === "1"}*/}
                                {/*               onChange={handlePaymentChange}/>*/}
                                {/*        <label className="lable__payment__title" htmlFor="payment__method1">*/}
                                {/*            Thanh toán khi nhận hàng (COD)*/}
                                {/*        </label>*/}
                                {/*    </div>*/}
                                {/*</div>*/}

                                {/*<div className="method__content">*/}
                                {/*    <div*/}
                                {/*        className={"method__item section__info--selection" + (selectedPayment === "3" ? " method__checked" : "")}>*/}
                                {/*        <input type="radio" name="payment__method" className="radio__button"*/}
                                {/*               id="payment__method3" value="3" checked={selectedPayment === "3"}*/}
                                {/*               onChange={handlePaymentChange}/>*/}
                                {/*        <label className="lable__payment__title" htmlFor="payment__method3">*/}
                                {/*            Thanh toán VNPAY*/}
                                {/*        </label>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </form>
                        </div>
                    </div>
                </div>
                <div className="checkout__info--right col">
                    <p className="summary__cart">Tóm tắt giỏ hàng</p>
                    <div className="order__detail--info">
                        <table className="order__table">
                            <thead>
                            <tr className="row__header">
                                <th className="thead__item">Sản phẩm</th>
                                <th className="thead__item">Giá tiền</th>
                                <th className="thead__item">Số lượng</th>
                                <th className="thead__item">Thành tiền</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cartItems.map((item) => (
                                <tr className="row__content" key={item.id}>
                                    <td className="td__item">
                                        <div className="product__item">
                                            <img
                                                src={
                                                    item.id_product.image?.startsWith("http")
                                                        ? item.id_product.image
                                                        : `http://localhost:8080/uploads/${item.id_product.image || "assets/stonesjewel.jpg"}`
                                                }
                                                alt="Ảnh sản phẩm"
                                            />

                                            <div className="order__product--info">
                                                <p className="product__name">{item.id_product.name}</p>
                                                <p className="order__color">Loại: {categoryNames[item.id_product.id_category] || "Không xác định"}</p>
                                                <p className="order__size">Mô tả: {item.id_product.description || ""}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="td__item">{item.id_product.price.toLocaleString()}đ</td>
                                    <td className="td__item">{item.id_product.quantity}</td>
                                    <td className="td__item"> {(item.id_product.price * item.quantity).toLocaleString()}đ</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="invoice--final">
                        <div className="invoice__content">
                            <div className="price__item--detail">
                                <div className="temporary__container">
                                    <span>Tạm tính ({cartItems.length} sản phẩm)</span>
                                    <span>{(totalPrice ?? 0).toLocaleString()}đ</span>
                                </div>
                                <div className="shipping__container">
                                    <span>Phí vận chuyển</span>
                                    <span>{getShippingFee().toLocaleString()}đ</span>
                                </div>
                            </div>
                            <div className="total__price--final">
                                <span className="total__label">Tổng tiền</span>
                                <span
                                    className="total__value">{(totalPrice + getShippingFee()).toLocaleString()}đ</span>
                            </div>
                        </div>
                        <div className="ground__button--forward">
                            <button className="place__order" onClick={onPlaceOrderClick}>Đặt hàng</button>
                            <NavLink to="/Cart">
                                <button className="back--shopping__cart">Quay lại giỏ hàng</button>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
            {/*{showQR && (*/}
            {/*    <div className="box__QR" >*/}
            {/*        <div className="QRCode">*/}
            {/*            <div className="QRCode__header">*/}
            {/*                <h3 className="QR__Title">Quét mã QR để thanh toán</h3>*/}
            {/*                <CloseIcon className="btn__close__QRCode" onClick={() => setShowQR(false)} fontSize="small"/>*/}
            {/*            </div>*/}
            {/*            <img src={`https://img.vietqr.io/image/BIDV-3149041395-compact.png?amount=${totalPrice + getShippingFee()}&addInfo=${btoa(`${totalPrice + getShippingFee()} VND`)}`} alt="QR Code" style={{width: "300px", margin: "20px 0"}}/>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
}
