import "./orderSuccess.css";
import {useContext, useEffect, useRef, useState} from "react";
import {NavLink, useNavigate, useSearchParams} from "react-router-dom";
import { FaCheckCircle, FaShoppingCart } from "react-icons/fa";
import {CheckoutContext} from "../../context/CheckoutContext";
import {showErrorDialog} from "../../utils/Alert";
import Swal from "sweetalert2";


export default function OrderSuccess() {
    const [seconds, setSeconds] = useState(10);
    const navigate = useNavigate();

    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         setSeconds((prev) => {
    //             if (prev <= 1) {
    //                 clearInterval(timer);
    //                 navigate("/");
    //             }
    //             return prev - 1;
    //         });
    //     }, 1000);
    //
    //     return () => clearInterval(timer);
    // }, [navigate]);

    return (
        <div className="payment-success-container">
            <div className="success-animation">
                <FaShoppingCart className="cart-icon"/>
                <FaCheckCircle className="checkmark-icon"/>
            </div>
            <h2 className="success-text">ĐẶT HÀNG THÀNH CÔNG</h2>
            <p>
                Cảm ơn quý khách đã mua sắm tại{" "}
                <strong className="brand-name">Aurora Veneris</strong>
            </p>
            <p className="next-step">
                Để kiểm tra chi tiết đơn hàng vui lòng chọn "Chi tiết đơn hàng". Để khám phá thêm sản phẩm, chọn "Tiếp
                tục mua sắm".
            </p>

            <div className="order-info">
                <i className="fa-solid fa-circle-check"
                   style={{color: "#4CAF50", fontSize: "24px", marginBottom: "8px"}}></i>
                <p style={{fontWeight: "500"}}>
                    Đơn hàng của bạn đã được ghi nhận và đang trong quá trình xử lý. Cảm ơn quý khách đã tin tưởng!
                </p>
            </div>
            <div className="action-buttons">
                <NavLink to="/PurchaseHistory" className="btn btn-detail">Chi tiết đơn hàng</NavLink>
                <NavLink to="/Shop" className="btn btn-continue">Tiếp tục mua hàng</NavLink>
            </div>

            {/*<p className="auto-redirect">*/}
            {/*    Website sẽ tự động quay về trang chủ sau{" "}*/}
            {/*    <span className="countdown">{seconds}</span> giây*/}
            {/*</p>*/}
        </div>
    );
}