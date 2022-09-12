const mongoose = require('mongoose');

const UserAccountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    accountType: {
        type: String,
        required: true
    },

    // has to be calculated using aggregate function
    hasActiveClientPolicy: {
        type: String
    },

    company: {
        type: mongoose.Types.ObjectId,
        ref: 'Company',
        required: true
    }

});

UserAccountSchema.pre('remove', async function () {
    /*
        1) find users with this userAccount 
        2) delete all users using remove (as there is a pre-hook on removing user)
     */
})

const UserAccount = mongoose.model('UserAccount', UserAccountSchema);
module.exports = UserAccount;