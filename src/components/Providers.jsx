import propTypes from 'prop-types';
import '../providerStyles.css';
import { useEffect, useState } from 'react';
import { client } from '../api/client';
import { useFormikContext } from 'formik';
function Providers({ providers, values,setAvailableBookingPeriods }) {
    const providerId = providers.find(
        (provider) => provider.name === values.provider
      )?.id;
    const {setFieldValue} = useFormikContext();
    useEffect(() => {
        const fetchSelectedProviderPeriod = async () => {
            const data = await client.getSelectedProviderTimeAndDate({
                providerId,
                providers,
                values
            });
            setAvailableBookingPeriods(data);
        }
        fetchSelectedProviderPeriod();
    }, [ values.provider,values.bookingChoice])

    const onChangeHandler = (e) => {
        values.provider = e.target.value;
        setFieldValue('provider', e.target.value);
    }

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
                        onChange={e=>onChangeHandler(e)}
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
                            <div key={index} className="provider-input-label-wrapper provider-group" style={{ display: 'flex', alignItems: 'center' }}>
                                <div className='circle-radios'>
                                    <input
                                        className='provider-input'
                                        type="radio"
                                        id={providerItem?.name}
                                        name="provider"
                                        value={providerItem?.name}
                                        onChange={e=>onChangeHandler(e)}
                                        required
                                    />
                                </div>
                                <label htmlFor={providerItem?.name}
                                    style={{ cursor: 'pointer' }}
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