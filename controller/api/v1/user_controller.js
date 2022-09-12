const { StatusCodes } = require("http-status-codes");
const { NotFound, BadRequest } = require("../../../config/errors");
const User = require("../../../models/User");
const UserAccount = require("../../../models/UserAccount");

// ************************* get all users ************************//
const getAllUser = async (req, res) => {
    const users = await User.find({}).populate({ path: 'userAccount', select: 'name'});
    res.status(StatusCodes.OK).json({
        message: "Success",
        count: users.length,
        users: users
    })
}

// *********************** get specific user ************************//
const getUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    if (!user) {
        throw new NotFound(`User with id ${id} not found`)
    }

    await user.populate({ path: 'userAccount', select: 'name' });
    res.status(StatusCodes.OK).json({
        message: "Success",
        user: user
    })
}

// ********************** create new user ************************//
const createUser = async (req, res) => {

    const {
        userType, 
        userAccount,
        name,
        email,
        gender,
        phone,
        dob,
        state,
        city,
        address,
        zip,
        primary
    } = req.body;

    // checking for required fields
    if (!userType || !userAccount || !name || !phone || !dob) {
        throw new BadRequest("Please provide required fields: userType, userAccount, name, phone, dob");
    }

    const isUserAccountExist = await UserAccount.findOne({ _id: userAccount });
    if (!isUserAccountExist) {
        throw new NotFound(`UserAccount with id ${userAccount} not found`)
    }

    const user = await User.create({
        userType,
        userAccount,
        name,
        email,
        gender,
        phone,
        dob,
        state,
        city,
        address,
        zip,
        primary
    });

    res.status(StatusCodes.CREATED).json({
        message: "Success",
        user: user
    })

}

// *********************** DANGER: delete specific user **********************//
const deleteUser = async (req, res) => {
    const { id } = req.params;
    // let user = await User.findOne({ _id: id });
    // if (!user) {
    //     throw new NotFound(`User with id ${id} not found`)
    // }

    // await user.remove()
    res.status(StatusCodes.OK).json({
        message: "Success - For more, please go through user_controller.js"
    })
}

// ************************** update specific user ***************************//
const updateUser = async (req, res) => {

    // checking if user exists
    const { id } = req.params;
    let user = await User.findOne({ _id: id });
    if (!user) {
        throw new NotFound(`User with id ${id} not found`)
    }

    const {
        userType,
        name,
        email,
        gender,
        phone,
        dob,
        state,
        city,
        address,
        zip,
        primary
    } = req.body;

    const updateFields = {};

    if (userType) {
        updateFields.userType = userType
    }
    if (name) {
        updateFields.name = name
    }
    if (email) {
        updateFields.email = email
    }
    if (gender) {
        updateFields.gender = gender
    }
    if (phone) {
        updateFields.phone = phone
    }
    if (dob) {
        updateFields.dob = dob
    }
    if (state) {
        updateFields.state = state
    }
    if (city) {
        updateFields.city = city
    }
    if (address) {
        updateFields.address = address
    }
    if (zip) {
        updateFields.zip = zip
    }
    if (primary) {
        updateFields.primary = primary
    }

    user = await User.findOneAndUpdate({ _id: id }, updateFields, { runValidators: true, new: true });

    res.status(StatusCodes.OK).json({
        message: "Success",
        user: user
    })
}

module.exports = {
    getUser,
    createUser,
    deleteUser,
    updateUser,
    getAllUser
}