import "./home.css";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import ProductCard from "../../components/ProductCard.jsx";
import {useContext, useEffect, useState} from "react";
import axios from "axios";

export default function Home() {
    const navigate = useNavigate();

    const location = useLocation();

    const [trendingProducts, setTrendingProducts] = useState([]);
    const [newproducts, setNewProducts] = useState([]);


    useEffect(() => {
        if (location.state?.scrollTo) {
            const sectionId = location.state.scrollTo;
            let attempts = 0;
            const scrollToSection = () => {
                const section = document.getElementById(sectionId);
                if (section) {
                    section.scrollIntoView({behavior: "smooth"});
                    navigate(location.pathname, {replace: true});
                } else if (attempts < 20) {
                    attempts++;
                    setTimeout(scrollToSection, 100);
                }
            };
            scrollToSection();
        }
    }, [location, navigate]);


    return (
        <>
            <section className="home" id="home">
                <h4>Our Exclusive Collection</h4>
                <h3>The New Rivaraa <br/> Collection
                </h3>
                <p>
                    {" "}
                    your one-stop-shop for exquisite jewelry pieces that are perfect for
                    any occasion.Explore our exclusive collection handcrafted with the
                    finest materials to ensure both quality and beauty. Explore our collection, and find the perfect
                    piece that speaks to you
                </p>
                <div className="mainbutton">
                    <NavLink to='/browse'>
                        <button>Shop Now</button>
                    </NavLink>
                </div>
            </section>
            <section className="trending" id="trending">
                <p>Popular Products</p>
                <h3>TRENDING NOW</h3>
                <div className="productsContainer">
                    {trendingProducts.map((item) => (
                        <ProductCard key={item.id} item={item}/>
                    ))}
                </div>
            </section>

            {/*//add new products section*/}
            <section className="trending" id="new">
                <p>Popular Products</p>
                <h3>NEW PRODUCTS</h3>
                <div className="productsContainer">
                    {newproducts.map((item) => (
                        <ProductCard key={item.id} item={item}/>
                    ))}
                </div>
            </section>
            <section className="showOff">
                <div className="textContent">
                    <p>Unique Pieces</p>
                    <h3>BE ALWAYS ON TREND</h3>
                    <p>We take immense pride in offering jewelry pieces that are crafted with the utmost care and
                        attention to detail. Each item in our collection undergoes rigorous quality checks to ensure it
                        meets our high standards</p>
                    <div className="mainbutton">
                        <NavLink to='/browse'>
                            <button>Shop Now</button>
                        </NavLink>
                    </div>
                </div>
                <div className="imageContent">
                    <img className="bigImage" src='/assets/model2.jpg' width="400px"/>
                    <img className="smallImage" src='/assets/hands.jpg' alt=""/>
                </div>
            </section>

            {/*Shop by category section */}
            <section className="ShopByCategory" id="category">
                <h3 className="home__title">SHOP BY CATEGORY</h3>
                <p>Browse through your favorite categories. we have got them all!</p>
                {/*<div className="categoryBox">*/}
                {/*    {Object.entries(categoryMap).map(([id, name]) => (*/}
                {/*        <div className="className" key={id}>*/}
                {/*            <NavLink to={`/shop`}>*/}
                {/*                <img src={`/assets/categoryIcon/${name}.png`} alt={name}/>*/}
                {/*                <p>{name}</p>*/}
                {/*            </NavLink>*/}
                {/*        </div>*/}
                {/*    ))}*/}
                {/*</div>*/}
            </section>
            <section className="whyUs" id="business">
                <p>BEST IN BUSINESS</p>
                <h3 className="home__title">Why Choose Us</h3>
                <div className="whyusContent">
                    <img className="middleImage" src="/assets/model3.jpg" alt="" srcset=""/>
                    <div className="whyUsDescription">
                        <div>
                            <img src="/assets/whyUsIcons/percent-solid.svg" alt="big discount"/>
                            <h3>Big Discount</h3>
                            <p>We provide higher discounts without compromising on quality or craftsmanship. Our
                                commitment to offering affordable prices allows you to indulge in your love for
                                exquisite jewelry while enjoying significant savings.</p>
                        </div>
                        <div>
                            <img src="/assets/whyUsIcons/truck-fast-solid.svg" alt="fast delivery"/>
                            <h3>Free Delivery</h3>
                            <p>With our Free delivery service, you can shop with confidence, knowing that there are no
                                hidden fees or additional charges. Sit back, relax, and let us take care of delivering
                                your exquisite jewelry directly to you.</p>
                        </div>
                        <div>
                            <img src="/assets/whyUsIcons/wallet-solid.svg" alt="big savings "/>
                            <h3>Secure Payments</h3>
                            <p>We ensure your peace of mind throughout your shopping experience. Your financial security
                                is of utmost importance to us, which is why we have implemented advanced encryption and
                                secure payment gateways.</p>
                        </div>
                        <div>
                            <img src="/assets/whyUsIcons/boxes-packing-solid.svg" alt="big tracking order"/>
                            <h3>Order Tracking</h3>
                            <p>We provide tracking order services, allowing you to stay informed and updated on the
                                status of your purchase every step of the way.we ensure a seamless and transparent
                                shopping experience.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
