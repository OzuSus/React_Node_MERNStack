import "./cart.css";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {NavLink, useNavigate} from "react-router-dom";
// import {CartContext} from "../../context/CartContext";
import {useContext, useEffect} from "react";
import {UserContext} from "../../context/UserContext";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";

export default function Cart() {
    const { cartItems, fetchCartItems, totalPrice, categoryNames, deteleProductInCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);
    const { user, isLoading  } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading) {
            if (user?.id) {
                fetchCartItems(user.id);
            } else {
                navigate("/Home");
            }
        }
    }, [user, isLoading]);

    if (isLoading) {
        return <Loader/>;
    }

    const handleDeleteProductInCart = (productId) => {
        deteleProductInCart(user.id, productId);
    };
    const handleIncrease = (productId) => {
        increaseQuantity(user.id, productId);
    };

    const handleDecrease = (productId, currentQuantity) => {
        decreaseQuantity(user.id, productId, currentQuantity);
    };

    return (
        <div className="container-xl">
            <h1 className="cart__title">Giỏ hàng</h1>
            <div className="cart__container row">
                {cartItems.length === 0 ? (
                    <div className="cart__container--empty">
                        <p>Không có sản phẩm nào trong giỏ hàng của bạn</p>
                        <NavLink to="/Shop">
                            <button>Tiếp tục mua sắm</button>
                        </NavLink>
                        <img src="/assets/continueShopping.svg" alt="Continue Shopping" />
                    </div>
                ):(
                    <>
                        <div className="cart__content col">
                            <form className="shopping__cart--form" action="#" method="post">
                                <table id="cart__table">
                                    <thead className="cart__header">
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Giá tiền</th>
                                        <th>Số lượng</th>
                                        <th>Thành tiền</th>
                                        <th>Xóa</th>
                                    </tr>
                                    </thead>
                                    <tbody className="cart__items">
                                    {cartItems.map((item) => (
                                        <tr className="cart__item" key={item.id}>
                                            <td className="product__item">
                                                <div className="product__content">
                                                    <a className="product__image" href="#">
                                                        <img
                                                            src={
                                                                item.image?.startsWith("http")
                                                                    ? item.image
                                                                    : `http://localhost:8080/uploads/${item.image || "assets/stonesjewel.jpg"}`
                                                            }
                                                            alt="Product"
                                                        />
                                                    </a>

                                                    <div className="order__product--info">
                                                        <a href="#" className="product__name">{item.name}</a>
                                                        <p className="order__color">Loại: {categoryNames[item.categoryID] || "Không xác định"}</p>
                                                        <ul className="order__size--specification">
                                                            <li>Mô tả: {item.description || ""}</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="unit__price">{item.price.toLocaleString()}đ</td>
                                            <td>
                                                <div className="quality__swapper">
                                                    <button type="button" className="minus__quality change__quality" onClick={() => handleDecrease(item.id, item.quantity)}>
                                                        <RemoveIcon fontSize="small"/>
                                                    </button>
                                                    <input readOnly type="number" className="quality__required" min="1" value={item.quantity}/>
                                                    <button type="button" className="plus__quality change__quality" onClick={() => handleIncrease(item.id)}>
                                                        <AddIcon fontSize="small"/>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="subtotal__item">
                                                {(item.price * item.quantity).toLocaleString()}đ
                                            </td>
                                            <td className="remove__action">
                                                <button type="button" className="remove__item"
                                                        onClick={() => handleDeleteProductInCart(item.id)}>
                                                    <DeleteForeverIcon fontSize="small"/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </form>
                        </div>

                        <div className="invoice__promotion col">
                            <div className="summary__invoice">
                                <h2>Tổng đơn hàng</h2>
                                <div className="invoice__detail--info">
                                    <ul className="price__items">
                                        <li className="price__item">
                                            <p className="price__text">
                                                Tạm tính (<span className="total__items">{cartItems.length}</span> sp)
                                            </p>
                                            <p className="price__value">{(totalPrice ?? 0).toLocaleString()}đ</p>
                                        </li>
                                        <li className="price__item">
                                            <p className="price__text">Giảm giá</p>
                                            <p className="price__value">0đ</p>
                                        </li>
                                    </ul>
                                    <div className="price__total">
                                        <p className="price__text">Tổng cộng:</p>
                                        <div className="price__content">
                                            <p className="price__value--final">{(totalPrice ?? 0).toLocaleString()}đ</p>
                                            <p className="price__value--noted">(Đã bao gồm VAT nếu có)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <span>Phí vận chuyển sẽ được tính ở trang thanh toán</span>
                            <div className="group__button--forward">
                                <NavLink to="/Checkout">
                                    <button id="continue--checkout">Tiến hành thanh toán</button>
                                </NavLink>
                                <NavLink to="/Shop">
                                    <button id="continue--shopping">Tiếp tục mua sắm</button>
                                </NavLink>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}
