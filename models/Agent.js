const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    company: {
        type: [mongoose.Types.ObjectId],
        ref: "Company"
    }
});

const Agent = mongoose.model('Agent', AgentSchema);
module.exports = Agent;