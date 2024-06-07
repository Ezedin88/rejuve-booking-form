
function OrderSummary({
    values,
    lineItems,
    totalCalculation,
    calculatedTipAmount,
    tips
}) {
    return (
        <div className="choose_providers_wrapper">
            <div className="order-summary-main" id="order-summary-main">
                <p className="form-main-titles">Order Summary</p>
                <div
                    className="order-summary-main-inner"
                    id="order-summary-main-in"
                >
                    {values?.userData?.length > 0 &&
                        values?.userData.map((item, userIndex) => {
                            const selectedItems = lineItems.filter(lineItem => lineItem?.userIndex === userIndex);
                            return (
                                <div key={userIndex} className="personWrapper">
                                    <p className="form-main-inner-title">
                                        {userIndex === 0
                                            ? item?.billing?.first_name +
                                            ' ' +
                                            item?.billing?.last_name
                                            : 'Person' + userIndex}
                                        (
                                        {values?.bookingChoice === 'atourclinics'
                                            ? 'clinic'
                                            : 'house call'}
                                        )
                                    </p>
                                    <div className="item-price-summary-wrapper">
                                        {selectedItems.length > 0 ? (
                                            selectedItems.map((lineItem, index) => (
                                                <div key={index} className="item-price-summary">
                                                    <p className="product-name-summary">
                                                        {lineItem?.productName}
                                                    </p>
                                                    <p className="product-price-summary">
                                                        ${lineItem?.price}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="item-price-summary">
                                                <p className="product-name-summary">No item selected</p>
                                                <p className="product-price-summary">$0.00</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                    <div className="total-summary-whole-wrapper">
                        <div className="sub-total-summary">
                            <div className="total-label-price">
                                <p className="sub-total-summary-label">Subtotal</p>
                                <p className="sub-total-summary-price">
                                    ${totalCalculation.toFixed(2)}
                                </p>
                            </div>
                            <div className="total-label-price">
                                <p className="sub-total-summary-label">
                                    Tip(
                                    {tips?.customTip
                                        ? `${Number(tips?.customTip)} $`
                                        : (typeof tips?.percentageTip === 'number' &&
                                            `${Number(tips?.percentageTip)}%`) ||
                                        0}
                                    )
                                </p>
                                <p className="sub-total-summary-price">
                                    ${Number(calculatedTipAmount || 0).toFixed(2)}
                                </p>
                            </div>
                            <div className="total-label-price total-calculation">
                                <p className="total-calculation-label">Total</p>
                                <p className="total-calculation-price">
                                    $
                                    {(
                                        totalCalculation +
                                        Number(calculatedTipAmount || 0)
                                    ).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderSummary