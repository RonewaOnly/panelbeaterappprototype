
export const generateReportData = (interactions) => {
    const totalRequests = interactions.length;
    const completedRequests = interactions.filter(i => i.status === "Completed").length;
    const averageResponseTime = interactions.reduce((acc, cur) => {
        const time = parseInt(cur.responseTime);
        return acc + (isNaN(time) ? 0 : time);
    }, 0) / totalRequests;

    const servicesCategorized = {};
    interactions.forEach(interaction => {
        if (!servicesCategorized[interaction.serviceRequest]) {
            servicesCategorized[interaction.serviceRequest] = {
                count: 0,
                satisfaction: [],
            };
        }
        servicesCategorized[interaction.serviceRequest].count++;
        if (interaction.satisfactionRating !== null) {
            servicesCategorized[interaction.serviceRequest].satisfaction.push(interaction.satisfactionRating);
        }
    });

    // Calculate average satisfaction per service
    Object.keys(servicesCategorized).forEach(service => {
        const satisfactionRatings = servicesCategorized[service].satisfaction;
        const avgSatisfaction = satisfactionRatings.length > 0
            ? (satisfactionRatings.reduce((acc, rating) => acc + rating, 0) / satisfactionRatings.length).toFixed(2)
            : "No ratings";
        servicesCategorized[service].averageSatisfaction = avgSatisfaction;
    });

    return {
        totalRequests,
        completedRequests,
        averageResponseTime,
        servicesCategorized,
    };
};

export const calculateCustomerRetention = (interactions) => {
    const retentionData = {};
    interactions.forEach((interaction) => {
        const { customerId, requestDate } = interaction;
        const yearMonth = requestDate.substring(0, 7); // Extract YYYY-MM format

        if (!retentionData[customerId]) {
            retentionData[customerId] = new Set();
        }
        retentionData[customerId].add(yearMonth);
    });

    const retentionRates = Object.values(retentionData).map((dates) => dates.size);
    const totalCustomers = retentionRates.length;
    const retainedCustomers = retentionRates.filter(size => size > 1).length;

    const retentionRate = (retainedCustomers / totalCustomers) * 100;
    return retentionRate.toFixed(2); // return percentage
};