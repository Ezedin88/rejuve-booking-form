export const client = {
    getProductById: async (productId) => {
        const apiUrl = `https://rejuve.md/wp-json/wc/v3/products/${productId}`;
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
    }
}
