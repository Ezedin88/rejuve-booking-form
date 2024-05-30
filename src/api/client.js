import Stripe from "stripe";

const stripe = new Stripe('sk_test_51HFQsEF7hHoyPJTdMELQKrMh7K41sNmrb6yf9D53PmUIQNOm6P4WrLxOMTS6K1mEUdxqsIW443yp9Zrw4e3lKymv00859FkIfv');

export const client = {
    getProductById: async (product_id) => {
        const apiUrl = `https://rejuve.md/wp-json/wc/v3/products/${product_id}`;
        const consumerKey = "ck_e7aa9e0555bdbad2db0811eda91b501d0d759dcb";
        const consumerSecret = "cs_661249c3135e6b9d86ae3fd7fae5a94bbc624e9e";
        const encodedCredentials = btoa(`${consumerKey}:${consumerSecret}`);
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
        const url = `https://rejuve.md/wp-json/wp/v2/provider`;
        const username = 'ck_e7aa9e0555bdbad2db0811eda91b501d0d759dcb';
        const password = 'cs_661249c3135e6b9d86ae3fd7fae5a94bbc624e9e';
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
                    const { id, date } = provider;
                    return {
                        id,
                        name: provider.title.rendered,
                        date: new Date(date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
                        time: new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                    };
                });
                return formattedProviders;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    },
    async createOrder(order) {
        const url = `https://rejuve.md/wp-json/wc/v3/orders`;
        const consumerKey = "ck_e7aa9e0555bdbad2db0811eda91b501d0d759dcb";
        const consumerSecret = "cs_661249c3135e6b9d86ae3fd7fae5a94bbc624e9e";
        const encodedCredentials = btoa(`${consumerKey}:${consumerSecret}`);

        try {
            const requests = order.map(async (singleOrder) => {
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

            // Wait for all requests to complete
            const results = await Promise.all(requests);
            return results;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    },
    handlePaymentIntent: async (theTotalPriceAmount) => {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: theTotalPriceAmount * 100,
                currency: 'usd',
                payment_method_types: ['card'],
            });
            console.log('payment intent==>', paymentIntent);
            const { id: paymentIntentId, client_secret } = paymentIntent;
            return { paymentIntentId, client_secret };
        } catch (error) {
            console.error('Error creating payment intent:', error);
            throw error;
        }
    }
};
