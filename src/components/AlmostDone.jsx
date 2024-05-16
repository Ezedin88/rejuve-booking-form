import { Field } from 'formik'
import React from 'react'

function AlmostDoneSection({
  values,
  defaultTip,
  handlePercentageChange,
  handleCustomTipChange,
  calculatedTipAmount
}) {
  return (
    <div>
         <>
              {/* checkbox gift card */}
              <div>
                <div>
                  <label>
                    <Field type="checkbox" name="giftCard" />
                    Gift Card
                  </label>
                </div>
                <div>
                  <label>Promo Code</label>
                  <Field type="text" name="promoCode" />
                  <button
                    disabled={!values.giftCard}
                    style={{
                      cursor: !values.giftCard ? 'not-allowed' : 'pointer'
                    }}
                  >Apply Discount</button>
                </div>
                {/* choose a tip amount */}
                {[0, 5, 10, 15, 20].map((percentage) => (
                  <div className="tip-choice-group" key={percentage}>
                    <input
                      type="radio"
                      id={`${Number(percentage)}%`}
                      name="tip"
                      onChange={() => handlePercentageChange(Number(percentage))}
                      checked={(Number(percentage) === Number(defaultTip))}
                    />
                    <label htmlFor={`${Number(percentage)}%`}>{`${Number(percentage)}%`}</label>
                  </div>
                ))}
                {/* add a custom tip amount */}
                <div className="tip-input-and-dollar-wrapper">
                  <input type="number" placeholder="Custom Tip" className="tip-input"
                    onChange={handleCustomTipChange}
                  />
                </div>
                <div className="total-tip-wrapper" style={{ display: 'flex', gap: 10 }}>
                  <p className="tipTotalLabel">Tip total:
                    {/* className="tipTotalPrice" */}
                  </p>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <p className="tipTotalPrice">$</p>
                    <p className="tipTotalPrice">
                      {Number(calculatedTipAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </>
    </div>
  )
}

export default AlmostDoneSection