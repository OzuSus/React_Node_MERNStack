import {createContext, useContext, useState, useEffect} from "react";
import axios from "axios";
import {UserContext} from "./UserContext";
import {useParams} from "react-router-dom";

const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({children}) => {
    const {prodID} = useParams();

    const {user} = useContext(UserContext);

    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [categoryName, setCategoryName] = useState("");

    const [relatedProducts, setRelatedProducts] = useState([]);

    const [hasPurchased, setHasPurchased] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [reviews, setReviews] = useState([]);

    const fetchProduct = async (id) => {
        try {
            setLoading(true);
            const productRes = await axios.get(`http://localhost:5000/products/${id}`, {

            });
            const productData = productRes.data.product;
            setProduct(productData);
            console.log("Fetched product:", productData);
            const categoryRes = await axios.get(`http://localhost:5000/categories/${productData.id_category}`, {
            });
            setCategoryName(categoryRes.data.name);
        } catch (err) {
            console.error("Error fetching product or category:", err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchProduct(prodID)
    }, [prodID]);
    useEffect(() => {
        if (!product?.id_category) return;

        axios
            .get(`http://localhost:5000/products/category/${product.id_category}`)
            .then(res => {
                console.log("API result:", res.data);

                // ✅ lấy đúng mảng products
                const products = res.data.products;

                // ✅ loại bỏ sản phẩm hiện tại
                const filtered = products.filter(
                    p => p._id !== product._id
                );

                setRelatedProducts(filtered);
            })
            .catch(err => {
                console.error("Error fetching related products:", err);
            });
    }, [product]);

    // useEffect(() => {
    //     const checkReviewPermission = async () => {
    //         if (!user || !product?.id) return;
    //
    //         try {
    //             const purchaseRes = await axios.get("http://localhost:8080/api/orders/check-purchased", {
    //                 params: {userId: user.id, productId: product.id}
    //             });
    //
    //             setHasPurchased(purchaseRes.data === true);
    //             // console.log("Đã mua:", purchaseRes.data)
    //         } catch (err) {
    //             console.error("Lỗi khi kiểm tra user đã mua sản phẩm này hay chưa:", err);
    //         }
    //     };
    //     checkReviewPermission();
    // }, [user, product]);

    // const fetchReviews = async (id) => {
    //     try {
    //         const response = await axios.get(`http://localhost:8080/api/reviews/product/${id}`);
    //         setReviews(response.data);
    //     } catch (error) {
    //         console.error("Lỗi khi tải reviews:", error);
    //     } finally {
    //     }
    // };
    // useEffect(() => {
    //     if (prodID) {
    //         fetchReviews(prodID);
    //     }
    // }, [product]);

    // useEffect(() => {
    //     const checkReviewPermission = async () => {
    //         if (!user || !prodID) return;
    //         try {
    //             const reviewedRes = await axios.get("http://localhost:8080/api/reviews/check-reviewed", {
    //                 params: {userId: user.id, productId: prodID}
    //             });
    //             setHasReviewed(reviewedRes.data === true);
    //         } catch (err) {
    //             console.error("Lỗi khi kiểm tra đã review:", err);
    //         }
    //     };
    //     checkReviewPermission();
    // }, [user, product]);

    // const addReview = async ({userId, productId, comment, rating}) => {
    //     try {
    //         await axios.post(`http://localhost:8080/api/reviews/write`, {
    //             userId: userId,
    //             productId: productId,
    //             comment: comment,
    //             rating: rating
    //         });
    //     } catch (error) {
    //         console.error("Lỗi khi gửi review:", error);
    //     }
    // };

    return (
        <ProductContext.Provider value={{
            product, fetchProduct, categoryName, loading, relatedProducts,
            hasPurchased, hasReviewed, reviews,
            // addReview,
        }}>
            {children}
        </ProductContext.Provider>
    );
};