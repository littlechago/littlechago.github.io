/**
 * Prize Tiers System for QR Hunt
 * 
 * This file defines the prize tiers, their values, and distribution percentages.
 * The average prize value is kept between $1-5 for optimal profitability.
 */

// Prize tier definitions
const prizeTiers = {
    // Micro prizes ($1) - 70% of all wins
    micro: {
        percentage: 70,
        minValue: 1.00,
        maxValue: 1.00,
        types: [
            {
                name: "Digital Gift Card",
                description: "$1 Amazon/Google Play/iTunes Gift Card",
                url: "prizes/digital-gift.html",
                imageUrl: "images/prizes/gift-card-small.png"
            },
            {
                name: "Discount Code",
                description: "Special discount code for popular services",
                url: "prizes/discount-code.html",
                imageUrl: "images/prizes/discount-code.png"
            },
            {
                name: "Digital Content",
                description: "Premium digital content access",
                url: "prizes/digital-content.html",
                imageUrl: "images/prizes/digital-content.png"
            }
        ]
    },
    
    // Small prizes ($3-5) - 25% of all wins
    small: {
        percentage: 25,
        minValue: 3.00,
        maxValue: 5.00,
        types: [
            {
                name: "Digital Gift Card",
                description: "$5 Amazon/Google Play/iTunes Gift Card",
                url: "prizes/digital-gift.html",
                imageUrl: "images/prizes/gift-card-medium.png"
            },
            {
                name: "Merchandise",
                description: "QR Hunt branded merchandise",
                url: "prizes/merchandise.html",
                imageUrl: "images/prizes/merchandise.png"
            },
            {
                name: "Premium Subscription",
                description: "1-week premium subscription",
                url: "prizes/subscription.html",
                imageUrl: "images/prizes/subscription.png"
            }
        ]
    },
    
    // Medium prizes ($10) - 4% of all wins
    medium: {
        percentage: 4,
        minValue: 10.00,
        maxValue: 10.00,
        types: [
            {
                name: "Digital Gift Card",
                description: "$10 Amazon/Google Play/iTunes Gift Card",
                url: "prizes/digital-gift.html",
                imageUrl: "images/prizes/gift-card-large.png"
            },
            {
                name: "Premium Item",
                description: "Popular low-cost item",
                url: "prizes/premium-item.html",
                imageUrl: "images/prizes/premium-item.png"
            }
        ]
    },
    
    // Grand prizes ($25) - 1% of all wins
    grand: {
        percentage: 1,
        minValue: 25.00,
        maxValue: 25.00,
        types: [
            {
                name: "Grand Prize",
                description: "$25 Amazon Gift Card",
                url: "prizes/grand-prize.html",
                imageUrl: "images/prizes/grand-prize.png"
            }
        ]
    }
};

// Calculate the average prize value
function calculateAveragePrizeValue() {
    let totalPercentage = 0;
    let weightedSum = 0;
    
    for (const tier in prizeTiers) {
        const { percentage, minValue, maxValue } = prizeTiers[tier];
        const avgValue = (minValue + maxValue) / 2;
        
        weightedSum += percentage * avgValue;
        totalPercentage += percentage;
    }
    
    // Ensure percentages add up to 100
    if (totalPercentage !== 100) {
        console.warn(`Prize tier percentages sum to ${totalPercentage}%, not 100%`);
    }
    
    return weightedSum / 100;
}

// Select a random prize based on tier probabilities
function selectRandomPrize() {
    // Generate a random number between 0 and 100
    const rand = Math.random() * 100;
    
    // Determine which tier this falls into
    let cumulativePercentage = 0;
    
    for (const tier in prizeTiers) {
        cumulativePercentage += prizeTiers[tier].percentage;
        
        if (rand <= cumulativePercentage) {
            // Select a random prize type from this tier
            const prizeTypes = prizeTiers[tier].types;
            const randomType = prizeTypes[Math.floor(Math.random() * prizeTypes.length)];
            
            // Generate a random value within the tier's range
            const value = Math.random() * (prizeTiers[tier].maxValue - prizeTiers[tier].minValue) + prizeTiers[tier].minValue;
            
            return {
                tier,
                value: Math.round(value * 100) / 100, // Round to 2 decimal places
                name: randomType.name,
                description: randomType.description,
                url: randomType.url,
                imageUrl: randomType.imageUrl
            };
        }
    }
    
    // Fallback to micro prize if something goes wrong
    const microTypes = prizeTiers.micro.types;
    const fallbackType = microTypes[Math.floor(Math.random() * microTypes.length)];
    
    return {
        tier: 'micro',
        value: prizeTiers.micro.minValue,
        name: fallbackType.name,
        description: fallbackType.description,
        url: fallbackType.url,
        imageUrl: fallbackType.imageUrl
    };
}

// Get the average prize value
const averagePrizeValue = calculateAveragePrizeValue();
console.log(`Average prize value: $${averagePrizeValue.toFixed(2)}`);

// Export functions and data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        prizeTiers,
        calculateAveragePrizeValue,
        selectRandomPrize,
        averagePrizeValue
    };
}
