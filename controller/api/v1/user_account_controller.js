const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../../../config/errors");
const Company = require("../../../models/Company");
const UserAccount = require("../../../models/UserAccount");

// ************************ get all users account **************************//
const getAllUserAccount = async (req, res) => {
    const useraccounts = await UserAccount.find({}).populate({path: 'company', select: 'name'});
    res.status(StatusCodes.OK).json({
        message: "Success",
        count: useraccounts.length,
        userAccounts: useraccounts
    })
}

// ************************ get specific user account ***************************//
const getUserAccount = async (req, res) => { 
    const { id } = req.params;
    const userAccount = await UserAccount.findOne({ _id: id });
    if (!userAccount) {
        throw new NotFound(`UserAccount with id ${id} not found`)
    }

    await userAccount.populate({path: 'company', select: 'name'});
    res.status(StatusCodes.OK).json({
        message: "Success",
        user: userAccount
    })
}

// ************************ create user account **************************//
const createUserAccount = async (req, res) => {
    const {
        name,
        accountType,
        hasActiveClientPolicy,
        company
    } = req.body;

    if (!name || !accountType || !company) {
        throw new BadRequest('Please provide all the required fields: name, accountType, company')
    }

    const isCompanyExist = await Company.findOne({ _id: company });
    if (!isCompanyExist) {
        throw new NotFound(`Company with id ${company} not found`);
    }

    const useraccount = await UserAccount.create({
        name,
        accountType,
        hasActiveClientPolicy,
        company
    });

    res.status(StatusCodes.CREATED).json({
        message: "Success",
        userAccount: useraccount
    })

}

// ********************** DANGER: delete specific useraccount **********************//
const deleteUserAccount = async (req, res) => {
    const { id } = req.params;
    // let userAccount = await UserAccount.findOne({ _id: id });
    // if (!userAccount) {
    //     throw new NotFound(`userAccount with id ${id} not found`)
    // }

    // await userAccount.remove()
    res.status(StatusCodes.CREATED).json({
        message: "Success - For more, please go through user_account_controller.js"
    })
}

// ************************ update specific user account ***********************//
const updateUserAccount = async (req, res) => {

    // checking if useraccount exists
    const { id } = req.params;
    let userAccount = await UserAccount.findOne({ _id: id });
    if (!userAccount) {
        throw new NotFound(`userAccount with id ${id} not found`)
    }

    const {
        name,
        hasActiveClientPolicy
    } = req.body;

    const updateFields = {};

    if (name) {
        updateFields.name = name
    }
    if (hasActiveClientPolicy) {
        updateFields.hasActiveClientPolicy = hasActiveClientPolicy
    }

    userAccount = await UserAccount.findOneAndUpdate({ _id: id }, updateFields, { runValidators: true, new: true });

    res.status(StatusCodes.OK).json({
        message: "Success",
        userAccount: userAccount
    })
}

module.exports = {
    getUserAccount,
    createUserAccount,
    deleteUserAccount,
    updateUserAccount,
    getAllUserAccount
}