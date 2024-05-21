import propTypes from 'prop-types';
import '../providerStyles.css';
function Providers({providers,values}) {
  return (
    <>
     <div className="provider-input-label-wrapper">
        {/* <div className='radio-input-wrapper'></div> */}
                <input
                    className='provider-input'
                    type="radio"
                    id="any"
                    name="provider"
                    value="Any"
                    defaultChecked
                    onChange={ (e)=>values.provider=e.target.value}
                    required
                />
                <label htmlFor="any"
                className='provider-name-label'
                >Any</label>
            </div>
            <div className="provider-group-wrapper">
    {
    providers?.map((providerItem, index) => {
        return (
            <div key={index} className="provider-input-label-wrapper provider-group">
                <input
                    className='provider-input'
                    type="radio"
                    id={providerItem?.name}
                    name="provider"
                    value={providerItem?.name}
                    onChange={
                        (e)=>values.provider=e.target.value
                    }
                    required
                />
                <label htmlFor={providerItem?.name}
                className='provider-name-label'
                >{providerItem?.name}</label>
            </div>
        );
    })
}
    </div>
    </>
  )
}

export default Providers;

Providers.propTypes = {
    providers: propTypes.array,
    values: propTypes.object
    }