const config = require('./../configurations/config')
const dbConnection = require('./../database/DBConnection')


module.exports.validateFetchMyLeavesRequest = async (req, res, next) => {
    let requestBody = req.body;

    if (requestBody.employeeId == undefined || requestBody.employeeId == null || requestBody.employeeId.trim() == "") {
        return res.status(500).send({ 'msg': 'employeeId is required' });
    } else if (requestBody.companyId == undefined || requestBody.companyId == null || requestBody.companyId.trim() == "") {
        return res.status(500).send({ 'msg': 'companyId is required' });
    } else {
        next();
    }
}

exports.fetchMyLeavesList = async (req, res) => {

    let requestBody = req.body;

    let companyId = requestBody.companyId.trim();
    let employeeId = requestBody.employeeId.trim();

    let myLeavesQuery =
        `SELECT
        lr.id as leaveRequestId,
        lr.employeeId as employeeId,
        p.name as employeeName,
        lr.startDate as leaveRequestStartDate,
        lr.endDate as leaveRequestEndDate,
        lr.isApproved as isApproved,
        lr.markedBy as leaveRequestMarkedBy,
        l.approvedBy as leaveApprovedBy,
        p2.name as leaveRequestMarkedByName,
        l.startDate as leaveStartDate,
        l.endDate as leaveEndDate,
        l.approvedOn as leaveApprovedOn,
        l.cancelledOn as leaveCancelledOn,
        l.isCancelled as isCancelled,
        l.cancelledBy as cancelledBy,
        p3.name as cancelledByName
    FROM 
        leaves as l 
        LEFT JOIN
        leave_requests as lr ON lr.id = l.leaveRequestId
        LEFT JOIN
        employees as e ON e.id = lr.employeeId
        LEFT JOIN
        persons as p ON p.id = e.personId

        LEFT JOIN
        employees as e2 ON e2.id = lr.markedBy
        LEFT JOIN
        persons as p2 ON p2.id = e2.personId

        LEFT JOIN 
        employees as e3 ON e2.id = l.cancelledBy
        LEFT JOIN
        persons as p3 ON p3.id = e3.personId
    WHERE 
        l.employeeId = '${employeeId}' 
        AND 
        (
            l.startDate >= CURRENT_DATE()
            OR
            l.endDate >= CURRENT_DATE()
        )
        ;`;

    let leaveRequestsQuery =
        `SELECT
        lr.id as leaveRequestId,
        lr.employeeId as employeeId,
        p.name as employeeName,
        lr.startDate as leaveRequestStartDate,
        lr.endDate as leaveRequestEndDate,
        lr.isApproved as isApproved,
        lr.markedBy as leaveRequestMarkedBy,
        l.approvedBy as leaveApprovedBy,
        p2.name as leaveRequestMarkedByName,
        l.startDate as leaveStartDate,
        l.endDate as leaveEndDate,
        l.approvedOn as leaveApprovedOn
    FROM 
        leave_requests as lr 
        LEFT JOIN 
        leaves as l 
        ON lr.id = l.leaveRequestId
        LEFT JOIN
        employees as e ON e.id = lr.employeeId
        LEFT JOIN
        persons as p ON p.id = e.personId

        LEFT JOIN
        employees as e2 ON e2.id = lr.markedBy
        LEFT JOIN
        persons as p2 ON p2.id = e2.personId
    WHERE lr.employeeId = '${employeeId}';`;


    let [leaveRequestsQueryResult,] = await dbConnection.getDBConnection().query(leaveRequestsQuery);

    let [myLeavesQueryResult,] = await dbConnection.getDBConnection().query(myLeavesQuery);
    
    return res.status(200).send({ 'data': { myLeaves: myLeavesQueryResult, myLeaveRequests: leaveRequestsQueryResult }, 'msg': 'My Leaves list fetched successfully' });    

}


module.exports.validateFetchLeaveRequest = async (req, res, next) => {
    let requestBody = req.body;

    if (requestBody.employeeId == undefined || requestBody.employeeId == null || requestBody.employeeId.trim() == "") {
        return res.status(500).send({ 'msg': 'employeeId is required' });
    } else if (requestBody.companyId == undefined || requestBody.companyId == null || requestBody.companyId.trim() == "") {
        return res.status(500).send({ 'msg': 'companyId is required' });
    } else {
        next();
    }
}

exports.fetchLeaveRequestsList = async (req, res) => {

    let requestBody = req.body;

    let companyId = requestBody.companyId.trim();
    let employeeId = requestBody.employeeId.trim();


    let leaveRequestsQuery =
        `
        SELECT
        lr.id as leaveRequestId,
        lr.employeeId as employeeId,
        p.name as employeeName,
        lr.startDate as leaveRequestStartDate,
        lr.endDate as leaveRequestEndDate,
        lr.isApproved as isApproved,
        lr.markedBy as leaveRequestMarkedBy,
        l.approvedBy as leaveApprovedBy,
        p2.name as leaveRequestMarkedByName,
        l.startDate as leaveStartDate,
        l.endDate as leaveEndDate,
        l.approvedOn as leaveApprovedOn,
        dep.name as departmentName,
        dep.abbreviation as departmentNameAbbr,
        des.name as designationName,
        des.abbreviation as designationNameAbbr
    FROM 
        leave_requests as lr 
        LEFT JOIN 
        leaves as l 
        ON lr.id = l.leaveRequestId
        LEFT JOIN
        employees as e ON e.id = lr.employeeId
        LEFT JOIN
        persons as p ON p.id = e.personId
        LEFT JOIN 
        departments as dep ON dep.id = e.departmentId
        LEFT JOIN 
        designations as des ON des.id = e.designationId
        LEFT JOIN
        employees as e2 ON e2.id = lr.markedBy
        LEFT JOIN
        persons as p2 ON p2.id = e2.personId
    WHERE true OR lr.id <> '${employeeId}';`;


    let [leaveRequestsQueryResult,] = await dbConnection.getDBConnection().query(leaveRequestsQuery);

    if (leaveRequestsQueryResult.length == 0) {
        return res.status(200).send({ 'data': [], 'msg': 'No departments found' });
    } else {
        return res.status(200).send({ 'data': leaveRequestsQueryResult, 'msg': 'Leave requests list fetched successfully' });
    }

}

module.exports.validateCreateLeaveRequest = async (req, res, next) => {
    let requestBody = req.body;

    if (requestBody.employeeId == undefined || requestBody.employeeId == null || requestBody.employeeId.trim() == "") {
        return res.status(500).send({ 'msg': 'employeeId is required' });
    } else if (requestBody.companyId == undefined || requestBody.companyId == null || requestBody.companyId.trim() == "") {
        return res.status(500).send({ 'msg': 'companyId is required' });
    } else if (requestBody.startDate == undefined || requestBody.startDate == null || requestBody.startDate.trim() == "") {
        return res.status(500).send({ 'msg': 'startDate is required' });
    } else if (requestBody.endDate == undefined || requestBody.endDate == null || requestBody.endDate.trim() == "") {
        return res.status(500).send({ 'msg': 'endDate is required' });
    } else {
        next();
    }
}

module.exports.createLeaveRequest = async (req, res, next) => {

    let requestBody = req.body;

    let companyId = requestBody.companyId ? requestBody.companyId.trim() : null;
    let employeeId = requestBody.employeeId.trim();
    let startDate = requestBody.startDate.trim();
    let endDate = requestBody.endDate.trim();

    let leaveRequestInsertQuery =
        `INSERT INTO leave_requests 
                (\`employeeId\`, \`companyId\`, \`startDate\`, \`endDate\`)
            VALUES 
                ('${employeeId}', '${companyId}', '${startDate}', '${endDate}');`

    let [leaveRequestInsertQueryResult,] = await dbConnection.getDBConnection().query(leaveRequestInsertQuery);

    console.log("leaveRequestInsertQueryResult", leaveRequestInsertQueryResult);

    if (leaveRequestInsertQueryResult.affectedRows == 1) {
        return res.status(200).send({ 'msg': 'Leave request created successfully' });
    } else {
        return res.status(500).send({ 'msg': 'Database integrity failed' });
    }

}


module.exports.validateApproveLeaveRequest = async (req, res, next) => {
    let requestBody = req.body;

    if (requestBody.employeeId == undefined || requestBody.employeeId == null || requestBody.employeeId.trim() == "") {
        return res.status(500).send({ 'msg': 'employeeId is required' });
    } else if (requestBody.leaveRequestId == undefined || requestBody.leaveRequestId == null || requestBody.leaveRequestId.trim() == "") {
        return res.status(500).send({ 'msg': 'leaveRequestId is required' });
    } else if (requestBody.startDate == undefined || requestBody.startDate == null || requestBody.startDate.trim() == "") {
        return res.status(500).send({ 'msg': 'startDate is required' });
    } else if (requestBody.endDate == undefined || requestBody.endDate == null || requestBody.endDate.trim() == "") {
        return res.status(500).send({ 'msg': 'endDate is required' });
    } else if (requestBody.approvedBy == undefined || requestBody.approvedBy == null || requestBody.approvedBy.trim() == "") {
        return res.status(500).send({ 'msg': 'approvedBy is required' });
    } else {
        next();
    }
}


module.exports.approveLeaveRequest = async (req, res, next) => {

    let requestBody = req.body;

    let employeeId = requestBody.employeeId.trim();
    let leaveRequestId = requestBody.leaveRequestId.trim();
    let approvedBy = requestBody.approvedBy.trim();
    let startDate = requestBody.startDate.trim();
    let endDate = requestBody.endDate.trim();


    let conn = await dbConnection.getDBConnection().getConnection();
    try {
        await conn.beginTransaction();

        let leaveRequestUpdateQuery =
            `UPDATE 
            leave_requests 
        SET 
            markedBy='${approvedBy}',
            isApproved='1'
        WHERE 
            leave_requests.id = '${leaveRequestId}';`;

        let [leaveRequestUpdateResult,] = await conn.query(leaveRequestUpdateQuery);
        //console.log("leaveRequestUpdateResult ", leaveRequestUpdateResult);


        let leaveInsertQuery =
            `INSERT INTO  leaves 
            (\`employeeId\`, \`startDate\`, \`endDate\`, \`leaveRequestId\`, \`approvedBy\`, \`approvedOn\`)
        VALUES 
            ('${employeeId}', '${startDate}', '${endDate}', '${leaveRequestId}', '${approvedBy}', CURRENT_DATE());`;

        let [leaveInsertQueryResult,] = await conn.query(leaveInsertQuery);
        //console.log("leaveInsertQueryResult ", leaveInsertQueryResult);

        await conn.commit();

        return res.status(200).send({ 'msg': 'Leave request approved successfully' });

    } catch (e) {
        await conn.rollback();
        return res.status(500).send({ 'msg': 'Database integrity failed' });
    }

}


module.exports.validateRejectLeaveRequest = async (req, res, next) => {
    let requestBody = req.body;

    if (requestBody.employeeId == undefined || requestBody.employeeId == null || requestBody.employeeId.trim() == "") {
        return res.status(500).send({ 'msg': 'employeeId is required' });
    } else if (requestBody.leaveRequestId == undefined || requestBody.leaveRequestId == null || requestBody.leaveRequestId.trim() == "") {
        return res.status(500).send({ 'msg': 'leaveRequestId is required' });
    } else if (requestBody.rejectedBy == undefined || requestBody.rejectedBy == null || requestBody.rejectedBy.trim() == "") {
        return res.status(500).send({ 'msg': 'rejectedBy is required' });
    } else {
        next();
    }
}


module.exports.rejectLeaveRequest = async (req, res, next) => {

    let requestBody = req.body;

    let companyId = requestBody.companyId ? requestBody.companyId.trim() : null;
    let employeeId = requestBody.employeeId.trim();
    let leaveRequestId = requestBody.leaveRequestId.trim();
    let rejectedBy = requestBody.rejectedBy.trim();

    let conn = await dbConnection.getDBConnection().getConnection();
    try {
        await conn.beginTransaction();

        let leaveRequestUpdateQuery =
            `UPDATE 
            leave_requests 
        SET 
            markedBy='${rejectedBy}',
            isApproved='0'
        WHERE 
            leave_requests.id = '${leaveRequestId}';`;

        let [leaveRequestUpdateResult,] = await conn.query(leaveRequestUpdateQuery);
        //console.log("leaveRequestUpdateResult ", leaveRequestUpdateResult);

        await conn.commit();

        return res.status(200).send({ 'msg': 'Leave request approved successfully' });

    } catch (e) {
        await conn.rollback();
        return res.status(500).send({ 'msg': 'Database integrity failed' });
    }

}


