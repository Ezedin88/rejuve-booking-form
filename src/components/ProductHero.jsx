import '../ProductHero.css';
import { useEffect, useMemo, useState } from 'react';
import { getProductPrice } from '../utils/getProductPrice';

function ProductHero({
  currentProduct,
  setProductPrice,
  setWhereBooking,
  isFetchingProduct,
  values,
  lineItems,
  setLineItems,
  treatmentChoices,
  selectNad,
  setCurrentProduct,
}) {
  const isCurrentNadType = currentProduct?.categories?.[0]?.slug === 'nad';
  const isDecolletage = currentProduct?.slug === 'decolletage';
  const {meta_data} = currentProduct||{};
const product_benefit_title = meta_data?.find(({key}) => key==="benefits_of_product_content_title")?.value;
const product_benefit_description = meta_data?.find(({key}) => key==="benefits_of_product_content_description")?.value;
const benefits_of_product_content = meta_data?.find(({key}) => key==="benefits_of_product_content_content")?.value;

  const isBeautyCategory = currentProduct?.categories?.[0]?.slug === 'beauty-treatments';
  const arrObj = useMemo(() => {
    return treatmentChoices?.map((items) => {
      const everyproduct = getProductPrice({
        product: items,
        isFetchingProduct,
      });
      const { id, bookHouseCall, bookInClinic, variations } = getProductPrice({
        product: items,
        isFetchingProduct,
      });
      return { id, bookHouseCall, bookInClinic, variations };
    });
  }, [treatmentChoices, isFetchingProduct]);

  const updatedLineItems = lineItems.map((lineItem) => {
    const { product_id } = lineItem;
    const userBooking = values.bookingChoice;

    // Find the price entry in arrObj corresponding to the product_id
    const priceEntry = arrObj.find((price) => price.id === product_id);

    if (priceEntry) {
      if (userBooking === 'housecall' && priceEntry.bookHouseCall !== null) {
        lineItem.price = priceEntry.bookHouseCall;
        lineItem.variation_id = 'housecall'
          ? priceEntry?.variations[1]
          : priceEntry?.variations[0];
      } else {
        lineItem.price = priceEntry.bookInClinic;
      }
    }

    return lineItem;
  });

  useEffect(() => {
    setLineItems(updatedLineItems);
  }, [values.bookingChoice]);

  const {
    bookHouseCall,
    bookInClinic,
    largeHeroImage,
    name,
    short_description,
    smallHeroImage,
  } = getProductPrice({ product: currentProduct, isFetchingProduct }) || {};

  const onChangeHandler = (name) => {
    if (name === 'atourclinics') {
      setWhereBooking('atourclinics');
      values.bookingChoice = 'atourclinics';
    } else {
      setWhereBooking('housecall');
      values.bookingChoice = 'housecall';
    }
    // scroll to element with id 'user-detail'
    const element = document.getElementById('user-detail-section');
    element.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setProductPrice(Number(bookHouseCall));
  }, [bookHouseCall, isFetchingProduct]);

  const products = useMemo(() => {
    return treatmentChoices?.filter((item) => {
      const { id, bookHouseCall, bookInClinic, variations } = getProductPrice({
        product: item,
        isFetchingProduct,
      });
      // return items whose categories[0]?.name is 'Botox Products'
      return item.categories[0]?.name === 'Botox Products';
    });
  }, [treatmentChoices, isFetchingProduct]);
  

  console.log('products==>',products);

  return (
    <>
      <section className="product-hero-main-wrapper">
        {
          isDecolletage&&
          <section className="decolletage_wrapper_header beauty_description_decolletage" style={{color:'black'}}>
            <h2 className='botox-page-title'>{product_benefit_title}</h2>
            <h4 className='botox-page-title-description'>{product_benefit_description}</h4>
            <h4 className='botox-page-description-content'>{benefits_of_product_content}</h4>
          </section>
        }

        <section className={`product-hero-wrapper ${isDecolletage ? 'hero-decolattege' : ''}`}>
          {/* image section*/}
          <section className="product-image">
            {/* <div className="image-container large-hero-image"> */}
            <div className={`product-image ${isDecolletage ? 'decolattege-image' : ''}`}>
              <img src={largeHeroImage} alt="product" className="image" />
              {
                isDecolletage&&
                <div className="face-buttons-wrapper">
                  <section className="forehead-button-wrapper">
                    <button className="forehead-button face-circle-buttons" type="button">
                      {/* Forehead */}
                    </button>
                  </section>
                  <section className="eye-brow-button-wrapper">
                    <button className="eye-brow-button face-circle-buttons" type="button">
                      {/* Eye Brow */}
                    </button>
                  </section>
                  <section className="crow-feet-button-wrapper">
                    <button className="crow-feet-button face-circle-buttons" type="button">
                      {/* Crow's Feet */}
                      </button>
                  </section>
                  <section className="lip-top-button-wrapper">
                    <button className="lip-top-button face-circle-buttons" type="button">
                      {/* Lip Top */}
                    </button>
                    </section>
                    <section className="gummy-smile-button-wrapper">
                    <button className="gummy-smile-button face-circle-buttons" type="button">
                      {/* Gummy Smile */}
                    </button>
                    </section>
                    <section className="orange-peel-chin-button-wrapper">
                    <button className="orange-peel-chin-button face-circle-buttons" type="button">
                      {/* Orange Peel Chin */}
                    </button>
                    </section>
                    <section className="neck-bands-button-wrapper">
                    <button className="neck-bands-button face-circle-buttons" type="button">
                      {/* Neck Bands */}
                    </button>
                    </section>
                </div>
              }
            </div>
              {!isDecolletage&&
            <div className="image-container small-hero-image">
              <img src={smallHeroImage} alt="product" className="image" />
            </div>
            }
          </section>
          {/* content section */}
          {!isDecolletage&&
          <section className="product-description-wrapper">
            <p className="product-name">{name}</p>
            <p
              className="product-description"
              dangerouslySetInnerHTML={{ __html: short_description }}
            />
            {/* booking sections */}

            <div className="product-price-buttons-wrapper">
              {!isCurrentNadType && (
                <div className="booking-buttons">
                  <p className="product-price">${bookInClinic}</p>

                  <button
                    className="book-button"
                    type="button"
                    onClick={() => onChangeHandler('atourclinics')}
                  >
                    Book in clinic
                  </button>
                  <p className="where-to-book">At our locations</p>
                </div>
              )}
              {bookHouseCall && !isCurrentNadType && (
                <div className="booking-buttons">
                  <p className="product-price">${bookHouseCall}</p>
                  <button
                    className="book-button"
                    type="button"
                    onClick={() => onChangeHandler('housecall')}
                  >
                    Book House Call
                  </button>
                  <p className="where-to-book">we come to yodu</p>
                </div>
              )}
              {isCurrentNadType && (
                <div className="selected-and-unselected-nad">
                  <div
                    className="nad-wrapper"
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}
                  >
                    {selectNad.map((item, index) => {
                      return (
                        <div className="booking-buttons" key={index}>
                          <button
                            className="book-button nad-buttons"
                            // if current product is equal to item then set the background of current button black and make the color white
                            style={{
                              backgroundColor:
                                currentProduct?.name === item.name
                                  ? 'black'
                                  : 'white',
                              color:
                                currentProduct?.name === item.name
                                  ? 'white'
                                  : 'black',
                            }}
                            onClick={() => {
                              setCurrentProduct(item);
                            }}
                          >
                            {item.name}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div
                    className="booking-buttons"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <p
                      className="product-price"
                      style={{ marginTop: '16px !important' }}
                    >
                      ${bookInClinic}
                    </p>

                    <button
                      className="book-button"
                      type="button"
                      onClick={() => onChangeHandler('atourclinics')}
                    >
                      Book in clinic
                    </button>
                    <p className="where-to-book">At our locations</p>
                  </div>
                </div>
              )}
            </div>
          </section>
            }
        </section>
      </section>
    </>
  );
}

export default ProductHero;
