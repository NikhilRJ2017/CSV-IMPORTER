const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    // used to calculate hasActiveClientPolicy
    userType: {
        type: String,
        required: true
    },

    userAccount: {
        type: mongoose.Types.ObjectId,
        ref: "UserAccount"
    },

    name: {
        type: String,
        required: String
    },

    email: {
        type: String,
    },

    gender: {
        type: String
    },

    phone: {
        type: String,
        required: true
    },

    dob: {
        type: String,
        required: true
    },

    state: {
        type: String,
    },

    city: {
        type: String,
    },

    address: {
        type: String,
    },

    zip: {
        type: String
    },

    primary: {
        type: String
    }

});

// ******************* DANGER *******************//
// UserSchema.pre('remove', async function () { 
//     await this.model('Policy').deleteOne({ user: this._id });
// })

const User = mongoose.model('User', UserSchema);
module.exports = User;