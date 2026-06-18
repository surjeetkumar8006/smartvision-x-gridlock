const Patrol = require('../models/Patrol');
const fallback = require('./fallbackService');

let isUsingMongoDB = false;

module.exports = {
    setMongoStatus: (status) => { isUsingMongoDB = status; },
    
    getAll: async () => {
        if (isUsingMongoDB) {
            try { return await Patrol.find(); } 
            catch (e) { console.error('MongoDB fallback:', e); }
        }
        return fallback.getPatrols();
    },

    updateStatus: async (name, status) => {
        if (isUsingMongoDB) {
            try {
                return await Patrol.findOneAndUpdate({ name }, { $set: { status } }, { new: true });
            } catch (e) { console.error('MongoDB fallback:', e); }
        }
        const list = fallback.getPatrols();
        const p = list.find(p => p.name === name);
        if (p) {
            p.status = status;
            fallback.savePatrols(list);
        }
        return p;
    }
};
