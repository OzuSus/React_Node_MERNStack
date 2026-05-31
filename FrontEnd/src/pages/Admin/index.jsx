import React, {useContext, useEffect} from "react";
import {Box, Toolbar} from "@mui/material";
import Sidebar from "./components/Sidebar";
import {Outlet, useNavigate} from "react-router-dom";
import {UserContext} from "../../context/UserContext";

const AdminLayout = () => {
    const navigate = useNavigate()
    const { user, userInfo, isLoading } = useContext(UserContext);

    useEffect(() => {
        if (isLoading){
            return;
        }
        if (!user || user.role !== 'ADMIN') {
            navigate("/Home", { replace: true });
        }
    }, [userInfo, isLoading, navigate]);



    return (
        <Box sx={{display: "flex"}}>
            <Sidebar/>
            <Box component="main" sx={{flexGrow: 1, p: 3}}>
                <Outlet/>
            </Box>
        </Box>
    );
};

export default AdminLayout;
