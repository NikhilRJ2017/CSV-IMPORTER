const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    //before filling category fetch all category map it to data coming from csv and then take their id and put it into this schema
    category: {
        type: [mongoose.Types.ObjectId],
        ref: "Category"
    }
});

const Company = mongoose.model('Company', CompanySchema);
module.exports = Company;