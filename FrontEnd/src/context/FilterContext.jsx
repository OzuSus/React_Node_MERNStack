import React, {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";

export const FilterContext = createContext();

export const FilterProvider = ({children}) => {
    const [categories, setCategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedRating, setSelectedRating] = useState(null);
    const [sortByPrice, setSortByPrice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [priceRange, setPriceRange] = useState({min: 0, max: 0});
    const [maxProductPrice, setMaxProductPrice] = useState(500000);
    const [minProductPrice, setMinProductPrice] = useState(0);
    const [step, setStep] = useState(0);
    const [isFilteredPriceRange, setIsFilteredPriceRange] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        fetchCategories();
        fetchAllProducts();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:5000/categories");
            setCategories(response.data);
            setLoading(false);
            setError(false);
        } catch (error) {
            setLoading(false);
            setError(true);
            console.error("Error fetching categories", error);
        }
    };

    const fetchAllProducts = async (page = 1) => {
        try {
            setLoading(true);
            const params = {page, limit: 10};
            if (selectedCategory) params.category = selectedCategory;
            if (selectedRating) params.rating = selectedRating;
            if (sortByPrice) params.sort = sortByPrice;
            if (isFilteredPriceRange) {
                params.minPrice = priceRange.min;
                params.maxPrice = priceRange.max;
            }
            const response = await axios.get("http://localhost:5000/products/filter", { params });
            const data = response.data;
            setAllProducts(data.product);
            setTotalPages(data.totalPages);
            setLoading(false);
            setError(false);
        } catch (error) {
            setLoading(false);
            setError(true);
            console.error(error);
        }
    };
    useEffect(() => {
        fetchAllProducts(1);
        setCurrentPage(1);
    }, [selectedCategory, selectedRating, sortByPrice, priceRange]);
    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId === "" ? null : categoryId);
    };
    const handleMaxChange = (e) => {
        const max = Number(e.target.value);

        setPriceRange(prev => ({
            ...prev,
            max: Number(e.target.value)
        }));
        setIsFilteredPriceRange(true);
    };

    const handleRatingChange = (e) => {
        const rating = e.target.value;
        setSelectedRating(rating === "" ? null : Number(rating));
    };

    const handleSortChange = (e) => {
        setSortByPrice(e.target.value);
    };

    const clearFilters = () => {
        setSelectedCategory(null);
        setSelectedRating(null);
        setSortByPrice(null);
        setPriceRange({min: 0, max: 0});
        setIsFilteredPriceRange(null);
        fetchAllProducts();
    };


    return (
        <FilterContext.Provider
            value={{
                allProducts,
                categories,
                selectedCategory,
                selectedRating,
                sortByPrice,
                fetchAllProducts,
                fetchCategories,
                handleCategoryChange,
                handleRatingChange,
                handleSortChange,
                clearFilters,
                loading,
                error,
                priceRange,
                handleMaxChange,
                maxProductPrice,
                minProductPrice,
                step,
                currentPage,
                totalPages,
                setCurrentPage
            }}
        >
            {children}
        </FilterContext.Provider>
    );
};

export const useFilter = () => useContext(FilterContext);
