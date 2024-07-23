import propTypes from 'prop-types';
import '../whyRejuve.css';

function WhyRejuve({currentProduct}) {
  const {name:theProductName,acf,categories} = currentProduct ||{};
  const categoryName = categories?.[0] === 'IV Treatment' ? 'Iv Therapy' : categories?.[0];

  const {convenience_section_title,convenience_list} = acf ||{};
const first_convenience_title = convenience_list?.[0]?.title;
const first_convenience_description = convenience_list?.[0]?.description;

const second_convenience_title = convenience_list?.[1]?.title;
const second_convenience_description = convenience_list?.[1]?.description;

const third_convenience_title = convenience_list?.[2]?.title;
const third_convenience_description = convenience_list?.[2]?.description;

  return (
    convenience_section_title&&currentProduct&& Object.keys(currentProduct).length>0?
    <>
     <section className='product-section' id='product-section-id'>
      <h1 className='product-section-title'>{convenience_section_title}</h1>
      <div className="main-section-container">
      <div className='product-section-cards' >
        <div className='product-section-card'>
          <img src="http://rejuve.com/wp-content/uploads/2024/01/Frame_9.svg" alt="placeholder" />
          <h1 
      className="product-section-card-h1" 
      dangerouslySetInnerHTML={{ __html: first_convenience_title }}
    />
          <p
            className='why-rejuve-description'
          >{first_convenience_description}</p>
        </div>
        <div className='product-section-card'>
          <img src="http://rejuve.com/wp-content/uploads/2024/01/Frame_8.svg" alt="placeholder" />
         <h1 className="product-section-card-h1" dangerouslySetInnerHTML={{ __html: second_convenience_title }} />
          <p
            className='why-rejuve-description'  
          >{second_convenience_description}</p>
        </div>
        <div className='product-section-card'>
          <img src="http://rejuve.com/wp-content/uploads/2024/01/Frame_10.svg" alt="placeholder" />
          <h1 className="product-section-card-h1" dangerouslySetInnerHTML={{ __html: third_convenience_title }} />
          <p
            className='why-rejuve-description'
          >{third_convenience_description}</p>
        </div>
      </div>
      </div>
    </section>
    <section className="book-weight-loss-section">
      <div className="iv-therapy-top">
        <p className="iv-therapy-context">{categoryName||'Iv Therapy'}</p>
      </div>
      <div className="middle-main">
        <p className="book-weight-loss-metabolic" id='book-weight-loss-metabolic-id'>
          Book {theProductName}
        </p>
      </div>
      <div className="returning-customer-context">
        <p className="returning-customer">Returning customer?</p>
        <p className="click-to-login"><a href="https://rejuve.com/sign-in">Click here to login</a></p>
      </div>
    </section>
    </>:null
  )
}

export default WhyRejuve;

WhyRejuve.propTypes = {
  currentProduct: propTypes.object.isRequired
} 