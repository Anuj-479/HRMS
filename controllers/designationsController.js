const config = require('./../configurations/config')
const dbConnection = require('./../database/DBConnection')

module.exports.validateFetchDesignationRequest = async (req, res, next) => {
    let requestBody = req.body;
    next();
}

exports.fetchDesignationsList = async (req, res) => {

    let requestBody = req.body;

    let companyId = requestBody.companyId? requestBody.companyId.trim(): null;
    let departmentId = requestBody.departmentId? requestBody.departmentId.trim(): null;

    let designationQuery =
    `SELECT
        des.id as designationId,
        des.name as designationName,
        des.abbreviation as designationNameAbbr,
        dep.id as departmentId,
        dep.name as departmentName,
        dep.abbreviation as departmentNameAbbr,
        c.id as companyId,
        c.name as companyName,
        c.abbreviation as companyNameAbbr
    FROM 
        designations as des
        LEFT JOIN
        departments as dep 
        ON des.departmentId = dep.id
        LEFT JOIN 
        companies as c 
        ON dep.companyId = c.id 
    WHERE true`;

    let whereClause = "";

    if(companyId){
        if(whereClause != ""){
            whereClause += " AND "
        }
        whereClause += ` des.companyId = '${companyId}' `;
    }
    if(departmentId){
        if(whereClause != ""){
            whereClause += " AND "
        }
        whereClause += ` dep.departmentId = '${departmentId}'`;
    }

    console.log("designationQuery", designationQuery);
    
    let [designationQueryResult,] = await dbConnection.getDBConnection().query(designationQuery);

    if (designationQueryResult.length == 0) {
        return res.status(200).send({ 'data': [], 'msg': 'No designations found' });
    } else {
        return res.status(200).send({ 'data': designationQueryResult, 'msg': 'Designations list fetched successfully' });
    }

}


module.exports.validateAddEditDesignationRequest = async (req, res, next) => {
    let requestBody = req.body;

    if (requestBody.companyId == undefined || requestBody.companyId == null || requestBody.companyId.trim() == "") {
        return res.status(500).send({ 'msg': 'companyId is required' });
    } else if (requestBody.departmentId == undefined || requestBody.departmentId == null || requestBody.departmentId.trim() == "") {
        return res.status(500).send({ 'msg': 'departmentId is required' });
    } else if (requestBody.designationName == undefined || requestBody.designationName == null || requestBody.designationName.trim() == "") {
        return res.status(500).send({ 'msg': 'designationName is required' });
    } else if (requestBody.designationAbbr == undefined || requestBody.designationAbbr == null || requestBody.designationAbbr.trim() == "") {
        return res.status(500).send({ 'msg': 'designationAbbr is required' });
    } else {
        next();
    }
}


module.exports.addEditDesignation = async (req, res) => {

    let requestBody = req.body;
    
    let designationId = requestBody.designationId? requestBody.designationId.trim(): null;
    let companyId = requestBody.companyId.trim();
    let departmentId = requestBody.departmentId.trim();
    let designationName = requestBody.designationName.trim();
    let designationAbbr = requestBody.designationAbbr.trim();

    if (designationId) {

        let designationUpdateQuery =
            `UPDATE 
                designations 
            SET 
                name='${designationName}',
                abbreviation='${designationAbbr}' 
            WHERE 
                designations.id = '${designationId}' 
                AND 
                designations.companyId = '${companyId}'
                AND 
                designations.departmentId = '${departmentId}'
            ;`;

        let [designationUpdateQueryResult,] = await dbConnection.getDBConnection().query(designationUpdateQuery);

        //console.log("departmentUpdateQueryResult", departmentUpdateQueryResult);

        if(designationUpdateQueryResult.affectedRows == 1){
            return res.status(200).send({ 'msg': 'Designation updated successfully' });
        }else{
            return res.status(500).send({ 'msg': 'Database integrity failed' });
        }

    } else {

        let designationInsertQuery =
            `INSERT INTO designations 
                (\`name\`, \`abbreviation\`, \`companyId\`, \`departmentId\`) 
            VALUES ('${designationName}', '${designationAbbr}', '${companyId}', '${departmentId}');`;

        let [designationInsertQueryResult,] = await dbConnection.getDBConnection().query(designationInsertQuery);

        console.log("designationInsertQueryResult", designationInsertQueryResult);

        if(designationInsertQueryResult.affectedRows == 1){
            return res.status(200).send({ 'msg': 'Designation created successfully' });
        }else{
            return res.status(500).send({ 'msg': 'Database integrity failed' });
        }

    }


}


module.exports.validateDeleteDesignationRequest = async (req, res, next) => {
    let requestBody = req.body;

    if (requestBody.designationId == undefined || requestBody.designationId == null || requestBody.designationId.trim() == "") {
        return res.status(500).send({ 'msg': 'designationId is required' });
    } else {
        next();
    }
}

module.exports.deleteDesignation = async (req, res) => {

    let requestBody = req.body;
    
    let designationId = requestBody.designationId.trim();

    let designationDeleteQuery =
        `DELETE FROM 
            designations
        WHERE 
            designations.id = '${designationId}';`;

    let [designationDeleteQueryResult,] = await dbConnection.getDBConnection().query(designationDeleteQuery);

    //console.log("departmentUpdateQueryResult", departmentUpdateQueryResult);

    if(designationDeleteQueryResult.affectedRows == 1){
        return res.status(200).send({ 'msg': 'Designation deleted successfully' });
    }else{
        return res.status(500).send({ 'msg': 'Database integrity failed' });
    }


}


