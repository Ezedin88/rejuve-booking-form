import '../almostDoneStyles.css';
import { Field } from 'formik'
import React from 'react'

function AlmostDoneSection({
  values,
  defaultTip,
  handlePercentageChange,
  handleCustomTipChange,
  calculatedTipAmount,
  tipOptions
}) {
  // const calculatedTipAmount = Number(customTip) || (Number(productPrice) * Number(percentageTip)) / 100;
  return (
    <div>
      <>
      <div className="promo-wrapper">
        <div className="promo-and-gift">
          <p className="do-you-have-promo">Do you have a Promo Code ?</p>
          <div className="promo-checkbox-and-label">
            <Field className="promo-check-box" id="giftCard" type="checkbox" name="giftCard" />
            <label htmlFor="giftCard" className='gift-card-label'>Gift Card</label>
          </div>
          <div className="promo-discount-button-wrapper">
            <input className="enter-promo-discount"
              placeholder="Enter Discount Code"
              type="text" id="promo" name="promo" />
            <button
              disabled={!values.giftCard}
              style={{
                cursor: !values.giftCard ? 'not-allowed' : 'pointer'
              }}
              className="apply-promo-btn"
            >Apply Discount</button>                    </div>
        </div>

        {/* checkbox gift card */}
        <div className="inner-tip-wrapper">
          <div className="tip-wrapper">
            <p className="tip">Tip</p>
          </div>
          <p className='choose-tip-amount'>Choose a tip amount</p>
          <div className="tips-and-inbox">
            <div className="flex-tips-wrapper">
              {[ 5, 10, 15, 20].map((percentage) => (
                <div className="tip-choice-group" key={percentage}>
                  <input
                  className='tip-radio'
                    type="radio"
                    // defaultChecked={Number(percentage) === Number(defaultTip)}
                    id={`${Number(percentage)}%`}
                    name="tip"
          onChange={() => handlePercentageChange(percentage)}
          checked={tipOptions.selectedTipOption === percentage}
                    // checked={(Number(percentage) === Number(defaultTip))}
                  />
                  <label htmlFor={`${Number(percentage)}%`}>{`${Number(percentage)}%`}</label>
                </div>
              ))}
            </div>
            <div className="flex-tips-wrapper">
            <div className="tip-choice-group" 
            key="others">
            <input
              className='tip-radio'
              type="radio"
              style={{maxWidth:'200px'}}
              defaultChecked
              id="others"
              name="tip"
              onChange={() => handlePercentageChange('others')}
              checked={tipOptions.selectedTipOption === 'others'}
            />
            <label htmlFor="others">Other</label>
          </div>
          </div>
          </div>
          {/* add a custom tip amount */}

          <div className="tip-input-and-dollar-wrapper">
            <input type="number" placeholder="Custom Tip" id='tip-input' className="tip-input input-box"
            style={{marginTop: '30px'}}
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
                {Number(calculatedTipAmount||0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
      </>
    </div>
  )
}

export default AlmostDoneSection