const violationService = require('../services/violationService');

exports.getViolations = async (req, res) => {
    const data = await violationService.getAll();
    res.json(data);
};

exports.getViolationById = async (req, res) => {
    const data = await violationService.getById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
};

exports.createViolation = async (req, res) => {
    const data = await violationService.create(req.body);
    res.json({ success: true, violation: data });
};

exports.reviewViolation = async (req, res) => {
    const { id, status, updatedPlate } = req.body;
    const data = await violationService.updateReview(id, status, updatedPlate);
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, violation: data });
};

exports.getRiskScore = async (req, res) => {
    const data = await violationService.calculateRiskScore(req.params.plate);
    res.json(data);
};

exports.getOffenders = async (req, res) => {
    const violationsList = await violationService.getAll();
    const offenderMap = {};
    violationsList.forEach(v => {
        if (!offenderMap[v.plateNumber]) offenderMap[v.plateNumber] = [];
        offenderMap[v.plateNumber].push(v);
    });

    const list = await Promise.all(Object.keys(offenderMap).map(async (plate) => {
        const riskData = await violationService.calculateRiskScore(plate);
        return { plateNumber: plate, violations: offenderMap[plate], ...riskData };
    }));

    list.sort((a, b) => b.score - a.score);
    res.json(list);
};
