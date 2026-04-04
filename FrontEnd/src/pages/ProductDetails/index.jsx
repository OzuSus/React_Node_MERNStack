import {useProduct} from "../../context/ProductContext";

import Loader from "../../components/Loader";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";

import "./productDetails.css";
import ProductCard from "../../components/ProductCard";
import {useContext, useEffect, useState} from "react";

import {UserContext} from "../../context/UserContext";
import {showErrorDialog, showLoginRequiredDialog, showSuccessDialog} from "../../utils/Alert";
import {Link, useNavigate} from "react-router-dom";
import {CartContext} from "../../context/CartContext";
import {FavoriteContext} from "../../context/FavoriteContext";


export default function ProductDetails() {
    const {
        product, fetchProduct, categoryName, loading, relatedProducts,
        hasPurchased, reviews, hasReviewed, addReview
    } = useProduct();
    const {user} = useContext(UserContext);
    const { addToCart } = useContext(CartContext);
    const { addToFavorite, isInWishList, deleteProductInFavorite, categoryNames } = useContext(FavoriteContext);

    const [hoverStar, setHoverStar] = useState(0);
    const [selectedStar, setSelectedStar] = useState(0);
    const [comment, setComment] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchIsFavorite = async () => {
            if (user && product?.id) {
                const result = await isInWishList(user.id, product.id);
                setIsFavorite(result);
            }
        };
        fetchIsFavorite();
    }, [user, product?.id, isInWishList]);


    if (loading) {
        return <Loader/>
    }

    if (!product) {
        return (
            <h2 style={{height: "80vh", marginTop: "100px"}}>
                sorry, We could not find that product
            </h2>
        );
    }

    const {
        _id,
        name = "",
        price,
        quantity,
        image = "",
        description,
        reviewCount,
        rating,
        categoryID,
        tag,

    } = product;

    const prevPrice = Math.round(price * 1.15);
    const discount = Math.round((100 - (price / prevPrice) * 100));
    const todate = new Date().toDateString();

    const handleSubmitReview = async () => {
        if (!comment.trim() || selectedStar === 0) {
            await showErrorDialog("Lỗi", "Vui lòng không để trống comment và hãy chọn số sao")
            return;
        }
        try {
            await addReview({
                userId: user.id,
                productId: product.id,
                comment: comment,
                rating: selectedStar
            });
            await showSuccessDialog("Review thành công", "Cảm ơn bạn đã đánh giá sản phẩm");
            await fetchProduct(product.id);
        } catch (err) {
            console.error("Lỗi khi gửi đánh giá", err);
        }
    };

    const handleAddToCart = () => {
        if (!user) {
            showLoginRequiredDialog().then((result) => {
                if (result.isConfirmed) {
                    navigate("/login");
                }
            });
            return;
        }
        addToCart(_id, user.id);
    };
    const handleFavoriteToggle = async () => {
        if (!user) {
            showLoginRequiredDialog().then((result) => {
                if (result.isConfirmed) {
                    navigate("/login");
                }
            });
            return;
        }
        if (isFavorite) {
            await deleteProductInFavorite(user.id, _id);
            setIsFavorite(false);
        } else {
            await addToFavorite(user.id, _id);
            setIsFavorite(true);
        }
    };

    return (
        <div className="productDetailsContainer" key={_id}>
            <div className="detailsContainer">
                <div className="imgcontainer">
                    <img
                        src={image.startsWith("https://") ? image : `http://localhost:8080/uploads/${image}`}
                        alt={name} className="product-image"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://th.bing.com/th/id/R.6bac411a562acdc4144cdcf74963580d?rik=ihrgpCwqShHhHg&pid=ImgRaw&r=0"; // ảnh mặc định
                        }}/>

                    <div className="buttonss">
                        <button onClick={handleAddToCart}>Add to Cart</button>
                        <button onClick={handleFavoriteToggle}>
                            <span className="removeWish">
                                {isFavorite ? (
                                    <>Remove from <FavoriteRoundedIcon/></>
                                ) : (
                                    <>Add to <FavoriteTwoToneIcon/></>
                                )}
                            </span>
                        </button>

                    </div>
                </div>
                <div className="textContentContainer">
                    <h2>{name}</h2>
                    <small>Category: {categoryName}</small>
                    <div className="price">
                        <strong>{price.toLocaleString()}đ{" "}</strong>
                    </div>
                    <div className="highlights">
                        <div>
                            <p className="head"><strong>Highlights: </strong></p>
                            <ul>
                                <li>Rating : {rating} ⭐</li>
                                <li>Total Reviews : {reviewCount}</li>
                            </ul>
                        </div>

                        <div className="description">
                            <p className="head"><strong>Description: </strong></p>
                            <p>{description}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="review-section">
                {!user && (
                    <div className="not-logged-in">
                        <p style={{color: "red"}}>Bạn cần đăng nhập để đánh giá sản phẩm.</p>
                        <Link to="/login">
                            <button>Đăng nhập</button>
                        </Link>
                    </div>
                )}

                {user && !hasPurchased && (
                    <p style={{color: "red"}}>Bạn phải mua sản phẩm thì mới được đánh giá.</p>
                )}

                {user && hasPurchased && !hasReviewed && (
                    <div className="review-form">
                        <h3>Đánh giá sản phẩm</h3>
                        <div className="star-input">
                            {[1, 2, 3, 4, 5].map(star => (
                                <span key={star}
                                      onMouseEnter={() => setHoverStar(star)}
                                      onMouseLeave={() => setHoverStar(0)}
                                      onClick={() => setSelectedStar(star)}
                                      className={star <= (hoverStar || selectedStar) ? "filled" : ""}>
                                    ★{/*⭐*/}
                                </span>
                            ))}
                        </div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Viết đánh giá của bạn..."
                        />
                        <button onClick={handleSubmitReview}>Gửi đánh giá</button>
                    </div>
                )}

                {user && hasPurchased && hasReviewed && (
                    <div className="reviewed-message">
                        <h3 className="title__already__reviewed">Bạn đã đánh giá sản phẩm này</h3>
                        {reviews
                            .filter(r => r.userName === user.username
                            )
                            .map((rev, i) => (
                                <div key={i} className="review-item">
                                    <div key={i} className="review-item">
                                        <small className="review-user">Người dùng: {rev.userName || "Ẩn danh"}</small>
                                        <div className="review-stars">
                                            <span className="numVotes">
                                                {"★".repeat(rev.rating)}</span>
                                            <span className="numVotesRest">
                                                {"★".repeat(5 - rev.rating)}
                                            </span>
                                            <span style={{marginLeft: "10px", fontSize: "0.9em", color: "#555"}}>
                                                {rev.createdAt || "Ngày review"}
                                            </span>
                                        </div>
                                        <div className="review-comment">{rev.comment}</div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}

                <div className="review-list">
                    <h3 className="title__already__reviewed">Nhận xét từ người dùng khác:</h3>
                    {reviews.filter(r => !user || r.userName !== user.username).length === 0 && (
                        <p>Chưa có đánh giá nào.</p>
                    )}
                    {reviews
                        .filter(r => !user || r.userName !== user.username
                        )
                        .map((rev, i) => (
                            <div key={i} className="review-item">
                                <small className="review-user">Người dùng: {rev.userName || "Ẩn danh"}</small>
                                <div className="review-stars">
                                <span className="numVotes">
                                    {"★".repeat(rev.rating)}</span>
                                    <span className="numVotesRest">
                                    {"★".repeat(5 - rev.rating)}
                                </span>
                                    <span style={{marginLeft: "10px", fontSize: "0.9em", color: "#555"}}>
                                    {rev.createdAt || "Ngày review"}
                                </span>
                                </div>
                                <div className="review-comment">{rev.comment}</div>
                            </div>
                        ))}
                </div>
            </div>

            <div className="related-products">
                <h3>Sản phẩm tương tự</h3>
                <div className="related-grid">
                    {relatedProducts.map(item => (
                        <ProductCard key={item.id} item={item}/>
                    ))}
                </div>
            </div>

        </div>
    )
        ;
}