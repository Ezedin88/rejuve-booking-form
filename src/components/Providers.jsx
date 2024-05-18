
import '../providerStyles.css';
function Providers({providers,handleProviderChange,selectedProvider,values}) {
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
                    checked={selectedProvider==="Any"}
                    onChange={handleProviderChange} 
                    required
                />
                <label htmlFor="any">Any</label>
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
                    checked={providerItem?.name === selectedProvider}
                    onChange={handleProviderChange} 
                    required
                />
                <label htmlFor={providerItem?.name}>{providerItem?.name}</label>
            </div>
        );
    })
}
    </div>
    </>
  )
}

export default Providers;