const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
    policyMode: {
        type: Number,
        required: true
    },

    policyNumber: {
        type: String,
        unique: true,
        required: true
    },

    premiun_amount: {
        type: Number,
        required: true
    },

    premiun_amount_written: {
        type: String,
        default: 0
    },

    policyType: {
        type: String,
        required: true
    },

    producer: {
        type: String,
        required: true
    },

    company: {
        type: mongoose.Types.ObjectId,
        ref: 'Company',
        required: true
    },

    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: true
    },

    policyStartDate: {
        type: String,
        required: true,
    },

    policyEndDate: {
        type: String,
        required: true,
    },

    csr: {
        type: String,
        required: true
    },

    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },

    agent: {
        type: mongoose.Types.ObjectId,
        ref: "Agent",
        required: true
    }

});

const Policy = mongoose.model('Policy', PolicySchema);
module.exports = Policy;