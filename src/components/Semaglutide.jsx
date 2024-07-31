import props from 'prop-types';
function Semaglutide({
    largeHeroImage,
    width,
    height
}) {
    return (
        <section className="semaglutide-hero-wrapper"
            style={{
                backgroundImage: `url(${largeHeroImage})`
                // height: '100%', // Adjust height as needed
            }}
        >
            <div className="semaglutide-left-content-container">
                <div className="left-content-wrapper">
                    <h1 className="semaglutide-title">
                        The Secret to Lasting Weight
                    </h1>
                    <p className="semaglutide-subtitle">
                        Say goodbye to yo-yo dieting and hello to lasting weight loss with Semaglutide & Tirzepatide.
                    </p>
                    <div className="product-price-buttons-wrapper">
                        <div className="booking-buttons">
                            <p className="product-price">${125}</p>
                            <button className="book-button" type="button">
                                Book House Call
                            </button>
                            <p className="where-to-book">We come to you</p>
                        </div>
                        <div className="booking-buttons">
                            <p className="product-price">${125}</p>
                            <button className="book-button" type="button">
                                Book House Call
                            </button>
                            <p className="where-to-book">We come to you</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="semaglutide-image-wrapper">
        <img src={largeHeroImage} alt="semaglutide"/>
    </div> */}
        </section>
    )
}

export default Semaglutide;

Semaglutide.propTypes = {
    largeHeroImage: props.string.isRequired,
    width: props.number.isRequired,
    height: props.number.isRequired
};