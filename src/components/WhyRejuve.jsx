import '../whyRejuve.css';

function WhyRejuve({currentProduct}) {
  const {meta_data} = currentProduct ||{};

const convenience_section_title = meta_data?.find(({key}) => key==='convenience_section_title')?.value;

const convenience_list_0_convenience_title = meta_data?.find(({key}) => key==='convenience_list_0_convenience_title')?.value;

const convenience_list_0_convenience_dscription = meta_data?.find(({key}) => key==='convenience_list_0_convenience_dscription')?.value;

const convenience_list_1_convenience_title = meta_data?.find(({key}) => key==='convenience_list_1_convenience_title')?.value;

const convenience_list_1_convenience_dscription = meta_data?.find(({key}) => key==='convenience_list_1_convenience_dscription')?.value;

const convenience_list_2_convenience_title = meta_data?.find(({key}) => key==='convenience_list_2_convenience_title')?.value;

const convenience_list_2_convenience_dscription = meta_data?.find(({key}) => key==='convenience_list_2_convenience_dscription')?.value;


  return (
    <>
     <section className='product-section' id='product-section-id'>
      <h1 className='product-section-title'>{convenience_section_title}</h1>
      <div className='product-section-cards' >
        <div className='product-section-card'>
          <img src="http://rejuve.md/wp-content/uploads/2024/01/Frame_9.svg" alt="placeholder" />
          <h1 className="product-section-card-h1">{convenience_list_0_convenience_title}</h1>
          <p
            className='why-rejuve-description'
          >{convenience_list_0_convenience_dscription}</p>
        </div>
        <div className='product-section-card'>
          <img src="http://rejuve.md/wp-content/uploads/2024/01/Frame_8.svg" alt="placeholder" />
          <h1 
            className='product-section-card-h1'>{convenience_list_1_convenience_title}</h1>
          <p
            className='why-rejuve-description'  
          >{convenience_list_1_convenience_dscription}</p>
        </div>
        <div className='product-section-card'>
          <img src="http://rejuve.md/wp-content/uploads/2024/01/Frame_10.svg" alt="placeholder" />
          <h1 className='product-section-card-h1'>{convenience_list_2_convenience_title}</h1>
          <p
            className='why-rejuve-description'
          >{convenience_list_2_convenience_dscription}</p>
        </div>
      </div>
    </section>
    <section className="book-weight-loss-section">
      <div className="iv-therapy-top">
        <p className="iv-therapy-context">IV Therapy</p>
      </div>
      <div className="middle-main">
        <p className="book-weight-loss-metabolic" id='book-weight-loss-metabolic-id'>
          Book Weight Loss-Metabolic
        </p>
      </div>
      <div className="returning-customer-context">
        <p className="returning-customer">Returning customer?</p>
        <p className="click-to-login"><a href="">Click here to login</a></p>
      </div>
    </section>
    </>
  )
}

export default WhyRejuve;