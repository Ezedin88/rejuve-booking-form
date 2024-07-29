// get product price for iv therapy
export const getProductPrice = ({ product, nadName, isCurrentNadType, productIsHouseCall }) => {
    const { image, name, id: productID, variations, price, short_description } = product || {};

    const nadVariant = variations?.filter(variant => {
        const { permalink } = variant;

        try {
            const url = new URL(permalink);
            const attributeProduct = url.searchParams.get("attribute_product");
            const decodedAttributeProduct = decodeURIComponent(attributeProduct);

            return decodedAttributeProduct.includes(nadName);
        } catch (e) {
            // Handle invalid URL error
            console.error(`Invalid URL: ${permalink}`, e);
            return false;
        }
    });


    const productHouseCall = parseFloat(variations?.[1]?.price);
    const productInClinic = parseFloat(variations?.[0]?.price) || parseFloat(price);

    let nadVariantHouseCall = null;
    let nadVariantInClinic = null;

    // Process the matching variants
    nadVariant?.forEach(variant => {
        const variantPrice = parseFloat(variant?.price);

        if (variant?.name?.includes('House')) {
            nadVariantHouseCall = variantPrice;
        } else if (variant?.name?.includes('Clinic')) {
            nadVariantInClinic = variantPrice;
        }
    });

    const variantID = productIsHouseCall ? nadVariant?.[1]?.id : nadVariant?.[0]?.id;

    const bookHouseCall = isCurrentNadType ? nadVariantHouseCall : productHouseCall;
    const bookInClinic = isCurrentNadType ? nadVariantInClinic : productInClinic;
    const id = isCurrentNadType ? variantID : productID;
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