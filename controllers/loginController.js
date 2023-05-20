const config = require('./../configurations/config')
const dbConnection = require('./../database/DBConnection')


const validateLoginRequest = async (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    if(username == undefined || username == null || username.trim() == ""){
        return res.render('login', { errorMsg: 'Invalid username' });
    }else if(password == undefined || password == null || password.trim() == ""){
        return res.render('login', { errorMsg: 'Invalid Password' });
    }else{
        next();
    }
}

const login = async (req, res, next) => {
    let username = req.body.username.trim();
    let password = req.body.password.trim();

    let loginQuery = 
    `SELECT * from (
        SELECT username, password, role FROM credentials as c WHERE c.username = '${username}'
        UNION
        SELECT username, password, role FROM persons as p LEFT JOIN credentials as c ON p.id = c.personId where p.email ='${username}' || p.mobileNo = '${username}'
    ) as UNION_TABLE limit 1;`

    let [queryResult, ] = await dbConnection.getDBConnection().query(loginQuery);
    
    if(queryResult.length == 0){
        return res.render('login', { errorMsg: 'Username not found' });
    }else {
        let user = queryResult[0];
        if(user.password == password){
            console.log("password matched");

            let personQuery = `SELECT p.* FROM credentials as c LEFT JOIN persons as p ON p.id = c.personId WHERE c.username = '${user.username}';`
            let [personQueryResult, ] = await dbConnection.getDBConnection().query(personQuery);
            if(personQueryResult.length == 0){
                return res.render('login', { errorMsg: 'Database error/Person not found' });
            }else{
                let personDetails = personQueryResult[0];

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
                    e.personId = '${personDetails.id}';`;

                let [employeeQueryResult, ] = await dbConnection.getDBConnection().query(employeeQuery);
                if(employeeQueryResult.length == 0){
                    return res.render('login', { errorMsg: 'Database error/Person not found' });
                }else{

                    let employeeDetails = employeeQueryResult[0];

                    req.session.regenerate(function (err) {
                        if (err) next(err)
                    
                        // store user information in session, typically a user id
                        req.session.user = user;
                        req.session.person = personDetails;
                        req.session.employee = employeeDetails;
                    
                        // save the session before redirection to ensure page
                        // load does not happen before session is saved
                        req.session.save(function (err) {
                          if (err) return next(err)
                          return res.redirect('/dashboard')
                          //return res.send({ errorMsg: JSON.stringify(req.session.user) })
                          //return res.render('dashboard', { errorMsg: JSON.stringify(req.session.user) });
                        })
                    })
                }

                
            }
        }else {
            return res.render('login', { errorMsg: 'Username/Password is incorrect' });
        }
        
    }

}


module.exports = {
    login,
    validateLoginRequest
}