const config = require('./../configurations/config')
const dbConnection = require('./../database/DBConnection')

module.exports.validateFetchNotificationRequest = async (req, res, next) => {
    let requestBody = req.body;
    if (requestBody.companyId == undefined || requestBody.companyId == null || requestBody.companyId.trim() == "") {
        return res.status(500).send({ 'msg': 'companyId is required' });
    } else {
        next();
    }
}

exports.fetchNotificationList = async (req, res) => {

    let requestBody = req.body;

    let companyId = requestBody.companyId ? requestBody.companyId.trim() : null;
    let departmentId = requestBody.departmentId ? requestBody.departmentId.trim() : null;
    let designationId = requestBody.designationId ? requestBody.designationId.trim() : null;

    let notificationQuery =
        `SELECT
        nots.id as notificationId,
        nots.msg as msg,
        nots.priority as priority,
        person.name as createdBy,
        nots.createdAt as createdAt
    FROM 
        notifications as nots
        LEFT JOIN
        employees as emp 
        ON emp.id = nots.createdBy
        LEFT JOIN
        persons as person 
        ON emp.personId = person.id
    WHERE true`;

    let whereClause = "";

    
    console.log("notificationQuery", notificationQuery);

    let [notificationQueryResult,] = await dbConnection.getDBConnection().query(notificationQuery);

    if (notificationQueryResult.length == 0) {
        return res.status(200).send({ 'data': [], 'msg': 'No designations found' });
    } else {
        return res.status(200).send({ 'data': notificationQueryResult, 'msg': 'Notifications list fetched successfully' });
    }

}


module.exports.validateAddNotificationsRequest = async (req, res, next) => {
    let requestBody = req.body;

    if (requestBody.companyId == undefined || requestBody.companyId == null || requestBody.companyId.trim() == "") {
        return res.status(500).send({ 'msg': 'companyId is required' });
    } else if (requestBody.departmentId == undefined || requestBody.departmentId == null || requestBody.departmentId.trim() == "") {
        return res.status(500).send({ 'msg': 'departmentId is required' });
    } else if (requestBody.designationId == undefined || requestBody.designationId == null || requestBody.designationId.trim() == "") {
        return res.status(500).send({ 'msg': 'designationId is required' });
    } else if (requestBody.msg == undefined || requestBody.msg == null || requestBody.msg.trim() == "") {
        return res.status(500).send({ 'msg': 'msg is required' });
    } else if (requestBody.priority == undefined || requestBody.priority == null || requestBody.priority.trim() == "") {
        return res.status(500).send({ 'msg': 'priority is required' });
    }else if (requestBody.createdBy == undefined || requestBody.createdBy == null || requestBody.createdBy.trim() == "") {
        return res.status(500).send({ 'msg': 'createdBy is required' });
    } else {
        next();
    }
}


module.exports.addNotification = async (req, res) => {

    let requestBody = req.body;
    let designationId = requestBody.designationId != '-1' ? requestBody.designationId.trim() : null;
    let companyId = requestBody.companyId.trim();
    let departmentId = requestBody.departmentId != '-1' ? requestBody.departmentId.trim() : null;
    let msg = requestBody.msg.trim();
    let priority = requestBody.priority.trim();
    let createdBy = requestBody.createdBy.trim();

    let notificationInsertQuery =
        `INSERT INTO \`notifications\`
             (\`msg\`, \`employeeId\`, \`designationId\`, \`departmentId\`, \`createdBy\`, \`priority\`)
         VALUES ('${msg}', NULL, ${designationId == null? 'NULL': "'"+designationId+"'"}, ${departmentId == null? 'NULL': "'"+departmentId+"'"}, '${createdBy}', '${priority}')`;
    

    let [notificationInsertQueryResult,] = await dbConnection.getDBConnection().query(notificationInsertQuery);

    console.log("notificationInsertQueryResult", notificationInsertQueryResult);

    if (notificationInsertQueryResult.affectedRows == 1) {
        return res.status(200).send({ 'msg': 'Notification created successfully' });
    } else {
        return res.status(500).send({ 'msg': 'Database integrity failed' });
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

    if (designationDeleteQueryResult.affectedRows == 1) {
        return res.status(200).send({ 'msg': 'Designation deleted successfully' });
    } else {
        return res.status(500).send({ 'msg': 'Database integrity failed' });
    }


}


