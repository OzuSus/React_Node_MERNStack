// CategoryContext.js
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    const [categoryMap, setCategoryMap] = useState({});
    const [categoryList, setCategoryList] = useState([]);


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:5000/categories");
                const categories = response.data;
                const map = {};
                categories.forEach(cat => {
                    map[cat.id] = cat.name;
                });
                setCategoryMap(map);
                setCategoryList(categories);
            } catch (error) {
                console.error("Lỗi khi fetch danh mục:", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <CategoryContext.Provider value={{ categoryMap, categoryList }}>
            {children}
        </CategoryContext.Provider>
    );
};
