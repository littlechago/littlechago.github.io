// Simple ad statistics tracking
let adStats = {
    totalViews: 0,
    estimatedRevenue: 0,
    lastReset: new Date().toISOString()
};

// Check if we have stored stats
if (localStorage.getItem('qrHuntAdStats')) {
    try {
        adStats = JSON.parse(localStorage.getItem('qrHuntAdStats'));
    } catch (e) {
        console.error('Error loading ad stats:', e);
        // Reset stats if there's an error
        localStorage.setItem('qrHuntAdStats', JSON.stringify(adStats));
    }
}

// Function to track an ad view
function trackAdView() {
    // Increment view count
    adStats.totalViews++;

    // Calculate estimated revenue (using average $0.006 per view)
    // This is based on an optimized RPM of $6.00 per 1000 views
    const estimatedPerView = 0.006;
    adStats.estimatedRevenue = adStats.totalViews * estimatedPerView;

    // Save to localStorage
    localStorage.setItem('qrHuntAdStats', JSON.stringify(adStats));

    // Log for debugging
    console.log('Ad view tracked. Total views:', adStats.totalViews);
    console.log('Estimated revenue: $' + adStats.estimatedRevenue.toFixed(2));

    return adStats;
}

// Function to get current stats
function getAdStats() {
    return adStats;
}

// Function to reset stats
function resetAdStats() {
    adStats = {
        totalViews: 0,
        estimatedRevenue: 0,
        lastReset: new Date().toISOString()
    };

    localStorage.setItem('qrHuntAdStats', JSON.stringify(adStats));
    return adStats;
}

// Export functions if using as a module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        trackAdView,
        getAdStats,
        resetAdStats
    };
}
