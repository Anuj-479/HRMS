const config = require('./../configurations/config')
const dbConnection = require('./../database/DBConnection')

module.exports.validateFetchDepartmentsRequest = async (req, res, next) => {
    let requestBody = req.body;

    if (requestBody.companyId == undefined || requestBody.companyId == null || requestBody.companyId.trim() == "") {
        return res.status(500).send({ 'msg': 'companyId is required' });
    } else {
        next();
    }
}

exports.fetchDepartmentsList = async (req, res) => {

    let requestBody = req.body;

    let companyId = requestBody.companyId.trim();

    let departmentQuery =
        `SELECT
        dep.id as departmentId,
        dep.name as departmentName,
        dep.abbreviation as departmentNameAbbr,
        dep.companyId as companyId,
        c.name as companyName,
        c.abbreviation as companyNameAbbr
    FROM 
        departments as dep 
        LEFT JOIN 
        companies as c 
        ON dep.companyId = c.id 
    WHERE c.id = '${companyId}';`;


    let [departmentQueryResult,] = await dbConnection.getDBConnection().query(departmentQuery);

    if (departmentQueryResult.length == 0) {
        return res.status(200).send({ 'data': [], 'msg': 'No departments found' });
    } else {
        return res.status(200).send({ 'data': departmentQueryResult, 'msg': 'Departments list fetched successfully' });
    }

}


module.exports.validateAddEditDepartmentRequest = async (req, res, next) => {
    let requestBody = req.body;

    if (requestBody.companyId == undefined || requestBody.companyId == null || requestBody.companyId.trim() == "") {
        return res.status(500).send({ 'msg': 'companyId is required' });
    } else if (requestBody.departmentName == undefined || requestBody.departmentName == null || requestBody.departmentName.trim() == "") {
        return res.status(500).send({ 'msg': 'departmentName is required' });
    } else if (requestBody.departmentAbbr == undefined || requestBody.departmentAbbr == null || requestBody.departmentAbbr.trim() == "") {
        return res.status(500).send({ 'msg': 'departmentAbbr is required' });
    } else {
        next();
    }
}


module.exports.addEditDepartment = async (req, res) => {

    let requestBody = req.body;
    
    let departmentId = requestBody.departmentId? requestBody.departmentId.trim(): null;
    let companyId = requestBody.companyId.trim();
    let departmentName = requestBody.departmentName.trim();
    let departmentAbbr = requestBody.departmentAbbr.trim();

    if (departmentId) {

        let departmentUpdateQuery =
            `UPDATE 
                departments 
            SET 
                name='${departmentName}',
                abbreviation='${departmentAbbr}' 
            WHERE 
                departments.id = '${departmentId}';`;

        let [departmentUpdateQueryResult,] = await dbConnection.getDBConnection().query(departmentUpdateQuery);

        //console.log("departmentUpdateQueryResult", departmentUpdateQueryResult);

        if(departmentUpdateQueryResult.affectedRows == 1){
            return res.status(200).send({ 'msg': 'Department updated successfully' });
        }else{
            return res.status(500).send({ 'msg': 'Database integrity failed' });
        }

    } else {

        let departmentInsertQuery =
            `INSERT INTO departments 
                (\`name\`, \`abbreviation\`, \`companyId\`, \`employeeCodeSuffix\`)
            VALUES 
                ('${departmentName}', '${departmentAbbr}', '${companyId}', '${departmentAbbr}');`

        let [departmentInsertQueryResult,] = await dbConnection.getDBConnection().query(departmentInsertQuery);

        console.log("departmentInsertQueryResult", departmentInsertQueryResult);

        if(departmentInsertQueryResult.affectedRows == 1){
            return res.status(200).send({ 'msg': 'Department created successfully' });
        }else{
            return res.status(500).send({ 'msg': 'Database integrity failed' });
        }

    }


}


module.exports.validateDeleteDepartmentRequest = async (req, res, next) => {
    let requestBody = req.body;

    if (requestBody.departmentId == undefined || requestBody.departmentId == null || requestBody.departmentId.trim() == "") {
        return res.status(500).send({ 'msg': 'departmentId is required' });
    } else {
        next();
    }
}

module.exports.deleteDepartment = async (req, res) => {

    let requestBody = req.body;
    
    let departmentId = requestBody.departmentId.trim();

    let departmentDeleteQuery =
        `DELETE FROM 
            departments 
        WHERE 
            departments.id = '${departmentId}';`;

    let [departmentDeleteQueryResult,] = await dbConnection.getDBConnection().query(departmentDeleteQuery);

    //console.log("departmentUpdateQueryResult", departmentUpdateQueryResult);

    if(departmentDeleteQueryResult.affectedRows == 1){
        return res.status(200).send({ 'msg': 'Department deleted successfully' });
    }else{
        return res.status(500).send({ 'msg': 'Database integrity failed' });
    }


}


