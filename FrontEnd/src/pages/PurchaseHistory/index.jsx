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
            // Người dùng bấm OK
            // console.log("Xác nhận OK");
        } else {
            // Người dùng bấm Hủy hoặc đóng popup
            // console.log("Đã hủy");
            return;
        }

        try {
            await cancelOrder(orderId, userId);  // gọi và chờ axios xong
            await showSuccessDialog("Thành công", "Đơn hàng đã được hủy.");
            // Gọi lại fetch order hoặc cập nhật UI ở đây
            handleStatusChange(selectedStatus); // ví dụ gọi lại hàm fetch lọc đơn theo trạng thái hiện tại
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
                            <Loader/>
                        ) : error ? (
                            <div className="error-message">Đã xảy ra lỗi khi tải dữ liệu</div>
                        ) : orders.length === 0 ? (
                            <div className="block__product">
                                <div className="block__product--history">
                                    <div className="imgNoneProduct"></div>
                                    <h2>Chưa có đơn hàng</h2>
                                </div>
                            </div>
                        ) : (
                            orders.map(order => (
                                <div key={order.idOrder} className="service__order service__order--show">
                                    {/* Order header */}
                                    <div className="order__info">
                                        <div className="order__row">
                                            <p><strong>Mã đơn hàng:</strong> #{order.idOrder}</p>
                                            <p><strong>Ngày đặt:</strong> {formatDate(order.dateOrder)}</p>
                                            <p><strong>Trạng thái:</strong>
                                                {order.status ? (
                                                    <span className={`status-badge status-${order.status.id}`}>
                                                        {order.status.name}
                                                    </span>
                                                ) : (
                                                    <span className="status-badge">Không xác định</span>
                                                )}
                                            </p>
                                        </div>
                                        <div className="order__row">
                                            <p><strong>Thanh toán:</strong> {order.paymentMethod?.type_payment || "N/A"}
                                            </p>
                                            <p><strong>Vận
                                                chuyển:</strong>{" "}{order.deliveryMethop ? `${order.deliveryMethop.name} (${formatPrice(order.deliveryMethop.price)})` : "N/A"}
                                            </p>
                                            <p><strong>Tổng tiền:</strong> {formatPrice(order.totalPrice)}</p>
                                        </div>
                                        <div className="order__row">
                                            <p><strong>Họ tên:</strong> {order.fullname}</p>
                                            <p><strong>SĐT:</strong> {order.phone}</p>
                                            <p><strong>Địa chỉ:</strong> {order.address}</p>
                                        </div>

                                        {order.status?.id === 5 && ( // 5 là id chưa xác nhận
                                            <button
                                                className="btn__cancel-order"
                                                onClick={() => handleCancelClick(order.idOrder, user.id)}
                                            >
                                                Hủy đơn hàng
                                            </button>
                                        )}
                                    </div>

                                    {/* Order details */}
                                    {order.orderDetails?.map((detail, idx) => {
                                        const product = detail.product || {};
                                        return (
                                            <div key={`${order.idOrder}-${idx}`} className="block__product">
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
                                                        Phân
                                                        loại: {categoryMap[detail.product.categoryID] || "Không rõ"}
                                                    </p>
                                                    <p className="info__product">
                                                        Số lượng: {detail.quantity || "N/A"}
                                                    </p>
                                                    <p className="info__product">
                                                        Giá: {formatPrice(detail.price || product.price)}
                                                    </p>
                                                </div>
                                                {order.status?.id === 8 && (
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