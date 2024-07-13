// get product price for iv therapy
export const getProductPrice = ({ product }) => {
    const { image, name, id, variations, price, short_description } = product || {};

    const bookHouseCall = parseFloat(variations?.[1]?.price) || parseFloat(price);
    const bookInClinic = parseFloat(variations?.[0]?.price) || parseFloat(price);

    return {
        bookHouseCall,
        bookInClinic,
        largeHeroImage: image,
        name,
        short_description,
        smallHeroImage: image,
        id,
        variations
    }

}