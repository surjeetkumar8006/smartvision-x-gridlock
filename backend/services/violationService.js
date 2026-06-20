const Violation = require('../models/Violation');
const fallback = require('./fallbackService');

let isUsingMongoDB = false;

module.exports = {
    setMongoStatus: (status) => { isUsingMongoDB = status; },
    
    getAll: async () => {
        if (isUsingMongoDB) {
            try { 
                let list = await Violation.find().sort({ timestamp: -1 }); 
                if (list.length === 0) {
                    const seedData = require('./seedData');
                    await Violation.insertMany(seedData.violations);
                    list = await Violation.find().sort({ timestamp: -1 });
                }
                return list;
            } 
            catch (e) { console.error('MongoDB fallback:', e); }
        }
        return fallback.getViolations();
    },

    getById: async (id) => {
        if (isUsingMongoDB) {
            try { return await Violation.findOne({ id }); } 
            catch (e) { console.error('MongoDB fallback:', e); }
        }
        return fallback.getViolations().find(v => v.id === id);
    },

    create: async (data) => {
        if (isUsingMongoDB) {
            try {
                const newVio = new Violation(data);
                await newVio.save();
                return newVio;
            } catch (e) { console.error('MongoDB fallback:', e); }
        }
        const list = fallback.getViolations();
        list.unshift(data);
        fallback.saveViolations(list);
        return data;
    },

    updateReview: async (id, status, updatedPlate) => {
        if (isUsingMongoDB) {
            try {
                const fields = { status };
                if (updatedPlate) fields.plateNumber = updatedPlate;
                return await Violation.findOneAndUpdate({ id }, { $set: fields }, { new: true });
            } catch (e) { console.error('MongoDB fallback:', e); }
        }
        const list = fallback.getViolations();
        const v = list.find(v => v.id === id);
        if (v) {
            v.status = status;
            if (updatedPlate) v.plateNumber = updatedPlate;
            fallback.saveViolations(list);
        }
        return v;
    },

    calculateRiskScore: async (plateNumber) => {
        let offenderViolations = [];
        if (isUsingMongoDB) {
            try { offenderViolations = await Violation.find({ plateNumber }); } 
            catch (e) { offenderViolations = fallback.getViolations().filter(v => v.plateNumber === plateNumber); }
        } else {
            offenderViolations = fallback.getViolations().filter(v => v.plateNumber === plateNumber);
        }

        const count = offenderViolations.length;
        let severityScore = 0;
        offenderViolations.forEach(v => {
            if (["Wrong Side Driving", "Red Light Violation", "Triple Riding"].includes(v.violationType)) {
                severityScore += 25;
            } else {
                severityScore += 10;
            }
        });

        const score = Math.min(100, (count * 15) + severityScore);
        let category = "Low Risk";
        if (score > 80) category = "Critical";
        else if (score > 50) category = "High Risk";
        else if (score > 20) category = "Medium Risk";

        return { score, category, totalViolations: count, isRepeatOffender: count > 1 };
    }
};
