export const getAttributeProduct = (permalink) => {
    const url = new URL(permalink);
    return url.searchParams.get('attribute_product').replace(/%2B/g, '+');
};

export const createMergedProduct = (variations, productName) => {
    const mergedProduct = {
        productName: productName,
        variations: []
    };

    variations.forEach(variation => {
        const attributeProduct = getAttributeProduct(variation.permalink);
        if (attributeProduct === productName) {
            const type = variation.permalink.includes('attribute_type=House') ? 'housePrice' : 'clinicPrice';
            mergedProduct.variations.push({
                [type]: variation.price,
                id: variation.id,
                variation_id: variation.id
            });
        }
    });

    return mergedProduct;
};