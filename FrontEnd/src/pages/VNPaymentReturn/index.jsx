import "./VNPaymentReturn.css";
import {useContext, useEffect, useRef, useState} from "react";
import {NavLink, useNavigate, useSearchParams} from "react-router-dom";
import { FaCheckCircle, FaShoppingCart, FaTimesCircle } from "react-icons/fa";
import {CheckoutContext} from "../../context/CheckoutContext";
import {showErrorDialog} from "../../utils/Alert";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";


export default function VNPaymentReturn() {
    const [seconds, setSeconds] = useState(10);
    const [isSuccess, setIsSuccess] = useState(null);

    const { handlePlaceOrder } = useContext(CheckoutContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const hasRunRef = useRef(false);
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");

    useEffect(() => {
        if (hasRunRef.current) return;
        hasRunRef.current = true;

        if (vnp_ResponseCode === "00") {
            const pendingOrder = localStorage.getItem("pendingOrder");
            if (pendingOrder) {
                const parsedOrder = JSON.parse(pendingOrder);
                handlePlaceOrder({
                    ...parsedOrder,
                    navigate: () => {},
                }).then(() => {
                    localStorage.removeItem("pendingOrder");
                    setIsSuccess(true);
                }).catch(() => {
                    Swal.fire("Lỗi", "Không thể tạo đơn hàng.", "error");
                    setIsSuccess(false);
                });
            }
        } else {
            Swal.fire("Thanh toán thất bại", "Đơn hàng chưa được tạo vì thanh toán không thành công.", "error");
            setIsSuccess(false);
        }

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
    }, [vnp_ResponseCode, handlePlaceOrder, navigate]);


    return (
        <div className="payment-success-container">
            {isSuccess === null ? (
                <Loader/>
            ) : isSuccess ? (
                <>
                    <div className="success-animation">
                        <FaShoppingCart className="cart-icon" />
                        <FaCheckCircle className="checkmark-icon" />
                    </div>
                    <h2 className="success-text">ĐẶT HÀNG THÀNH CÔNG</h2>
                    <p>
                        Cảm ơn quý khách đã mua sắm tại{" "}
                        <strong className="brand-name">Aurora Veneris</strong>
                    </p>
                    <p className="next-step">
                        Để kiểm tra chi tiết đơn hàng vui lòng chọn "Chi tiết đơn hàng".
                        Để khám phá thêm sản phẩm, chọn "Tiếp tục mua sắm".
                    </p>
                    <div className="order-info">
                        <i className="fa-solid fa-circle-check"
                           style={{ color: "#4CAF50", fontSize: "24px", marginBottom: "8px" }}></i>
                        <p style={{ fontWeight: "500" }}>
                            Đơn hàng của bạn đã được ghi nhận và đang trong quá trình xử lý. Cảm ơn quý khách đã tin tưởng!
                        </p>
                    </div>
                    <div className="action-buttons">
                        <NavLink to="/PurchaseHistory" className="btn btn-detail">Chi tiết đơn hàng</NavLink>
                        <NavLink to="/Shop" className="btn btn-continue">Tiếp tục mua hàng</NavLink>
                    </div>
                </>
            ) : (
                <>
                    <div className="success-animation">
                        <FaShoppingCart className="cart-icon"  style={{ color: "#f45c5c" }}/>
                        <FaTimesCircle className="checkmark-icon" style={{ background: "#f45c5c" }} />
                    </div>
                    <h2 className="success-text" style={{ color: "#f45c5c" }}>ĐẶT HÀNG THẤT BẠI</h2>
                    <p>
                        Rất tiếc! Đơn hàng chưa được tạo do thanh toán không thành công.
                    </p>
                    <div className="order-info" style={{ background: "#ef8150" }}>
                        <p style={{ fontWeight: "500" }}>
                            Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
                        </p>
                    </div>
                    <div className="action-buttons">
                        <NavLink to="/Cart" className="btn btn-detail" style={{background: "#d48f8a", border: "1px solid #d48f8a"}}>Thử lại thanh toán</NavLink>
                        <NavLink to="/Shop" className="btn btn-continue" style={{color: "#d48f8a", border: "1px solid #d48f8a"}}>Tiếp tục mua hàng</NavLink>
                    </div>
                </>
            )}
            <p className="auto-redirect">
                Website sẽ tự động quay về trang chủ sau{" "}
                <span className="countdown">{seconds}</span> giây
            </p>
        </div>
    );

}