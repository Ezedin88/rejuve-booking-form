// import Stripe from "stripe";

// const stripe = new Stripe('sk_test_51HFQsEF7hHoyPJTdMELQKrMh7K41sNmrb6yf9D53PmUIQNOm6P4WrLxOMTS6K1mEUdxqsIW443yp9Zrw4e3lKymv00859FkIfv');

export const client = {
    getProductById: async (product_id) => {
        const apiUrl = `https://rejuve.md/wp-json/wc/v3/products/${product_id}`;
        const consumerKey = "ck_e7aa9e0555bdbad2db0811eda91b501d0d759dcb";
        const consumerSecret = "cs_661249c3135e6b9d86ae3fd7fae5a94bbc624e9e";
        const encodedCredentials = btoa(`${consumerKey}:${consumerSecret}`);
        if (!product_id) return;
        try {
            const response = await fetch(apiUrl, {
                headers: {
                    Authorization: `Basic ${encodedCredentials}`,
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    },
    getAllTreatments: async () => {
        const apiUrl = `https://rejuve.md/wp-json/wc/v3/products/?per_page=100`;
        const consumerKey = "ck_e7aa9e0555bdbad2db0811eda91b501d0d759dcb";
        const consumerSecret = "cs_661249c3135e6b9d86ae3fd7fae5a94bbc624e9e";

        try {
            const response = await fetch(apiUrl, {
                headers: {
                    Authorization: `Basic ${btoa(`${consumerKey}:${consumerSecret}`)}`,
                    "Content-Type": "application/json"
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    },
    async getAllProviders() {
        const url = `https://rejuve.md/wp-json/wp/v2/provider/?status=publish`;
        const username = 'ck_fc0b9c9746fdf1fbabcb01d6cf35f7e577c349d2';
        const password = 'cs_4ba59ff35428397bbebc94ce42425deeeff5cc9d';
        const encodedCredentials = btoa(`${username}:${password}`);
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Basic ${encodedCredentials}`,
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            if (data) {
                const formattedProviders = data.map(provider => {
                    const { id, date, acf } = provider;
                    const { booking_options } = acf || {};
                    return {
                        id,
                        name: provider.title.rendered,
                        date: new Date(date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
                        time: new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                        bookingOptions: booking_options
                    };
                });
                console.log('woocommerce provider===>', data)
                return formattedProviders;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    },
    async getSelectedProviderTimeAndDate(props) {
        const { providerId, values, providers } = props || {};
        const { bookingChoice } = values || {};
        const url = `https://rejuve.md/wp-json/wc/v3/orders`;
        const consumerKey = "ck_e7aa9e0555bdbad2db0811eda91b501d0d759dcb";
        const consumerSecret = "cs_661249c3135e6b9d86ae3fd7fae5a94bbc624e9e";
        const encodedCredentials = btoa(`${consumerKey}:${consumerSecret}`);

        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Basic ${encodedCredentials}`,
                    "Content-Type": "application/json"
                },
            });
            const data = await response.json();

            if (data) {
                // filter datas only whose status is processing
                const processingOrders = data.filter(order => order.status === 'processing');

                // meta data array
                const metaDataArray = processingOrders.map(({ meta_data }) => meta_data);
                const providerInfos = metaDataArray.map(metaData => metaData.find(({ key }) => key === 'providerinfo'));
                const validProviderInfos = providerInfos.filter(providerInfo => providerInfo);

                const takenTimes = [];
                const takenDates = [];
                if (providerId) {
                    const periodsForCurrentProvider = validProviderInfos.filter(({ value }) => value.id === providerId);
                    periodsForCurrentProvider.forEach(({ value }) => {
                        const { time, date } = value;
                        takenDates.push(date);
                        takenTimes.push(time);
                    });
                }

                const providersWithCurrentId = providers?.filter(provider => provider.id === providerId);
                const { bookingOptions } = providersWithCurrentId?.[0] || {};
                const { available_date__clinic_, available_date__housecall, select_available_time__clinic_, select_available_time__housecall__ } = bookingOptions || {};

                const select_available_dates_house_call = (available_date__housecall || []).map(date => date.select_available_date__housecall);
                const select_available_dates_at_clinic = (available_date__clinic_ || []).map(date => date.select_available_date__clinic_);

                const select_available_time__house_call_ = (select_available_time__housecall__ || []).map(time => time.select_available_time__house_call_);
                const select_available_time__at_clinic__ = (select_available_time__clinic_ || []).map(time => time.select_available_time);
                // get all times between 10:30am - 6:30pm
                const generateAllTimes = () => {
                    const times = [];
                    let currentTime = new Date();
                    currentTime.setHours(10, 30, 0, 0);

                    const endTime = new Date();
                    endTime.setHours(18, 30, 0, 0);

                    while (currentTime <= endTime) {
                        times.push(currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                        currentTime.setMinutes(currentTime.getMinutes() + 30);
                    }
                    return times;
                }

                const allTimes = generateAllTimes();
                if (bookingChoice === 'atourclinics' && providerId) {
                    return {
                        takenDates,
                        takenTimes,
                        select_available_time__at_clinic__,
                        select_available_dates_at_clinic
                    }
                } else if (bookingChoice === 'housecall' && providerId) {
                    return {
                        takenDates,
                        takenTimes,
                        select_available_time__house_call_,
                        select_available_dates_house_call
                    }
                } else if (bookingChoice === 'atourclinics' && !providerId) {
                    // Get all available dates and times from all providers for 'atourclinics'
                    // Extract all available clinic dates
                    const allDatesAtClinic = providers
                        .flatMap(provider => {
                            const clinicDates = provider.bookingOptions?.available_date__clinic_;
                            if (!clinicDates || clinicDates === false) return []; // Skip providers without available clinic dates or with false value
                            return clinicDates.map(date => date.select_available_date__clinic_);
                        });
                    const aggregatedTimeAvailable = new Set(providers
                        .flatMap(provider => (provider.bookingOptions?.select_available_time__clinic_ || [])
                            .map(time => time.select_available_time.toLowerCase())
                            .filter(time => {
                                const timeString = time.split(' ')[0]; // Extract time part without AM/PM
                                const [hours, minutes] = timeString.split(':').map(Number); // Extract hours and minutes
                                return (hours >= 10 && hours <= 18) || (hours === 6 && minutes === 30); // Filter times between 10:30 AM to 6:30 PM
                            })));
                    const aggregatedTimeAvailableArray = [...aggregatedTimeAvailable];
                    return {
                        takenDates: [],
                        takenTimes: [],
                        select_available_time__at_clinic__: aggregatedTimeAvailableArray,
                        select_available_dates_at_clinic: allDatesAtClinic
                    };
                } else if (bookingChoice === 'housecall') {
                    // Get all available dates and times from all providers for 'athousecall'
                    const allDatesHouseCall = providers
                        .flatMap(provider => {
                            const houseCallDates = provider.bookingOptions?.available_date__housecall;
                            if (!houseCallDates || houseCallDates === false) return []; // Skip providers without available house call dates or with false value
                            return houseCallDates.map(date => date.select_available_date__housecall);
                        });
                    // Normalize to lowercase and filter times between 10:30 AM to 6:30 PM
                    const aggregatedTimeAvailable = new Set(providers
                        .flatMap(provider => {
                            const houseCallTimes = provider.bookingOptions?.select_available_time__housecall__;
                            if (!houseCallTimes || houseCallTimes === false) return []; // Skip providers without available house call times or with false value
                            return houseCallTimes.map(time => time.select_available_time__house_call_.toLowerCase());
                        })
                        .filter(time => {
                            const timeString = time.split(' ')[0]; // Extract time part without AM/PM
                            const [hours, minutes] = timeString.split(':').map(Number); // Extract hours and minutes
                            return (hours >= 10 && hours <= 18) || (hours === 6 && minutes === 30); // Filter times between 10:30 AM to 6:30 PM
                        }));

                    // Convert Set back to array
                    const aggregatedTimeAvailableArray = [...aggregatedTimeAvailable];
                    return {
                        takenDates: [],
                        takenTimes: [],
                        select_available_time__house_call_: aggregatedTimeAvailableArray,
                        select_available_dates_house_call: allDatesHouseCall
                    };
                } else {
                    return;
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    }

    ,
    async createOrder(order) {
        const url = `https://rejuve.md/wp-json/wc/v3/orders`;
        const consumerKey = "ck_e7aa9e0555bdbad2db0811eda91b501d0d759dcb";
        const consumerSecret = "cs_661249c3135e6b9d86ae3fd7fae5a94bbc624e9e";
        const encodedCredentials = btoa(`${consumerKey}:${consumerSecret}`);

        try {
            const validOrders = order.filter(singleOrder => singleOrder.line_items && singleOrder.line_items.length > 0);
            const requests = validOrders.map(async (singleOrder) => {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        Authorization: `Basic ${encodedCredentials}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(singleOrder)
                });
                return response.json();
            });
            const results = await Promise.all(requests);
            return results;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    }
    ,
    // handlePaymentIntent: async (theTotalPriceAmount) => {
    //     try {
    //         const paymentIntent = await stripe.paymentIntents.create({
    //             amount: theTotalPriceAmount * 100,
    //             currency: 'usd',
    //             payment_method_types: ['card'],
    //         });
    //         const { id: paymentIntentId, client_secret } = paymentIntent;
    //         return { paymentIntentId, client_secret };
    //     } catch (error) {
    //         console.error('Error creating payment intent:', error);
    //         throw error;
    //     }
    // },

    getCentersData: async () => {
        const url = `https://rejuve.md/wp-json/zenoti/v1/get-all-centers`;
        const consumerKey = "ck_e7aa9e0555bdbad2db0811eda91b501d0d759dcb";
        const consumerSecret = "cs_661249c3135e6b9d86ae3fd7fae5a94bbc624e9e";
        const encodedCredentials = btoa(`${consumerKey}:${consumerSecret}`);

        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Basic ${encodedCredentials}`,
                    "Content-Type": "application/json"
                },
            });
            const data = await response.json();
            console.log('centers data===>', data);
            return data;
        }
        catch (error) {
            console.log('error: ', error);
        }

    },
    // create a guest
    createZenotiGuest: async (guestData) => {
        const url = `https://rejuve.md/wp-json/zenoti/v1/create-guest`;
        const consumerKey = "ck_e7aa9e0555bdbad2db0811eda91b501d0d759dcb";
        const consumerSecret = "cs_661249c3135e6b9d86ae3fd7fae5a94bbc624e9e";
        const encodedCredentials = btoa(`${consumerKey}:${consumerSecret}`);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${encodedCredentials}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(guestData)
            });
            const data = await response.json();
            console.log('guest data===>', data);
            return data;
        }
        catch (error) {
            console.log('error: ', error);
        }
    },

    // get providers
    getZenotiProviders: async () => {
        const url = `https://rejuve.md/wp-json/zenoti/v1/get-zenoti-providers`;
        const consumerKey = "ck_e7aa9e0555bdbad2db0811eda91b501d0d759dcb";
        const consumerSecret = "cs_661249c3135e6b9d86ae3fd7fae5a94bbc624e9e";
        const encodedCredentials = btoa(`${consumerKey}:${consumerSecret}`);

        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Basic ${encodedCredentials}`,
                    "Content-Type": "application/json"
                },
            }
            );
            const data = await response.json();
            // don't show data that has personal_info.first_name = 'Front'
            if (data) {
                const filteredData = data?.therapists?.filter(item => item.personal_info.first_name !== "Front");
                const formattedData = filteredData?.map(item => {
                    const job_info_name = item.job_info.name
                        .replace(/\s+/g, ' ')
                        .toLowerCase()
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');

                    return ({
                        id: item.id,
                        job_info: item.job_info,
                        name: item.personal_info.first_name + ' ' + '(' + job_info_name + ')',
                    })
                });
                console.log('zenoti providers===>', data);
                return formattedData;
            }
        }
        catch (error) {
            console.log('error: ', error);
        }
    }
}