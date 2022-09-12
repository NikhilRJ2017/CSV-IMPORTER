const { StatusCodes } = require('http-status-codes');
const { BadRequest, CustomError } = require('../../../config/errors');
const path = require('path');
const csv = require('csv-parser');
const fs = require('fs');
const Category = require('../../../models/Category');
const Company = require('../../../models/Company');
const Agent = require('../../../models/Agent');
const UserAccount = require('../../../models/UserAccount');
const User = require('../../../models/User');
const Policy = require('../../../models/Policy');


const fileUpload = async (req, res, next) => {
    if (!req.files) {
        throw new BadRequest("Please upload a file")
    }

    const file = req.files.file;
    if (!file.mimetype.endsWith('csv')) {
        throw new BadRequest("Please upload a csv file")
    }

    const filePath = path.join(__dirname, '../../../files/' + `${file.name}`);
    await file.mv(filePath);

    exportToBD(filePath, res, next);

    
}

function exportToBD(filePath, res, next) {
    let results = [];
    fs.createReadStream(filePath)
        .pipe(csv({
            mapHeaders: ({ header, index }) => header.toLowerCase()
        }))
        .on('headers', (headers) => {

        })
        .on('data', (data) => {
            results.push(data);

        })
        .on('end', async () => {
            try {
                // ********************** category **********************//
                let category = [];
                let uniqueCategories = await getUniqueCategories(results);

                if (uniqueCategories.length > 0) {
                    category = await Category.create(uniqueCategories);
                    console.log("Inside if ", category);
                }
                category = await Category.find({});

                // ********************** company ***********************//

                let company = [];
                let uniqueCompanies = await getUniqueCompanies(results);
                if (uniqueCompanies.length > 0) {
                    company = await Company.create(uniqueCompanies);
                    console.log("Inside if: ", company);
                }
                company = await Company.find({});

                // ********************** agent *********************//

                let agent = [];
                let uniqueAgents = await getUniqueAgents(results);
                if (uniqueAgents.length > 0) {
                    agent = await Agent.create(uniqueAgents);
                    console.log("Inside if: ", agent);
                }

                agent = await Agent.find({});

                // ********************** user account ********************//
                let useraccount = [];
                let uniqueUserAccount = await getUniqueUserAccount(results, company);
                if (uniqueUserAccount.length > 0) {
                    useraccount = await UserAccount.create(uniqueUserAccount);
                }
                useraccount = await UserAccount.find({});

                // ********************** user **********************//
                let user = [];
                let uniqueUser = await getUniqueUser(results, useraccount, company);
                if (uniqueUser.length > 0) {
                    user = await User.create(uniqueUser);
                }
                user = await User.find({});

                // ********************* policy **********************//
                let policy = [];
                let uniquePolicy = await getUniquePolicy(results, company, user, agent, category);
                if (uniquePolicy.length > 0) {
                    policy = await Policy.create(uniquePolicy);
                }
                policy = await Policy.find({});

                res.status(StatusCodes.OK).json({
                    message: "Success"
                })

            } catch (error) {
                console.log(error);
                next(error);

            }

        }).on('error', (error) => {
            console.log(error);
            next(error)
        });
}

// ********************* get unique categories ************************//
async function getUniqueCategories(results) {
    let categoryArrayCSV = results.map((row) => {
        return row.category_name;
    });

    let category = await Category.find({});
    let categoryArrayDB = category.map((item) => {
        return item.name;
    });
    categoryArrayCSV = [...new Set(categoryArrayCSV)];
    let uniqueCategories = categoryArrayCSV.filter(item => !categoryArrayDB.includes(item));
    uniqueCategories = getMappedToName(uniqueCategories);
    return uniqueCategories
}



// ************************* get unique companies *************************//
async function getUniqueCompanies(results) {
    let companyArrayCSV = results.map(row => row.company_name);
    companyArrayCSV = [...new Set(companyArrayCSV)];
    let companies = await Company.find({});
    let companyArrayDB = companies.map((item) => {
        return item.name;
    });
    let uniqueCompanies = companyArrayCSV.filter(item => !companyArrayDB.includes(item));
    uniqueCompanies = getMappedToName(uniqueCompanies)
    return uniqueCompanies;
}

// ************************* get unique agents ************************//
async function getUniqueAgents(results) {
    let agentsArrayCSV = results.map(row => row.agent);
    agentsArrayCSV = [...new Set(agentsArrayCSV)];
    let agents = await Agent.find({});
    let agentsArrayDB = agents.map(item => item.name);
    let uniqueAgents = agentsArrayCSV.filter(item => !agentsArrayDB.includes(item));
    uniqueAgents = getMappedToName(uniqueAgents);
    return uniqueAgents;
}

function getMappedToName(unique) {
    unique = unique.map((item) => { return { name: item } });
    return unique;
}

// ************************ get unique user account **************************//

async function getUniqueUserAccount(results, company) {
    let companyMap = new Map();
    for (let i = 0; i < company.length; i++) {
        companyMap.set(company[i].name, company[i]._id);
    }

    let userAccountCSV = results.map(row => [row.account_name, companyMap.get(row.company_name), row.account_type, row['hasactive clientpolicy']]);
    let userAccountDB = await UserAccount.find({});
    userAccountDB = userAccountDB.map(item => [item.name, item.company, item.accountType, item.hasActiveClientPolicy]);
    let userAccountDBMap = new Map();
    for (let i = 0; i < userAccountDB.length; i++) {
        userAccountDBMap.set(JSON.stringify(userAccountDB[i]), 1);
    }

    let uniqueUserAccount = [];
    for (let i = 0; i < userAccountCSV.length; i++) {
        if (!userAccountDBMap.has(JSON.stringify(userAccountCSV[i]))) {
            uniqueUserAccount.push(userAccountCSV[i]);
        }
    }

    uniqueUserAccount = uniqueUserAccount.map(item => {
        return {
            name: item[0],
            company: item[1],
            accountType: item[2],
            hasActiveClientPolicy: item[3]
        }
    });

    return uniqueUserAccount;
}

async function getUniqueUser(results, useraccount, company) {

    let companyMap = new Map();
    for (let i = 0; i < company.length; i++) {
        companyMap.set(JSON.stringify(company[i]._id), company[i].name);
    }

    let userAccountMap = new Map();
    for (let i = 0; i < useraccount.length; i++) {
        userAccountMap.set(JSON.stringify([useraccount[i].name, companyMap.get(JSON.stringify(useraccount[i].company))]), useraccount[i]._id);
    }

    let userArrayCSV = results.map(row => {
        return [
            row.firstname,
            row.email,
            userAccountMap.get(JSON.stringify([row.account_name, row.company_name])),
            row.usertype,
            row.gender,
            row.phone,
            row.dob,
            row.state,
            row.city,
            row.address,
            row.zip,
            row.primary
        ];
    });

    let userArrayDB = await User.find({});

    userArrayDB = userArrayDB.map(item => {
        return [
            item.name,
            item.email,
            item.userAccount,
            item.userType,
            item.gender,
            item.phone,
            item.dob,
            item.state,
            item.city,
            item.address,
            item.zip,
            item.primary
        ]
    })

    let userDBMap = new Map();
    for (let i = 0; i < userArrayDB.length; i++) {
        userDBMap.set(JSON.stringify(userArrayDB[i]), 1);
    }

    let uniqueUser = [];
    for (let i = 0; i < userArrayCSV.length; i++) {
        if (!userDBMap.has(JSON.stringify(userArrayCSV[i]))) {
            uniqueUser.push(userArrayCSV[i]);
        }
    }

    uniqueUser = uniqueUser.map(item => {
        return {
            name: item[0],
            email: item[1],
            userAccount: item[2],
            userType: item[3],
            gender: item[4],
            phone: item[5],
            dob: item[6],
            state: item[7],
            city: item[8],
            address: item[9],
            zip: item[10],
            primary: item[11]
        }
    });

    return uniqueUser;
}

// ************************* get unique policy **************************//
async function getUniquePolicy(results, company, user, agent, category) {
    let companyMap = new Map();
    for (let i = 0; i < company.length; i++) {
        companyMap.set(company[i].name, company[i]._id)
    }
    let userMap = new Map();
    for (let i = 0; i < user.length; i++) {
        userMap.set(user[i].name, user[i]._id)
    }
    let agentMap = new Map();
    for (let i = 0; i < agent.length; i++) {
        agentMap.set(agent[i].name, agent[i]._id)
    }

    let categoryMap = new Map();
    for (let i = 0; i < category.length; i++) {
        categoryMap.set(category[i].name, category[i]._id)
    }

    let policyArrayCSV = results.map(row => {
        return [
            row.policy_mode,
            row.policy_number,
            row.premium_amount,
            row.premium_amount_written,
            row.policy_type,
            row.producer,
            companyMap.get(row.company_name),
            categoryMap.get(row.category_name),
            row.policy_start_date,
            row. policy_end_date,
            row.csr,
            userMap.get(row.firstname),
            agentMap.get(row.agent)
        ]
    });

    let policyArrayDB = await Policy.find({});
    policyArrayDB = policyArrayDB.map(item => {
        return [
            item.policyMode,
            item.policyNumber,
            item.premiun_amount,
            item.premiun_amount_written,
            item.policyType,
            item.producer,
            item.company,
            item.category,
            item.policyStartDate,
            item.policyEndDate,
            item.csr,
            item.user,
            item.agent,
        ]
    });

    let policyDBMap = new Map();
    for (let i = 0; i < policyArrayDB.length; i++) {
        policyDBMap.set(JSON.stringify(policyArrayDB[i]), 1);
    }

    let uniquePolicy = [];
    for (let i = 0; i < policyArrayCSV.length; i++) {
        if (!policyDBMap.has(JSON.stringify(policyArrayCSV[i]))) {
            uniquePolicy.push(policyArrayCSV[i]);
        }
    }

    uniquePolicy = uniquePolicy.map(item => {
        return {
            policyMode: item[0],
            policyNumber: item[1],
            premiun_amount: item[2],
            premiun_amount_written: item[3],
            policyType: item[4],
            producer: item[5],
            company: item[6],
            category: item[7],
            policyStartDate: item[8],
            policyEndDate: item[9],
            csr: item[10],
            user: item[11],
            agent: item[12]
        }
    });

    return uniquePolicy;
}

module.exports = {
    fileUpload
}