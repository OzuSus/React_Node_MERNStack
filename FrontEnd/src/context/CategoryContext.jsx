// CategoryContext.js
import { createContext, useState, useEffect } from "react";
import {api} from "../utils/api";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    const [categoryMap, setCategoryMap] = useState({});
    const [categoryList, setCategoryList] = useState([]);


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/categories");
                const categories = Array.isArray(response.data) ? response.data : response.data.categories || [];
                const map = {};
                categories.forEach(cat => {
                    map[cat._id || cat.id] = cat.name;
                });
                setCategoryMap(map);
                setCategoryList(categories.map(cat => ({...cat, id: cat.id || cat._id})));
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
