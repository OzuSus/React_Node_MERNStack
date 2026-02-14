import {useContext, useState} from "react";
import {NavLink, useLocation, useNavigate} from "react-router-dom";

import Badge from "@mui/material/Badge";
import LocalGroceryStoreTwoToneIcon from "@mui/icons-material/LocalGroceryStoreTwoTone";

import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import PersonIcon from "@mui/icons-material/Person";

import {LoginRounded, LogoutRounded} from "@mui/icons-material";
import {UserContext} from "../context/UserContext.jsx";

export default function Header() {
    const [isMenuClicked, setIsMenuClicked] = useState(false);
    const [isSearchclicked, setIsSearchedClicked] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [category, setCategory] = useState("");

    const navigate = useNavigate();

    const {user, userInfo, logout} = useContext(UserContext);

    const location = useLocation();

    const handleMenu = () => {
        setIsMenuClicked(!isMenuClicked);
        window.scrollTo({top: 0, left: 0, behavior: "smooth"});
    };
    const handleCategory = (e) => {
        setCategory(() => e.target.value);
        navigate("/browse");
    };
    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    const handleScrollToSection = (sectionId) => {
        if (location.pathname !== "/") {
            navigate("/", { state: { scrollTo: sectionId } });
        } else {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: "smooth" });
            }
        }
    };


    return (
        <>
            <div className="headerContainer">
                <div className="categories">
                    <li className="NavItem" onClick={() => handleScrollToSection("home")}>Home</li>
                    <NavLink to="/shop">
                        <li className="NavItem">Shop</li>
                    </NavLink>
                    <li className="NavItem" onClick={() => handleScrollToSection("trending")}>Trending</li>
                    <li className="NavItem" onClick={() => handleScrollToSection("new")}>New</li>
                    <li className="NavItem" onClick={() => handleScrollToSection("category")}>Category</li>
                    <li className="NavItem" onClick={() => handleScrollToSection("business")}>Business</li>
                </div>
                <div className="headerLeft">
                    <div className={isMenuClicked ? "expandMenu" : "menuBar"} onClick={handleMenu}>
                    <span class="sideBarMenu">
                        <div className="bar1"></div>
                        <div className="bar2"></div>
                        <div className="bar3"></div>
                    </span>
                    </div>
                    <div className="logoContatiner" onClick={() => {
                        navigate('/')
                    }}>
                        <h2>Aurora Veneris</h2>
                        <p>Your Jewelry House</p>
                    </div>
                </div>
                <div className="navbarIcons">
                    {userInfo?.roleId === 0 && (
                        <NavLink to="/auctionUser">
                            <li className="NavItem">Auction</li>
                        </NavLink>
                    )}
                    {(userInfo?.roleId === 1 || userInfo?.roleId === 2) && (
                        <NavLink to="/auctionJeweler">
                            <li className="NavItem">Auction</li>
                        </NavLink>
                    )}
                    <NavLink to="/about">
                        <li className="NavItem">About</li>
                    </NavLink>
                    <NavLink to="contact">
                        <li className="NavItem">Contact</li>
                    </NavLink>
                    {userInfo?.roleId === 2 && (
                        <NavLink to="/admin">
                            <li className="NavItem">Admin</li>
                        </NavLink>
                    )}

                    {user ? (
                        <>
                            <span className="wishList">
                                <Badge color="secondary" sx={{color: "#5f3926"}}>
                                    <NavLink to="/favorite">
                                        <FavoriteTwoToneIcon/>
                                    </NavLink>
                                </Badge>
                            </span>
                            <span className="emptyCart">
                                <Badge color="secondary" sx={{color: "#5f3926"}}>
                                    <NavLink to="/cart">
                                        <LocalGroceryStoreTwoToneIcon/>
                                    </NavLink>
                                </Badge>
                            </span>
                            <span className="profile">
                                <NavLink to="/profile">
                                    <PersonIcon/>
                                </NavLink>
                            </span>
                            <span className="logout">
                                <LogoutRounded onClick={handleLogout}/>
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="login">
                                <NavLink to="/Login">
                                    <button className="btn_login">
                                        Login
                                    </button>
                                </NavLink>
                            </span>
                        </>
                    )}
                </div>
            </div>
            {isMenuClicked && (
                <div title="Menu bar" className="sideNav">
                    <ul>
                        <NavLink to="/">
                            <li onClick={handleMenu}>HOME</li>
                        </NavLink>
                        <NavLink to="/about">
                            <li onClick={handleMenu}>ABOUT</li>
                        </NavLink>
                        <NavLink to="/shop">
                            <li onClick={handleMenu}>SHOP</li>
                        </NavLink>
                        <NavLink to="contact">
                            <li onClick={handleMenu}>CONTACT</li>
                        </NavLink>
                        <li>
                            <select value={category} name="categoryChoose" onChange={handleCategory}
                                    id="chooseCategory">
                                <option value="SHOP">SHOP CATEGORY</option>
                                <option value="rings">RINGS</option>
                                <option value="bracelet">BRACELETS</option>
                                <option value="earring">EARRINGS</option>
                                <option value="necklace">NECKLACES</option>
                            </select>
                        </li>
                    </ul>
                </div>
            )}
        </>
    );
}