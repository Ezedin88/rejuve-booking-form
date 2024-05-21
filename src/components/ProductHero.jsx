import '../ProductHero.css';
import { useEffect, useMemo, useState } from 'react';
import { getProductPrice } from '../utils/getProductPrice';

function ProductHero({ currentProduct, setProductPrice,setWhereBooking, isFetchingProduct, values,lineItems,setLineItems,treatmentChoices }) {
    const arrObj = useMemo(() => {
        return treatmentChoices?.map(items => {
            const everyproduct =  getProductPrice({ product: items, isFetchingProduct });
            const { id, bookHouseCall, bookInClinic,variations } = getProductPrice({ product: items, isFetchingProduct });
            return { id, bookHouseCall, bookInClinic,variations };
        });
    }, [treatmentChoices, isFetchingProduct]);
       const updatedLineItems = lineItems.map(lineItem => {
        const { product_id } = lineItem;
        const userBooking = values.bookingChoice;
    
        // Find the price entry in arrObj corresponding to the product_id
        const priceEntry = arrObj.find(price => price.id === product_id);
    
        if (priceEntry) {
            if (userBooking === 'housecall'&&priceEntry.bookHouseCall!==null) {
                lineItem.price = priceEntry.bookHouseCall;
                lineItem.variation_id = 'housecall'? priceEntry?.variations[1] : priceEntry?.variations[0]; 
            } else {
                lineItem.price = priceEntry.bookInClinic;
            }
        }
    
        return lineItem;
    });

    useEffect(()=>{
        setLineItems(updatedLineItems);
    },[values.bookingChoice])

    const {bookHouseCall,bookInClinic,largeHeroImage,name,short_description,smallHeroImage} = getProductPrice({ product: currentProduct, isFetchingProduct })||{};

    const onChangeHandler = (name) => {
        if (name === "atourclinics") {
            setWhereBooking("atourclinics");
            values.bookingChoice = "atourclinics";

        } else {
            setWhereBooking("housecall");
            values.bookingChoice = "housecall";
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