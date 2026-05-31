import React from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import StorefrontIcon from "@mui/icons-material/Storefront";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
        { text: "Orders", icon: <ShoppingCartIcon />, path: "/admin/orders" },
        { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
        { text: "Products", icon: <StorefrontIcon />, path: "/admin/products" },
        // { text: "Categories", icon: <CategoryIcon />, path: "/admin/categories" },
        // { text: "Pending Collaborators", icon: <GroupAddIcon />, path: "/admin/approve-ctv" },
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                zIndex: 1,
                width: 250,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: 250,
                    boxSizing: "border-box",
                    backgroundColor: "#f5f7fa",
                    borderRight: "none",
                    boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
                    pt: 2,
                    top: "100px",
                    position: "fixed",
                    height: "calc(100% - 80px)",
                },
            }}
        >
            <Box sx={{ px: 2, mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                    🌟 Admin Panel
                </Typography>
            </Box>
            <List>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <ListItem disablePadding key={item.text}>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{
                                    mx: 1,
                                    my: 0.5,
                                    borderRadius: 2,
                                    backgroundColor: isActive ? "#e3f2fd" : "transparent",
                                    "&:hover": {
                                        backgroundColor: "#e3f2fd",
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive ? "#1976d2" : "#555",
                                        minWidth: 40,
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? "bold" : 500,
                                        color: isActive ? "#1976d2" : "#333",
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Drawer>
    );
};

export default Sidebar;
