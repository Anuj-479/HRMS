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
        company.abbreviation as companyNameAbbr
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
    WHERE 
        e.companyId = '${companyId}';`;

    let [employeeQueryResult,] = await dbConnection.getDBConnection().query(employeeQuery);

    if(employeeQueryResult.length == 0){
        return res.status(200).send({ 'data': [], 'msg': 'No employees found' });
    }else {
        return res.status(200).send({ 'data': employeeQueryResult, 'msg': 'Employees list fetched successfully' });
    }

}



module.exports = {
    fetchEmployeesList,
    validateFetchEmployeeRequest
}