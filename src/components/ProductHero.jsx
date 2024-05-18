import '../ProductHero.css';
import { useEffect, useState } from 'react';

function ProductHero({ currentProduct, setProductPrice,setWhereBooking, isFetchingProduct, values }) {

    const { images, name, id, price, short_description, price_html = 0, slug } = currentProduct || {};
    const pricePattern = /<bdi><span class="woocommerce-Price-currencySymbol">&#36;<\/span>(\d+(?:,\d+)*)<\/bdi>/g;
    const matches =!isFetchingProduct&&price_html&& [...price_html.matchAll(pricePattern)];
    let largeHeroImage = images && images[0].src || '';
    let smallHeroImage = images && images[1].src || '';
    const prices = !isFetchingProduct && price_html && matches?.map(match => match[1].replace(/,/g, '')) || 0;
    let bookInClinic = null;
    let bookHouseCall = null;

    if (prices.length === 1) {
        bookInClinic = parseFloat(prices[0]);
    } else if (prices.length >= 2) {
        bookInClinic = parseFloat(prices[0]);
        bookHouseCall = parseFloat(prices[1]);
    }


    const onChangeHandler = (name) => {
        if (name === "atourclinics") {
            setWhereBooking("atourclinics");
            values.Booking = "atourclinics";
        } else {
            setWhereBooking("housecall");
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