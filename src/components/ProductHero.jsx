import '../ProductHero.css';
import { useEffect, useState } from 'react';

import productData from '../product.json';

function ProductHero({ currentProduct, setProductPrice, isFetchingProduct, values }) {

    const { images, name, id, price, short_description, price_html = 0, slug } = currentProduct || {};
    const largeHeroImage = images && images[0].src || '';
    const smallHeroImage = images && images[1].src || '';
    const prices = !isFetchingProduct && price_html && price_html.match(/&#36;<\/span>(\d+)/g) || 0;
    const bookInClinic = !isFetchingProduct && price_html && prices[0].replace(/&#36;<\/span>/, '') || 0;
    const bookHouseCall = !isFetchingProduct && price_html && prices[1].replace(/&#36;<\/span>/, '') || 0;

    const {
        productName,
        productNameCite,
        productDescription,
        productImage,
        productPrice,
        WhereToBook
    } = productData;


    const onChangeHandler = (name) => {
        if (name === "atourclinics") {
            // dispatch(setIsRejuveClinicsSelected(true));
            // dispatch(setIsHouseCallSelected(false));
            setProductPrice(Number(bookInClinic));
            values.Booking = "atourclinics";
        } else {
            // dispatch(setIsRejuveClinicsSelected(false));
            // dispatch(setIsHouseCallSelected(true));
            setProductPrice(Number(bookHouseCall));
            values.Booking = "housecall";
        }
        // scroll to element with id 'user-detail'
        const element = document.getElementById('user-detail-section');
        element.scrollIntoView({ behavior: "smooth" });

    }

    useEffect(() => {
        setProductPrice(Number(bookHouseCall));
    }, [bookHouseCall, isFetchingProduct])

    return (
        <>
            <section className='product-hero-main-wrapper'>
                <section className="product-hero-wrapper">
                    {/* image section*/}
                    <section className="product-image">
                        <div className="image-container large-hero-image">
                            <img src={largeHeroImage} alt="product" className="image" />           
                        </div>
                        <div className="image-container small-hero-image">
                            <img src={smallHeroImage} alt="product" className="image" />           
                        </div>
                        
                    </section>
                    {/* content section */}
                    <section className="product-description-wrapper">
                        <p className="product-name">
                            {name}
                        </p>
                        <p className="product-description" dangerouslySetInnerHTML={{ __html: short_description }} />
                        <div className="product-price-buttons-wrapper">
                            <div className="booking-buttons">
                                <p className="product-price">
                                    ${bookInClinic}
                                </p>

                                <button className="book-button"
                                    type='button'
                                    onClick={() => onChangeHandler("atourclinics")}
                                >
                                    Book in clinic
                                </button>
                                <p className="where-to-book">
                                    At our locations
                                </p>
                            </div>
                            <div className="booking-buttons">
                                <p className="product-price">
                                    ${bookHouseCall}
                                </p>
                                <button className="book-button"
                                    type='button'
                                    onClick={() => onChangeHandler("housecall")}
                                >
                                    Book House Call
                                </button>
                                <p className="where-to-book">
                                    we come to you
                                </p>
                            </div>
                        </div>
                    </section>
                </section>
            </section>
        </>
    )
}

export default ProductHero;