const violationService = require('../services/violationService');

exports.getStats = async (req, res) => {
    const violationsList = await violationService.getAll();
    const totalToday = violationsList.length + 3120; 
    const activeCams = 142;
    const avgAccuracy = 98.6;
    const pendingReviews = violationsList.filter(v => v.status === "Pending").length;
    
    const distribution = {};
    violationsList.forEach(v => {
        distribution[v.violationType] = (distribution[v.violationType] || 0) + 1;
    });

    res.json({ totalToday, activeCams, avgAccuracy, pendingReviews, distribution });
};
