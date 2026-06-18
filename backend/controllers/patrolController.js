const patrolService = require('../services/patrolService');

exports.getPatrols = async (req, res) => {
    const data = await patrolService.getAll();
    res.json(data);
};

exports.dispatchPatrol = async (req, res) => {
    const { officerName, status } = req.body;
    const data = await patrolService.updateStatus(officerName, status);
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, patrol: data });
};
