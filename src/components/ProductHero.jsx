import '../ProductHero.css';
import '../service-menu-custom-style.css';
import { useEffect, useMemo, useState } from 'react';
import { getProductPrice } from '../utils/getProductPrice';

const decodeHtmlEntities = (str) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
};

const extractRelevantTags = (htmlString) => {
  const regex = /<(h2|h4)[^>]*>.*?<\/\1>/gi;
  const matches = htmlString.match(regex);
  return matches ? matches.join('') : '';
};

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
  const { description } = currentProduct || {};
  const arrObj = useMemo(() => {
    return treatmentChoices?.map((items) => {
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

  const botoxProducts = useMemo(() => {
    return treatmentChoices?.filter((item) => {
      const { id, bookHouseCall, bookInClinic, variations } = getProductPrice({
        product: item,
        isFetchingProduct,
      });
      // return items whose categories[0]?.name is 'Botox Products'
      return item.categories[0]?.name === 'Botox Products';
    });
  }, [treatmentChoices, isFetchingProduct]);

  const handleCheckboxChange = (checked, treatment) => {
    if (checked) {
      setLineItems([
        ...lineItems,
        {
          userIndex: 0,
          product_id: treatment.id,
          productName: treatment?.name,
          price: treatment?.price,
          quantity: 1,
          metaData: [],
        },
      ]);
    } else {
      setLineItems(lineItems.filter((item) => item.product_id !== treatment.id));
    }
  }

  // Decode the HTML entities
  const decodedDescription = decodeHtmlEntities(description);

  const extractedContent = extractRelevantTags(decodedDescription);

  return (
    <>
      {currentProduct && Object.keys(currentProduct).length > 0 &&
        <section className="product-hero-main-wrapper">
          {
            isDecolletage &&
            <section
              className="decolletage_wrapper_header beauty_description_decolletage"
              style={{ color: 'black' }}
              dangerouslySetInnerHTML={{ __html: extractedContent }}
            />
          }

          <section className={`product-hero-wrapper ${isDecolletage ? 'hero-decolattege' : ''}`}>
            {/* image section*/}
            <section className="product-image">
              {/* <div className="image-container large-hero-image"> */}
              {/* <div className={`product-image image-container large-hero-image ${isDecolletage ? 'decolattege-image' : ''}`}> */}
              <div className={`product-image ${isDecolletage ? 'decolattege-image' : 'image-container large-hero-image large-hero-image'}`}>
                <img src={largeHeroImage} alt="product" className="image" />
                {
                  isDecolletage &&
                  <div className="face-buttons-wrapper">
                    {
                      botoxProducts.map((item, index) => {
                        return (
                          <section
                            key={index}
                            className={`${item?.slug}-button-wrapper botox-check-box-wrapper`}
                          >
                            <input
                              type="checkbox"
                              className={`${item?.slug}-button botox-check-box-button face-circle-buttons`}
                              value={item?.id}
                              checked={lineItems.some((lineItem) => lineItem.product_id === item.id)}
                              onChange={(e) => handleCheckboxChange(e.target.checked, item)}
                            />
                          </section>
                        )
                      })
                    }
                  </div>
                }
              </div>
              {!isDecolletage &&
                <div className="image-container small-hero-image">
                  <img src={smallHeroImage} alt="product" className="image" />
                </div>
              }
            </section>
            {/* content section */}
            {!isDecolletage &&
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
                      <p className="where-to-book">we come to you</p>
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
        ||
        <section className="product-hero-main-wrapper">
        <section className="product-hero-wrapper medical-service-menu">
          <article className='medical-service-menu-title'>Rejuve Medical Service Menu</article>
          <article className='medical-service-menu-description'>
            Returning customer? <span className="nowrap"><a href="#" className='click-here-service-menu'>Click here</a></span> to login. This will auto-fill most of your information for a faster booking.
          </article>
        </section>
      </section>
      }
    </>
  );
}

export default ProductHero;
