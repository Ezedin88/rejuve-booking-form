
// get product price for iv therapy
export const getProductPrice = ({ product, isFetchingProduct }) => {
    const { images, name, id, variations, price, short_description, price_html = 0, slug } = product || {};
    const pricePattern = /<bdi><span class="woocommerce-Price-currencySymbol">&#36;<\/span>(\d+(?:,\d+)*)<\/bdi>/g;
    const matches = !isFetchingProduct && price_html && [...price_html.matchAll(pricePattern)];
    let largeHeroImage = images && images[0]?.src || '';
    let smallHeroImage = images && images[1]?.src || '';
    const prices = !isFetchingProduct && price_html && matches?.map(match => match[1].replace(/,/g, '')) || 0;
    let bookInClinic = null;
    let bookHouseCall = null;

    if (prices.length === 1) {
        bookInClinic = parseFloat(prices[0]);
    } else if (prices.length >= 2) {
        bookInClinic = parseFloat(prices[0]);
        bookHouseCall = parseFloat(prices[1]);
    }

    return {
        bookHouseCall,
        bookInClinic,
        largeHeroImage,
        name,
        short_description,
        smallHeroImage,
        id,
        variations
    }

}

// const {bookHouseCall,bookInClinic,largeHeroImage,name,short_description,smallHeroImage} = getProductPrice({ product: currentProduct, isFetchingProduct })||{};