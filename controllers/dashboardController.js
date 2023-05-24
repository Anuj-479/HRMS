const config = require('./../configurations/config')
const dbConnection = require('./../database/DBConnection')

module.exports.fetchDashboardData = async (req, res) => {

    let requestBody = req.body;

//    let companyId = requestBody.companyId.trim();

    let DashboardQuery = `
    SELECT 
    emp.employeesCount, dep.departmentsCount, des.designationsCount, lr.pendingLeaveRequestsCount
    FROM
    (SELECT 
        count(1) as employeesCount 
    FROM 
        hrms_db.employees )
    as emp,
    (SELECT 
        count(1) as departmentsCount 
    FROM 
        hrms_db.departments )
    as dep,
    (SELECT 
        count(1) as designationsCount 
    FROM 
        hrms_db.designations )
        as des,
    (SELECT 
        count(1) as pendingLeaveRequestsCount 
    FROM 
        hrms_db.leave_requests
    WHERE markedBy IS NULL )
        as lr
    `;


    let [DashboardQueryResult,] = await dbConnection.getDBConnection().query(DashboardQuery);

    if (DashboardQueryResult.length == 0) {
        return res.status(200).send({ 'data': [], 'msg': 'No data found' });
    } else {
        return res.status(200).send({ 'data': DashboardQueryResult, 'msg': 'Dashboard data fetched successfully' });
    }

}

