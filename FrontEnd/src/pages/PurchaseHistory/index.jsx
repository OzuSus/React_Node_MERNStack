import "./purchaseHistory.css";
import Loader from "../../components/Loader";
import {useContext, useEffect} from "react";

import {PurchaseHistoryContext} from "../../context/PurchaseHistoryContext";
import {CategoryContext} from "../../context/CategoryContext";
import {NavLink, useNavigate} from "react-router-dom";
import {showConfirmDialog, showErrorDialog, showSuccessDialog} from "../../utils/Alert";
import {UserContext} from "../../context/UserContext";

export default function PurchaseHistory() {
    const {
        orders,
        allStatuses,
        loading,
        error,
        handleStatusChange,
        selectedStatus,
        formatDate,
        formatPrice,
        cleanImageUrl,
        cancelOrder,
        fetchAllStatuses,
        fetchAllOrders,
    } = useContext(PurchaseHistoryContext);
    const {categoryMap} = useContext(CategoryContext);
    const {user,isLoading} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading) return;

        if (!user) {
            navigate("/Home");
            return;
        }

        fetchAllStatuses();
        fetchAllOrders(user?._id);
    }, [user, isLoading]);
    const handleReviewClick = (productId) => {
        navigate(`/Products/${productId}`);
    };

    const handleCancelClick = async (orderId, userId) => {
        const result = await showConfirmDialog("Bạn có muốn hủy đơn hàng này không?", "warning");
        if (result.isConfirmed) {
        } else {
            return;
        }

        try {
            await cancelOrder(orderId, userId);
            await showSuccessDialog("Thành công", "Đơn hàng đã được hủy.");
            handleStatusChange(selectedStatus);
        } catch (error) {
            await showErrorDialog("Lỗi", "Không thể hủy đơn hàng.");
        }
    };

    return (
        <div className="container-xl container-xl-profile">
            <div className="row_Profile">
                <div className="col-3">
                    <div className="service__list">
                        <NavLink to="/Profile" className="service__item" href="Profile">Tài khoản</NavLink>
                        <NavLink to="/ChangePassword" className="service__item" href="ChangePassword">Đổi mật
                            khẩu</NavLink>
                        <a className="service__item service__item--clicked" href="#">Lịch sử mua hàng</a>
                    </div>
                </div>
                <div className="col-9 col_9_profile">
                    <section className="service__section service__section--show">
                        <h1 className="title title_profile">Lịch sử mua hàng</h1>

                        {/* Filter by status */}
                        <div className="statusOrder">
                            <button
                                className={`status__list ${selectedStatus === null ? 'status__list--click' : ''}`}
                                onClick={() => handleStatusChange(null)}
                            >
                                Tất cả
                            </button>

                            {allStatuses.map(status => (
                                <button
                                    key={status._id} // Đổi thành _id
                                    className={`status__list ${selectedStatus === status._id ? 'status__list--click' : ''}`} // Đổi thành _id
                                    onClick={() => handleStatusChange(status._id)} // Đổi thành _id
                                >
                                    {status.name}
                                </button>
                            ))}
                        </div>

                        {/* Order list */}
                        {loading ? (
                            <Loader />
                        ) : error ? (
                            <div className="error-message">Đã xảy ra lỗi khi tải dữ liệu</div>
                        ) : (Array.isArray(orders) && orders.length === 0) ? (
                            <div className="block__product">
                                <div className="block__product--history">
                                    <div className="imgNoneProduct"></div>
                                    <h2>Chưa có đơn hàng</h2>
                                </div>
                            </div>
                        ) : (
                            (Array.isArray(orders) ? orders : []).map(order => (
                                <div key={order._id} className="service__order service__order--show">
                                    {/* Order header */}
                                    <div className="order__info">
                                        <div className="order__row">
                                            {/*<p><strong>Mã đơn hàng:</strong> #{order._id}</p>*/}
                                            <p><strong>Ngày đặt:</strong> {formatDate(order.date_order)}</p>
                                            <p><strong>Trạng thái:</strong>
                                                {order.status_order ? (
                                                    <span className={`status-badge status-${order.status_order.name}`}>
                                                        {order.status_order.name}
                                                    </span>
                                                ) : (
                                                    <span className="status-badge">Không xác định</span>
                                                )}
                                            </p>
                                        </div>
                                        <div className="order__row">
                                            <p><strong>Thanh toán:</strong> {order.id_payment_method.type_Payment || "N/A"}</p>
                                            <p><strong>Vận chuyển:</strong>{" "}{order.id_delivery_method ? `${order.id_delivery_method.name} (${formatPrice(order.id_delivery_method.price)})` : "N/A"}</p>
                                            <p><strong>Tổng tiền:</strong> {formatPrice(order.total_price)}</p>
                                        </div>
                                        <div className="order__row">
                                            <p><strong>Họ tên:</strong> {order.fullname}</p>
                                            <p><strong>SĐT:</strong> {order.phone}</p>
                                            <p><strong>Địa chỉ:</strong> {order.address}</p>
                                        </div>

                                        {order.status?.id === 5 && (
                                            <button
                                                className="btn__cancel-order"
                                                onClick={() => handleCancelClick(order.idOrder, user.id)}
                                            >
                                                Hủy đơn hàng
                                            </button>
                                        )}
                                    </div>

                                    {order.orderDetails?.map((detail, idx) => {
                                        const product = detail.id_product || {};
                                        return (
                                            <div key={`${order._id}-${idx}`} className="block__product">
                                                <img
                                                    className="img__product block__img"
                                                    src={
                                                        product.image?.startsWith("http")
                                                            ? product.image
                                                            : `http://localhost:8080/uploads/${product.image}`
                                                    }
                                                    alt={product.name || "Sản phẩm"}
                                                    onError={(e) => e.target.src = "/assets/jewelry.png"}
                                                />

                                                <div className="block__info info__detali">
                                                    <p className="info__product info__product--name info__detali__name">
                                                        {product.name || "Không có tên sản phẩm"}
                                                    </p>
                                                    <p className="info__product">
                                                        Phân loại: {detail.id_category?.name || "Không rõ"}
                                                    </p>
                                                    <p className="info__product">
                                                        Số lượng: {detail.quantity || "N/A"}
                                                    </p>
                                                    <p className="info__product">
                                                        Giá: {formatPrice(detail.id_product.price || product.price)}
                                                    </p>
                                                </div>
                                                {order.status_order?._id === 8 && (
                                                    <button className="btn__review btn"
                                                            onClick={() => handleReviewClick(detail.product.id)}>Đánh
                                                        giá</button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}