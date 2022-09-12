const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../../../config/errors");
const Agent = require("../../../models/Agent");
const Category = require("../../../models/Category");
const Company = require("../../../models/Company");
const Policy = require("../../../models/Policy");
const User = require("../../../models/User");

// ********************** get all policy ************************//
const getAllPolicy = async (req, res) => {
    const policies = await Policy.find({}).populate({ path: 'user agent company category', select: 'name' });
    res.status(StatusCodes.OK).json({
        message: "Success",
        count: policies.length,
        policies: policies
    })
}

// ********************** get specific policy ************************//
const getPolicy = async (req, res) => {
    const { id } = req.params;
    const policy = await Policy.findOne({ _id: id });
    if (!policy) {
        throw new NotFound(`Policy with id ${id} not found`)
    }

    await policy.populate({ path: 'user agent company category', select: 'name' });
    res.status(StatusCodes.OK).json({
        message: "Success",
        policy: policy
    })
}

// ********************* create policy *************************//
const createPolicy = async (req, res) => {
    const {
        policyMode,
        policyNumber,
        premiun_amount,
        premiun_amount_written,
        policyType,
        producer,
        company,
        category,
        policyStartDate,
        policyEndDate,
        csr,
        user,
        agent
    } = req.body;

    if (!policyMode || !policyNumber || !premiun_amount || !policyType
        || !producer || !company || !category || !policyStartDate
        || !policyEndDate || !csr || !user || !agent) {
        
        throw new BadRequest("Please provide all the required fields: policyMode, policyNumber, premiun_amount, policyType, producer, company, category, policyStartDate, policyEndDate, csr, user, agent")
    }

    // checking if company exist
    const isCompanyExists = await Company.findOne({ _id: company });
    if (!isCompanyExists) {
        throw new NotFound(`Company with id ${company} not found`);
    }

    // checking if category exist
    const isCategoryExists = await Category.findOne({ _id: category });
    if (!isCategoryExists) {
        throw new NotFound(`Category with id ${category} not found`);
    }

    // checking if user exist
    const isUserExists = await User.findOne({ _id: user });
    if (!isUserExists) {
        throw new NotFound(`User with id ${user} not found`);
    }

    // checking if agent exist
    const isAgentExists = await Agent.findOne({ _id: agent });
    if (!isAgentExists) {
        throw new NotFound(`Agent with id ${agent} not found`);
    }

    const policy = await Policy.create({
        policyMode,
        policyNumber,
        premiun_amount,
        premiun_amount_written,
        policyType,
        producer,
        company,
        category,
        policyStartDate,
        policyEndDate,
        csr,
        user,
        agent
    });

    res.status(StatusCodes.CREATED).json({
        message: "Success",
        policy: policy
    })

}

// ********************** DANGER: delete specific policy *************************//
const deletePolicy = async (req, res) => {
    const { id } = req.params;
    let policy = await Policy.findOne({ _id: id });
    if (!policy) {
        throw new NotFound(`Policy with id ${id} not found`)
    }

    await policy.remove();

    res.status(StatusCodes.OK).json({
        message: "Success"
    })
}

// ********************* update specific policy ***********************//
const updatePolicy = async (req, res) => {
    /**
     * What to update in policy? -> once created policy content cannot be changed, but
     * you can still update user details and it will get reflected in policy
     */
    res.status(StatusCodes.OK).json({
        message: "Success - For more, please go through policy_controller.js"
    })
}

module.exports = {
    getPolicy,
    createPolicy,
    deletePolicy,
    updatePolicy,
    getAllPolicy
}