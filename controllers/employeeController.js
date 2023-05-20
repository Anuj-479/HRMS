const config = require('./../configurations/config')
const dbConnection = require('./../database/DBConnection')

const validateFetchEmployeeRequest = async (req, res, next) => {
    let requestBody = req.body;

    if (requestBody.companyId == undefined || requestBody.companyId == null || requestBody.companyId.trim() == "") {
        return res.status(500).send({ 'msg': 'companyId is required' });
    } else {
        next();
    }
}

const fetchEmployeesList = async (req, res) => {

    let requestBody = req.body;

    let companyId = requestBody.companyId.trim();

    let employeeQuery = `SELECT 
        e.id as employeeId,    
        e.personId,
        e.companyId,
        e.departmentId,
        e.designationId,
        e.uanNo,
        e.companyEmployeeId,
        e.bankDetailsId,
        e.joiningDate,
        p.name as personName,
        p.dob as personDOB,
        p.gender as personGender,
        p.mobileNo as personMobileNo,
        p.alternateMobileNo as personAlternateMobileNo,
        p.email as personEmail,
        dep.name as departmentName,
        dep.abbreviation as departmentNameAbbr,
        des.name as designationName,
        des.abbreviation as designationNameAbbr,
        company.name as companyName,
        company.abbreviation as companyNameAbbr,
        bank.id as bankDetailsId,
        bank.bankName as bankName,
        bank.bankBranchName as bankBranchName,
        bank.ifsc as bankIfscCode,
        bank.accountNo as bankAccountNo
    FROM 
        hrms_db.employees as e 
    LEFT JOIN 
        persons as p ON p.id = e.personId
    LEFT JOIN
        departments as dep ON e.departmentId = dep.id
    LEFT JOIN
        designations as des ON e.designationId = des.id
    LEFT JOIN
        companies as company ON e.companyId = company.id
    LEFT JOIN
        bank_accounts as bank ON e.bankDetailsId = bank.id
    WHERE 
        e.companyId = '${companyId}';`;

    let [employeeQueryResult,] = await dbConnection.getDBConnection().query(employeeQuery);

    if (employeeQueryResult.length == 0) {
        return res.status(200).send({ 'data': [], 'msg': 'No employees found' });
    } else {
        return res.status(200).send({ 'data': employeeQueryResult, 'msg': 'Employees list fetched successfully' });
    }

}


const validateAddEditEmployeeRequest = async (req, res, next) => {
    let requestBody = req.body;

    if (requestBody.name == undefined || requestBody.name == null || requestBody.name.trim() == "") {
        return res.status(500).send({ 'msg': 'name is required' });
    } else if (requestBody.gender == undefined || requestBody.gender == null || requestBody.gender.trim() == "") {
        return res.status(500).send({ 'msg': 'gender is required' });
    } else if (requestBody.mobile == undefined || requestBody.mobile == null || requestBody.mobile.trim() == "") {
        return res.status(500).send({ 'msg': 'mobile is required' });
    } else if (requestBody.email == undefined || requestBody.email == null || requestBody.email.trim() == "") {
        return res.status(500).send({ 'msg': 'email is required' });
    } else if (requestBody.companyId == undefined || requestBody.companyId == null || requestBody.companyId.trim() == "") {
        return res.status(500).send({ 'msg': 'companyId is required' });
    } else if (requestBody.departmentId == undefined || requestBody.departmentId == null || requestBody.departmentId.trim() == "") {
        return res.status(500).send({ 'msg': 'departmentId is required' });
    } else if (requestBody.designationId == undefined || requestBody.designationId == null || requestBody.designationId.trim() == "") {
        return res.status(500).send({ 'msg': 'designationId is required' });
    } else if (requestBody.doj == undefined || requestBody.doj == null || requestBody.doj.trim() == "") {
        return res.status(500).send({ 'msg': 'doj is required' });
    } else {
        next();
    }
}


const addEditEmployee = async (req, res) => {

    let requestBody = req.body;

    let employeeId = requestBody.employeeId? requestBody.employeeId.trim(): null;
    let personId =  requestBody.personId ? requestBody.personId.trim() : null;

    let name = requestBody.name.trim();
    let gender = requestBody.gender.trim();
    let mobile = requestBody.mobile.trim();
    let email = requestBody.email.trim();
    let companyId = requestBody.companyId.trim();
    let departmentId = requestBody.departmentId.trim();
    let designationId = requestBody.designationId.trim();
    let doj = requestBody.doj.trim();


    let dob = requestBody.dob ? requestBody.dob.trim() : null;
    let altMobile = requestBody.altMobile ? requestBody.altMobile.trim() : null;
    let uanNo = requestBody.uanNo ? requestBody.uanNo.trim() : null;

    let bankDetailsId = requestBody.bankDetailsId ? requestBody.bankDetailsId.trim() : null;
    let bankName = requestBody.bankName ? requestBody.bankName.trim() : null;
    let bankBranch = requestBody.bankBranch ? requestBody.bankBranch.trim() : null;
    let ifscCode = requestBody.ifscCode ? requestBody.ifscCode.trim() : null;
    let accountNo = requestBody.accountNo ? requestBody.accountNo.trim() : null;

    if (employeeId && personId) {

        let conn = await dbConnection.getDBConnection().getConnection();
        try{
            await conn.beginTransaction();
                     
            let newBankDetailsId = null;

            if(bankName && bankBranch && ifscCode && accountNo){
                if(bankDetailsId){
                    //UPDATE bank details
                    let bankUpdateQuery = `UPDATE 
                        bank_accounts
                    SET 
                        bankName='${bankName}',
                        bankBranchName='${bankBranch}',
                        ifsc='${ifscCode}',
                        accountNo='${accountNo}'
                    WHERE 
                        bank_accounts.id = '${bankDetailsId}'
                    ;`;

                    let [bankUpdateResult,] = await conn.query(bankUpdateQuery);
                    newBankDetailsId = bankDetailsId;
                    console.log("newBankDetailsId", newBankDetailsId);
                }else{
                    //INSERT bank details
                    let bankInsertQuery = `INSERT INTO 
                        bank_accounts 
                        (\`bankName\`, \`bankBranchName\`, \`ifsc\`, \`accountNo\`) 
                    VALUES 
                        ('${bankName}', '${bankBranch}', '${ifscCode}', '${accountNo}'); `;

                    let [bankInsertResult,] = await conn.query(bankInsertQuery);

                    newBankDetailsId = bankInsertResult.insertId;
                    console.log("newBankDetailsId insert", newBankDetailsId);

                }

            }

            let personUpdateQuery =
                `UPDATE 
                    persons
                SET 
                    name='${name}',
                    gender='${gender}',
                    mobileNo='${mobile}',
                    dob=${dob == null? 'NULL': "'"+dob+"'"},
                    alternateMobileNo=${altMobile == null? 'NULL': "'"+altMobile+"'"},
                    email='${email}'
                WHERE 
                    persons.id = '${employeeId}'
                ;`;

            console.log("personUpdateQuery ", personUpdateQuery);


            let [personUpdateResult,] = await conn.query(personUpdateQuery);            
            console.log("personUpdateResult ", personUpdateResult);

            let employeeUpdateQuery = `UPDATE 
                    employees
                SET 
                    joiningDate='${doj}',
                    departmentId='${departmentId}',
                    designationId='${designationId}',
                    uanNo=${uanNo == null? 'NULL': "'"+uanNo+"'"},
                    bankDetailsId = '${newBankDetailsId}'
                WHERE 
                    employees.id = '${personId}'
                ;`;

            console.log("employeeUpdateQuery ", employeeUpdateQuery);

            let [employeeUpdateResult,] = await conn.query(employeeUpdateQuery);
            console.log("employeeUpdateResult ", employeeUpdateResult);

            await conn.commit();

            return res.status(200).send({ 'msg': 'Employee data updated' });

        }catch(e){
            await conn.rollback();
            return res.status(500).send({ 'msg': 'Database integrity failed' });
        }
        
    } else {

        let conn = await dbConnection.getDBConnection().getConnection();
        try{
            await conn.beginTransaction();

            let newBankDetailsId = null;

            if(bankName && bankBranch && ifscCode && accountNo){
                //INSERT bank details
                let bankInsertQuery = `INSERT INTO 
                bank_accounts 
                (\`bankName\`, \`bankBranchName\`, \`ifsc\`, \`accountNo\`) 
                VALUES 
                ('${bankName}', '${bankBranch}', '${ifscCode}', '${accountNo}'); `;

                let [bankInsertResult,] = await conn.query(bankInsertQuery);

                newBankDetailsId = bankInsertResult.insertId;

            }

            let personInsertQuery =
                `INSERT INTO 
                persons 
                (\`name\`, \`dob\`, \`gender\`, \`mobileNo\`, \`alternateMobileNo\`, \`email\`) 
                VALUES 
                ('${name}', ${dob == null? 'NULL': "'"+dob+"'"}, '${gender}', '${mobile}', ${altMobile == null? 'NULL': altMobile}, '${email}');`

            let [personInsertResult,] = await conn.query(personInsertQuery);
            let newPersonId = personInsertResult.insertId;

            let employeeInsertQuery = `INSERT INTO 
            employees 
            (\`personId\`, \`companyId\`, \`departmentId\`, \`designationId\`, \`uanNo\`, \`bankDetailsId\`, \`joiningDate\`) 
            VALUES ('${newPersonId}', '${companyId}', '${departmentId}', '${designationId}', ${uanNo == null? 'NULL': uanNo}, ${newBankDetailsId == null? 'NULL': newBankDetailsId}, '${doj}');`

            let [employeeInsertResult,] = await conn.query(employeeInsertQuery);

            let credentialInsertQuery = `INSERT INTO 
            credentials 
            (\`username\`, \`password\`, \`personId\`, \`role\`) 
            VALUES ('${email}', '${config.defaultPassword}', '${newPersonId}', 'employee');`

            let [credentialInsertResult,] = await conn.query(credentialInsertQuery);
            
            await conn.commit();
            return res.status(200).send({ 'msg': 'Employee data created' });

        }catch(e){
            console.log("Error", e);
            await conn.rollback();
            return res.status(500).send({ 'msg': 'Database integrity failed' });
        }

    }


}



module.exports = {
    fetchEmployeesList,
    validateFetchEmployeeRequest,
    validateAddEditEmployeeRequest,
    addEditEmployee
}