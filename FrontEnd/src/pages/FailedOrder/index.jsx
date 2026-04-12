import "./FailedOrder.css";
import {useContext, useEffect, useRef, useState} from "react";
import {NavLink, useNavigate, useSearchParams} from "react-router-dom";
import {FaCheckCircle, FaShoppingCart, FaTimesCircle} from "react-icons/fa";
import {CheckoutContext} from "../../context/CheckoutContext";
import {showErrorDialog} from "../../utils/Alert";
import Swal from "sweetalert2";


export default function FailedOrder() {

    const [seconds, setSeconds] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate("/");
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className="payment-success-container">
            <div className="success-animation">
                <FaShoppingCart className="cart-icon" style={{color: "#f45c5c"}}/>
                <FaTimesCircle className="checkmark-icon" style={{background: "#f45c5c"}}/>
            </div>
            <h2 className="success-text" style={{color: "#f45c5c"}}>ĐẶT HÀNG THẤT BẠI</h2>
            <p>
                Rất tiếc! Đơn hàng chưa được tạo do thanh toán không thành công.
            </p>
            <div className="order-info" style={{background: "#ef8150"}}>
                <p style={{fontWeight: "500"}}>
                    Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
                </p>
            </div>
            <div className="action-buttons">
                <NavLink to="/Cart" className="btn btn-detail"
                         style={{background: "#d48f8a", border: "1px solid #d48f8a"}}>Thử lại thanh toán</NavLink>
                <NavLink to="/Shop" className="btn btn-continue"
                         style={{color: "#d48f8a", border: "1px solid #d48f8a"}}>Tiếp tục mua hàng</NavLink>
            </div>
            <p className="auto-redirect">
                Website sẽ tự động quay về trang chủ sau{" "}
                <span className="countdown">{seconds}</span> giây
            </p>
        </div>
    );
}