import propTypes from 'prop-types';
import '../providerStyles.css';
function Providers({providers,values}) {
  return (
    <>
     <div className="provider-input-label-wrapper">
        <div className='circle-radios'>
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
                </div>
                <label htmlFor="any"
                className='provider-name-label'
                >Any</label>
            </div>
            <div className="provider-group-wrapper">
    {
    providers?.map((providerItem, index) => {
        return (
            <div key={index} className="provider-input-label-wrapper provider-group" style={{display:'flex',alignItems:'center'}}>
        <div className='circle-radios'>
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
                </div>
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