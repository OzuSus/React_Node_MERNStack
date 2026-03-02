import {NavLink, useNavigate} from "react-router-dom";

import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import {useContext, useEffect, useState} from "react";
import Swal from "sweetalert2";
import {showLoginRequiredDialog} from "../utils/Alert";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import Loader from "./Loader";
import {CategoryContext} from "../context/CategoryContext.jsx";
import {UserContext} from "../context/UserContext.jsx";


export default function ProductCard({item}) {
    const {
        id,
        name = "",
        price,
        quantity,
        image = "",
        description,
        reviewCount,
        rating,
        categoryID,
        tag
    } = item || {};

    const [isFavorite, setIsFavorite] = useState(false);
    const [categoryName, setCategoryName] = useState("");


    const { categoryMap } = useContext(CategoryContext);
    const { user } = useContext(UserContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (categoryMap && categoryID) {
            setCategoryName(categoryMap[categoryID] || "N/A");
        }
    }, [categoryMap, categoryID]);


    return (
        <div className="ProductCard">
            <NavLink to={`/products/${id}`}>
                <div>
                    <img src={image.startsWith("https://") ? image : "http://localhost:8080/uploads/" + image} alt={`${name} - `}/>
                    <div className="cardTextContent">
                        <h3 className="name__product">{name || "Sản Phẩm Trang Sức"}</h3>
                        <p className="price">
                            <b> {categoryName}</b>
                            <b> {price.toLocaleString()}đ</b>
                        </p>
                        <div className="rating">
                            {[...Array(5)].map((_, index) => {
                                const starValue = index + 1;
                                if (rating >= starValue) {
                                    return <StarIcon key={index} style={{color: "#ffd430"}}/>;
                                } else if (rating >= starValue - 0.5) {
                                    return <StarHalfIcon key={index} style={{color: "#ffd430"}}/>;
                                } else {
                                    return <StarBorderIcon key={index} style={{color: "#ffd430"}}/>;
                                }
                            })}
                        </div>
                    </div>
                    {tag && (
                        <span title={tag} className="trendingIcon">
                    <div className="ribbon ribbon-top-left">
                        <span>{tag}</span>
                    </div>
                </span>
                    )}
                </div>
            </NavLink>
            <div className="button">
                <div className="favorite" title={isFavorite ? "Remove from WishList" : "Add to WishList"}>
                    {isFavorite ? <FavoriteRoundedIcon/> : <FavoriteTwoToneIcon/>}
                </div>
            </div>

            <div className="buttons">
                <div className="addToCartButton" title="Add to Cart" >
                    <AddShoppingCartIcon/>
                </div>
            </div>

                <button >Thêm vào giỏ hàng</button>
        </div>

    );
}