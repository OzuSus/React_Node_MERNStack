import "./shop.css";
import axios from "axios";
import {useContext, useState, useEffect} from "react";
import TuneIcon from "@mui/icons-material/Tune";
import Loader from "../../components/Loader";

import ProductCard from "../../components/ProductCard";
import {useFilter} from "../../context/FilterContext";
import {FavoriteContext} from "../../context/FavoriteContext";
import {UserContext} from "../../context/UserContext";

export default function Shop() {
    const [showFilters, setShowFilters] = useState(true);

    const {
        allProducts,
        fetchAllProducts,
        categories,
        fetchCategories,
        handleCategoryChange,
        handleRatingChange,
        handleSortChange,
        clearFilters,
        selectedCategory,
        selectedRating,
        sortByPrice,
        loading,
        error,
        priceRange,
        handleMaxChange,
        maxProductPrice,
        minProductPrice,
        totalPages,

    } = useFilter();
    const {fetchFavoriteItems} = useContext(FavoriteContext);
    const {user} = useContext(UserContext);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchAllProducts(currentPage);
    }, [currentPage]);

    useEffect(() => {
        if (user?.id) {
            fetchFavoriteItems(user.id);
        }
    }, [user, fetchFavoriteItems]);

    const step = Math.ceil((maxProductPrice) / 10);
    return (
        <>
            <div className="allProductsContainer">
                <p>
                    Total Products found : <b>{allProducts.length}</b>
                </p>
                <div className="main">
                    <button
                        className="showFiltersBtn"
                        onClick={() => {
                            setShowFilters(!showFilters);
                        }}
                    >
                        {showFilters ? "Hide" : "Show"}
                        <TuneIcon/>
                    </button>
                    <div className="allFilters">
                        {
                            <aside
                                style={{
                                    display: showFilters ? "block" : "none",
                                    height: "-webkit-fill-available"
                                }}
                                className={!showFilters ? "allFilters " : "mobileViewFilter"}

                            >
                                <div className="filterHeader">
                                    <h3>Filters</h3>
                                </div>
                                <div className="priceFilter">
                                    <h3>Price</h3>
                                    <p>
                                        <span>{minProductPrice}</span>
                                        <span>{maxProductPrice}</span>
                                    </p>
                                    <input
                                        type="range"
                                        name="priceRange"
                                        id="priceRange"
                                        min={minProductPrice}
                                        max={maxProductPrice}
                                        step={step}
                                        value={priceRange.max}
                                        onChange={handleMaxChange}
                                    />

                                </div>
                                <div className="categoryFilter">
                                    <h3>Category</h3>
                                    {categories.map((category) => (
                                        <label key={category._id}>
                                            <input
                                                type="radio"
                                                name="category"
                                                id={category._id}
                                                value={category._id}
                                                onChange={handleCategoryChange}
                                                checked={String(selectedCategory) === String(category._id)}
                                            />
                                            {category.name}
                                        </label>
                                    ))}
                                </div>

                                <div className="ratingFilter">
                                    <h3>Rating </h3>
                                    <label htmlFor="onePlus">
                                        <input
                                            type="radio"
                                            name="rating"
                                            id="onePlus"
                                            value={1}
                                            onChange={handleRatingChange}
                                            checked={selectedRating === 1}
                                        />
                                        1 ⭐
                                    </label>
                                    <label htmlFor="twoPlus">
                                        <input
                                            type="radio"
                                            name="rating"
                                            id="twoPlus"
                                            value={2}
                                            onChange={handleRatingChange}
                                            checked={selectedRating === 2}
                                        />
                                        2 ⭐
                                    </label>
                                    <label htmlFor="threePlus">
                                        <input
                                            type="radio"
                                            name="rating"
                                            id="threePlus"
                                            value={3}
                                            onChange={handleRatingChange}
                                            checked={selectedRating === 3}
                                        />
                                        3 ⭐
                                    </label>
                                    <label htmlFor="fourPlus">
                                        <input
                                            type="radio"
                                            name="rating"
                                            id="fourPlus"
                                            value={4}
                                            onChange={handleRatingChange}
                                            checked={selectedRating === 4}
                                        />
                                        4 ⭐
                                    </label>
                                </div>
                                <div className="sortByPrice">
                                    <h3>Sort by Price</h3>
                                    <label htmlFor="lowToHigh">
                                        <input
                                            type="radio"
                                            name="sorting"
                                            id="lowToHigh"
                                            value="asc"
                                            onChange={handleSortChange}
                                            checked={sortByPrice === "asc"}
                                        />
                                        Low to High
                                    </label>
                                    <label htmlFor="highToLow">
                                        <input
                                            type="radio"
                                            name="sorting"
                                            id="highToLow"
                                            value="desc"
                                            onChange={handleSortChange}
                                            checked={sortByPrice === "desc"}
                                        />
                                        High to Low
                                    </label>
                                </div>
                                <div className="clearAll">
                                    <button onClick={clearFilters}>Clear All</button>
                                </div>
                            </aside>
                        }
                    </div>

                    <div className="displayProducts" style={{width: "-webkit-fill-available"}}>
                        {loading ? (
                            <h3>
                                <Loader></Loader>
                            </h3>
                        ) : error ? (
                            <h3>Something went wrong - Check console for details</h3>
                        ) : (
                            <div className="productsContainer">
                                {allProducts.length > 0 ? (
                                    allProducts.map((item) => (
                                        <ProductCard key={item.id} item={item}/>
                                    ))
                                ) : (
                                    <h3>No products found</h3>
                                )}
                            </div>
                        )}
                        <div className="pagination">
                            <button className="page-btn prev" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>← Prev</button>
                            <span className="page-info">Page {currentPage} / {totalPages}</span>
                            <button className="page-btn next" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next →</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

