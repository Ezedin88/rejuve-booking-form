import propTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import '../ProductHero.css';
import '../service-menu-custom-style.css';
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

const useUpdatedLineItems = (lineItems, values, arrObj) => {
  return useMemo(() => {
    return lineItems.map((lineItem) => {
      const { product_id } = lineItem;
      const userBooking = values.bookingChoice;

      const priceEntry = arrObj.find((price) => price.id === product_id);

      if (priceEntry) {
        if (userBooking === 'housecall' && priceEntry.bookHouseCall !== null) {
          lineItem.price = priceEntry.bookHouseCall;
          lineItem.variation_id = priceEntry.variations?.[1]?.id || priceEntry.variations?.[0]?.id;
        } else {
          lineItem.price = priceEntry.bookInClinic;
        }
      }

      return lineItem;
    });
  }, [lineItems, values.bookingChoice, arrObj]);
};

const ProductHero = ({
  currentProduct,
  setWhereBooking,
  isFetchingProduct,
  values,
  lineItems,
  setLineItems,
  treatmentChoices,
  selectNad,
  setCurrentProduct,
  dataPage,
}) => {
  const isCurrentNadType = currentProduct?.categories?.[0]?.slug === 'nad';
  const isDecolletage = currentProduct?.slug === 'decolletage';
  const { description,acf } = currentProduct || {};
  const {product_image} = acf ||{};
  const {large_screen_image_width,large_screen_image_height,small_screen_image_width,small_screen_image_height} = product_image || {};

const largeScreenSizeWidthExists = large_screen_image_width ? true : false;
const largeScreenSizeHeightExists = large_screen_image_height ? true : false;
const smallScreenSizeWidthExists = small_screen_image_width ? true : false;
const smallScreenSizeHeightExists = small_screen_image_height ? true : false;

  const arrObj = useMemo(() => {
    return treatmentChoices?.map((item) => {
      const { id, bookHouseCall, bookInClinic, variations } = getProductPrice({
        product: item
      });
      return { id, bookHouseCall, bookInClinic, variations };
    });
  }, [treatmentChoices]);

  const updatedLineItems = useUpdatedLineItems(lineItems, values, arrObj);

  useEffect(() => {
    setLineItems(updatedLineItems);
  }, [setLineItems]);

  const {
    bookHouseCall,
    bookInClinic,
    largeHeroImage,
    name,
    short_description,
    smallHeroImage,
  } = getProductPrice({ product: currentProduct, isFetchingProduct }) || {};

  const onChangeHandler = (bookingType) => {
    setWhereBooking(bookingType);
    values.bookingChoice = bookingType;
    document.getElementById('user-detail-section').scrollIntoView({ behavior: 'smooth' });
  };

  const botoxProducts = useMemo(() => {
    return treatmentChoices?.filter((item) =>  item.categories[0]?.name === 'Botox Products' );
  }, [treatmentChoices, isFetchingProduct]);

  const handleCheckboxChange = (checked, treatment) => {
    if (checked) {
      setLineItems([
        ...lineItems,
        {
          userIndex: 0,
          product_id: treatment.id,
          productName: treatment.name,
          price: treatment.price,
          quantity: 1,
          metaData: [],
        },
      ]);
    } else {
      setLineItems(lineItems.filter((item) => item.product_id !== treatment.id));
    }
  };

  const decodedDescription = decodeHtmlEntities(description);
  const extractedContent = extractRelevantTags(decodedDescription);

  return (
    <>
      {currentProduct && Object.keys(currentProduct).length > 0 ? (
        <section className="single-product-page-product-hero-main-wrapper">
          {isDecolletage && (
            <section
              className="decolletage_wrapper_header beauty_description_decolletage"
              style={{ color: 'black' }}
              dangerouslySetInnerHTML={{ __html: extractedContent }}
            />
          )}

          <section className={`product-hero-wrapper ${isDecolletage ? 'hero-decolattege' : ''} ${!dataPage ? 'medical-service-menu' : ''}`}>
            <section className="product-image">
              <div className={`product-image ${isDecolletage ? 'decolattege-image' : 'image-container large-hero-image'}`}>
                <img src={largeHeroImage} alt="product" className="image" 
                style={{
                  width: largeScreenSizeWidthExists ? `${large_screen_image_width}px` : '100%',
                  height: largeScreenSizeHeightExists ? `${large_screen_image_height}px` : 'auto'
                }}
                />
                {isDecolletage && (
                  <div className="face-buttons-wrapper">
                    {botoxProducts.map((item, index) => (
                      <section key={index} className={`${item.slug}-button-wrapper botox-check-box-wrapper`}>
                        <input
                          type="checkbox"
                          className={`${item.slug}-button botox-check-box-button face-circle-buttons`}
                          value={item.id}
                          checked={lineItems.some((lineItem) => lineItem.product_id === item.id)}
                          onChange={(e) => handleCheckboxChange(e.target.checked, item)}
                        />
                      </section>
                    ))}
                  </div>
                )}
              </div>
              {!isDecolletage && (
                <div className="image-container small-hero-image">
                  <img src={smallHeroImage} alt="product" className="image" 
                  style={{
                    width: smallScreenSizeWidthExists ? `${small_screen_image_width}px` : '100%',
                    height: smallScreenSizeHeightExists ? `${small_screen_image_height}px` : 'auto'
                  }}
                  />
                </div>
              )}
            </section>

            {!isDecolletage && (
              <section className="product-description-wrapper">
                <p className="booking-page product-name">{name}</p>
                <p className="booking-page product-description" dangerouslySetInnerHTML={{ __html: short_description }} />

                <div className="product-price-buttons-wrapper">
                  {!isCurrentNadType && (
                    <div className="booking-buttons">
                      <p className="product-price">${bookInClinic}</p>
                      <button className="book-button" type="button" onClick={() => onChangeHandler('atourclinics')}>
                        Book in clinic
                      </button>
                      <p className="where-to-book">At our locations</p>
                    </div>
                  )}
                  {bookHouseCall && !isCurrentNadType && (
                    <div className="booking-buttons">
                      <p className="product-price">${bookHouseCall}</p>
                      <button className="book-button" type="button" onClick={() => onChangeHandler('housecall')}>
                        Book House Call
                      </button>
                      <p className="where-to-book">We come to you</p>
                    </div>
                  )}
                  {isCurrentNadType && (
                    <div className="selected-and-unselected-nad">
                      <div className="nad-wrapper" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                        {selectNad.map((item, index) => (
                          <div className="booking-buttons" key={index}>
                            <button
                              className="book-button nad-buttons"
                              style={{
                                backgroundColor: currentProduct?.name === item.name ? 'black' : 'white',
                                color: currentProduct?.name === item.name ? 'white' : 'black',
                              }}
                              onClick={() => setCurrentProduct(item)}
                            >
                              {item.name}
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="booking-buttons" style={{ display: 'flex', flexDirection: 'column' }}>
                        <p className="product-price" style={{ marginTop: '16px !important' }}>
                          ${bookInClinic}
                        </p>
                        <button className="book-button" type="button" onClick={() => onChangeHandler('atourclinics')}>
                          Book in clinic
                        </button>
                        <p className="where-to-book">At our locations</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </section>
        </section>
      ) : (
        <section className="single-product-page-product-hero-main-wrapper service-menu-sing-page-hero-main-wrapper">
          <section className="product-hero-wrapper medical-service-menu">
            <article className="medical-service-menu-title">Rejuve Medical Service Menu</article>
            <article className="medical-service-menu-description">
              Returning customer?{' '}
              <span className="nowrap">
                <a href="https://rejuve.com/sign-in" className="click-here-service-menu">
                  Click here
                </a>
              </span>{' '}
              to login. This will auto-fill most of your information for a faster booking.
            </article>
          </section>
        </section>
      )}
    </>
  );
};

export default ProductHero;

ProductHero.propTypes = {
  currentProduct: propTypes.object,
  setWhereBooking: propTypes.func,
  isFetchingProduct: propTypes.bool,
  values: propTypes.object,
  lineItems: propTypes.array,
  setLineItems: propTypes.func,
  treatmentChoices: propTypes.array,
  selectNad: propTypes.array,
  setCurrentProduct: propTypes.func,
  dataPage: propTypes.bool,
};