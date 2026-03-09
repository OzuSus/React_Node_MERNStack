import "./favorite.css";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {NavLink, useNavigate} from "react-router-dom";
import {FavoriteContext} from "../../context/FavoriteContext";
import {useContext, useEffect} from "react";
import {UserContext} from "../../context/UserContext";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";

export default function Favorite() {
    const {
        favoriteItems,
        fetchFavoriteItems,
        categoryNames,
        deleteProductInFavorite
    } = useContext(FavoriteContext);
    const {user, isLoading} = useContext(UserContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading) return;

        if (!user) {
            navigate("/Home");
            return;
        }

        fetchFavoriteItems(user.id);

    }, [user, isLoading]);


    if (isLoading) {
        return <Loader/>;
    }

    const handleDeleteProductInFavorite = (productId) => {
        deleteProductInFavorite(user.id, productId);
    };

    return (
        <div className="container-xl">
            <h1 className="cart__title">Sản phẩm yêu thích</h1>
            <div className="cart__container row">
                {favoriteItems.length === 0 ? (
                    <div className="cart__container--empty">
                        <p>Không có sản phẩm nào trong mục yêu thích của bạn</p>
                        <NavLink to="/Shop">
                            <button>Tiếp tục mua sắm</button>
                        </NavLink>
                        <img src="/assets/continueShopping.svg" alt="Continue Shopping"/>
                    </div>
                ) : (
                    <>
                        <div className="cart__content col">
                            <form className="shopping__cart--form" action="#" method="post">
                                <table id="cart__table">
                                    <thead className="cart__header">
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Xóa</th>
                                    </tr>
                                    </thead>
                                    <tbody className="cart__items">
                                    {favoriteItems.map((item) => (
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
                                            <td className="remove__action">
                                                <button type="button" className="remove__item"
                                                        onClick={() => handleDeleteProductInFavorite(item.id)}>
                                                    <DeleteForeverIcon fontSize="small"/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </form>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}

