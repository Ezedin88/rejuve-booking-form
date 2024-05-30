export const organizeLineItems = (data) => {
    // Ensure userData array exists and is not empty
    const providerId = data.providers.find(
        (provider) => provider.name === data?.values?.provider
    )?.id;
    if (!data.values.userData || data.values.userData.length === 0) {
        return;
    }

    data.values.userData.forEach((user, index) => {
        organizeItems(user, data.lineItems, index, data.values);
    });

    return {
        ...data,
        fee_lines: [
            {
                name: 'Tip',
                tax_class: '',
                tax_status: 'taxable',
                total: String(data.calculatedTipAmount),
            },
        ],
        meta_data: [
            {
                key: 'providerinfo',
                value: {
                    id: providerId,
                    time: data?.values?.bookingTime,
                    date: data?.values?.bookingDate,
                },
            },
        ],
    };
}

export function organizeItems(user, lineItems, userIndex, values) {
    const meta = (index, name) => ({
        key: 'Name',
        value: name || `Person ${index + 1} Person ${index + 1}`,
    });

    if (userIndex) {
        user.line_items = lineItems
            .filter((item) => item.userIndex == userIndex)
            .map((item) => {
                return {
                    ...item,
                    meta_data: [meta(0)],
                };
            });
        return;
    }

    user.line_items = lineItems.map((item) => {
        const bookingPlace =
            values?.bookingChoice === 'housecall' ? 'house' : 'clinic';

        // if (bookingPlace === 'clinic') {
        //     const fieldsToDelete = ['address_1', 'address_2', 'city', 'state', 'postcode'];
        //     fieldsToDelete.forEach(field => {
        //         delete user.billing[field];
        //     });
        // }

        const metaDataArray = [
            {
                key: 'type',
                value:
                    values?.bookingChoice === 'housecall' ? 'house call' : 'clinic',
            },
            {
                key: 'Provider',
                value: values?.provider,
            },
            userIndex === item.userIndex
                ? meta(0, `${user.billing.first_name} ${user.billing.last_name}`)
                : meta(item.userIndex),
            {
                key: 'Booking',
                value: bookingPlace,
            },
        ];

        if (bookingPlace === 'clinic') {
            metaDataArray.push({
                key: 'Clinic Choice',
                value: values?.clinicChoice,
            });
        }

        // Filter out any falsy values from meta_data array
        const filteredMetaData = metaDataArray.filter(Boolean);

        return {
            ...item,
            meta_data: filteredMetaData,
        };
    });

    return;
}