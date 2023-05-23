var designationsList = [];
var departmentsList = [];
var employeesList = [];

var selectedEmployee = null;

$(document).ready(function () {

    $("#selectEmployeeDepartment").on('change', ()=>{
        let departmentId = $("#selectEmployeeDepartment :selected").val();
        console.log("departmentId", departmentId);
        console.log("designationsList", designationsList);

        populateDesignationOptions(departmentId)
    })

    $(".btnAddEmployee").on('click', () => {

        selectedEmployee = null;

        $("#inputPersonId").val("");
        $("#inputEmployeeId").val("");

        $("#inputEmployeeName").val("");
        $("#selectEmployeeGender").val(null).trigger('change');
        $("#inputEmployeeDob").val("");
        $("#inputMobile").val("");
        $("#inputAltMobile").val("");
        $("#inputEmail").val("");

        $("#selectEmployeeDepartment").val(null).trigger('change');
        $("#selectEmployeeDesignation").val(null).trigger('change');

        $("#inputEmployeeUan").val("");
        $("#inputEmployeeDoj").val("");

        $("#inputBankName").val("");
        $("#inputBranchName").val("");
        $("#inputIfscCode").val("");
        $("#inputAccountNo").val("");

        $("#modalAddEditEmployee").modal('show');
    });


    $(".deleteEmployee").on('click', () => {
        let designationToDelete = $("#inputDeleteEmployeeId").val();
        deleteEmployee(designationToDelete)
    })

    $(".saveEmployee").on('click', () => {

        let personId = $("#inputPersonId").val();
        let employeeId = $("#inputEmployeeId").val();
        let name = $("#inputEmployeeName").val();
        let gender = $("#selectEmployeeGender :selected").val();
        let dob = $("#inputEmployeeDob").val();
        let mobile= $("#inputMobile").val();
        let altMobile= $("#inputAltMobile").val();
        let email = $("#inputEmail").val();

        let departmentId = $("#selectEmployeeDepartment :selected").val();
        let designationId = $("#selectEmployeeDesignation :selected").val();
        let companyId = $("#currentUserCompanyId").val();

        let uanNo = $("#inputEmployeeUan").val();
        let doj = $("#inputEmployeeDoj").val();

        let bankName = $("#inputBankName").val();
        let bankBranch = $("#inputBranchName").val();
        let ifscCode = $("#inputIfscCode").val();
        let accountNo = $("#inputAccountNo").val();

        let bankDetailsId = undefined;

        if (employeeId.trim() != "") {
            addEditEmployee(name, gender, dob, mobile, altMobile, email, companyId, departmentId, designationId, uanNo, doj, bankName, bankBranch, ifscCode, accountNo, bankDetailsId, employeeId, personId);
        } else {
            addEditEmployee(name, gender, dob, mobile, altMobile, email, companyId, departmentId, designationId, uanNo, doj, bankName, bankBranch, ifscCode, accountNo, bankDetailsId);
        }
    })

    let companyId = $("#currentUserCompanyId").val();

    getDepartmentsList(companyId);
    getDesignationsList(companyId);
    getEmployeesList(companyId);

    $("#selectEmployeeDepartment").select2({
        theme: 'bootstrap4',
        placeholder: "Select department",
        allowClear: true
    });

    $("#selectEmployeeDesignation").select2({
        theme: 'bootstrap4',
        placeholder: "Select designation",
        allowClear: true
    });

})

function onRowEditClick(employeeId){
    console.log("onRowEditClick");

    console.log("employeeId", employeeId);
    let employee = getDataFromList(employeeId);
    console.log("employee", employee);

    selectedEmployee = employee;
    $("#inputPersonId").val(employee.personId);
    $("#inputEmployeeId").val(employee.employeeId);
    $("#inputBankId").val(employee.bankDetailsId);

    $("#inputEmployeeName").val(employee.personName);
    $("#selectEmployeeGender").val(employee.personGender).trigger('change');
    $("#inputEmployeeDob").val(formatDate(handleNullValues(employee.personDOB)));
    $("#inputMobile").val(employee.personMobileNo);
    $("#inputAltMobile").val(employee.personAlternateMobileNo);
    $("#inputEmail").val(employee.personEmail);

    $("#selectEmployeeDepartment").val(employee.departmentId).trigger('change');

    $("#inputEmployeeUan").val(employee.uanNo);
    $("#inputEmployeeDoj").val(formatDate(handleNullValues(employee.joiningDate)));

    $("#inputBankName").val(employee.bankName);
    $("#inputBranchName").val(employee.bankBranchName);
    $("#inputIfscCode").val(employee.bankIfscCode);
    $("#inputAccountNo").val(employee.bankAccountNo);

    $("#modalAddEditEmployee").modal();
}

function onRowDeleteClick(employeeId){

    console.log("onRowDeleteClick");
    
    let employee = getDataFromList(employeeId);
    
    // $("#inputDeleteEmployeeId").val(designation.designationId);
    // $("#toBeDeletedEmployeeName").html(`${designation.designationName}(${designation.designationNameAbbr})`)

    $("#modalDeleteEmployee").modal();
}

function getDataFromList(id) {
    for (let i = 0; i < employeesList.length; i++) {
        let employee = employeesList[i];
        if (employee.employeeId == id) {
            return employee;
        }
    }
}

function populateEmployeeTable() {

    let role = $("#currentUserRole").val();

    let employeeTableBodyContent = "";

    for (let i = 0; i < employeesList.length; i++) {
        let employee = employeesList[i];
        employeeTableBodyContent +=
        `<tr>
            <td>${employee.employeeId}</td>
            <td>${employee.personName}</td>
            <td>${employee.personGender}</td>
            <td>${formatDate(employee.personDOB)}</td>
            <td>${employee.designationName} (${employee.designationNameAbbr})</td>
            <td>${employee.departmentName} (${employee.departmentNameAbbr})</td>
            <td>${formatDate(employee.joiningDate)}</td>
            <td>${handleNullValues(employee.uanNo)}</td>
            <td>
                ${
                    (role.toLowerCase() == 'admin' || role.toLowerCase() == 'hr')?
                    `<button type="button" class="btn bg-gradient-primary btnEditEmployee" data-employee-id="${employee.employeeId}" onclick="onRowEditClick(${employee.employeeId})">Edit</button>
                    <button type="button" class="btn bg-gradient-danger btnDeleteEmployee" data-employee-id="${employee.employeeId}" onclick="onRowDeleteClick(${employee.employeeId})" style="display:none">Delete</button>`
                    :
                    ``
                }
            </td>
        </tr>`;
    }

    $("#employeeTableBody").html(employeeTableBodyContent);


    $("#employeeTable").DataTable({
        "responsive": true, 
        "lengthChange": false, 
        "autoWidth": false, 
    });

}

function populateDepartmentOptions(){
    
    let departmentsOptionContent = "<option></option>";

    for (let i = 0; i < departmentsList.length; i++) {
        let department = departmentsList[i];
        departmentsOptionContent +=
        `<option value="${department.departmentId}">${department.departmentName}(${department.departmentNameAbbr})</option>`;
    }
    $("#selectEmployeeDepartment").html(departmentsOptionContent);

}

function populateDesignationOptions(departmentId){
    
    let departmentsOptionContent = "<option></option>";

    for (let i = 0; i < designationsList.length; i++) {
        let designation = designationsList[i];
        if(departmentId == designation.departmentId){
            departmentsOptionContent +=
            `<option value="${designation.designationId}">${designation.designationName}(${designation.designationNameAbbr})</option>`;
        }
        
    }
    $("#selectEmployeeDesignation").html(departmentsOptionContent);

    if(selectedEmployee && selectedEmployee.designationId){
        $("#selectEmployeeDesignation").val(selectedEmployee.designationId).trigger('change');
    }else{
        $("#selectEmployeeDesignation").val(null).trigger('change');
    }

}

function getDepartmentsList(companyId) {
    $("#pageContentLoader").show();
    $.ajax({
        type: "POST",
        url: "/departments/fetchDepartmentsList",
        data: { 'companyId': companyId},
        dataType: 'json'
    }).always(function (data, textStatus, jqXHR) {

        $("#pageContentLoader").hide();
        ajaxResponseHandler(
            data,
            textStatus,
            jqXHR,
            (responseData) => {
                if (responseData.data) {
                    //showSuccessMessage(responseData.msg);
                    departmentsList = responseData.data;
                    populateDepartmentOptions();
                } else {
                    showFailureMessage("Something went wrong");
                }

            }
        );

    })
}

function getDesignationsList(companyId) {
    $("#pageContentLoader").show();
    $.ajax({
        type: "POST",
        url: "/designations/fetchDesignationsList",
        data: { 'companyId': companyId},
        dataType: 'json'
    }).always(function (data, textStatus, jqXHR) {

        $("#pageContentLoader").hide();
        ajaxResponseHandler(
            data,
            textStatus,
            jqXHR,
            (responseData) => {
                if (responseData.data) {
                    //showSuccessMessage(responseData.msg);
                    designationsList = responseData.data;
                    populateDesignationOptions();
                } else {
                    showFailureMessage("Something went wrong");
                }

            }
        );

    })
}


function getEmployeesList(companyId, departmentId = undefined) {

    let data = { 'companyId': companyId };
    if(departmentId != undefined) {
        data.departmentId = departmentId;
    }

    $("#pageContentLoader").show();
    $.ajax({
        type: "POST",
        url: "/employees/fetchEmployeesList",
        data: data,
        dataType: 'json'
    }).always(function (data, textStatus, jqXHR) {

        $("#pageContentLoader").hide();
        ajaxResponseHandler(
            data,
            textStatus,
            jqXHR,
            (responseData) => {
                if (responseData.data) {
                    showSuccessMessage(responseData.msg);
                    employeesList = responseData.data;
                    populateEmployeeTable()

                } else {
                    showFailureMessage("Something went wrong");
                }

            }
        );

    })
}


function deleteEmployee(designationId) {
    let data = { designationId: designationId };

    $("#deleteEmployeeLoader").show();
    $.ajax({
        type: "POST",
        url: "/designations/deleteEmployee",
        data: data,
        dataType: 'json'
    }).always(function (data, textStatus, jqXHR) {

        $("#deleteEmployeeLoader").hide();
        ajaxResponseHandler(
            data,
            textStatus,
            jqXHR,
            (responseData) => {
                if (responseData.msg) {
                    $("#modalDeleteEmployee").modal('hide');
                    showSuccessMessage(responseData.msg);
                    let companyId = $("#currentUserCompanyId").val();
                    //getEmployeesList(companyId);
                    location.reload();
                } else {
                    showFailureMessage("Something went wrong");
                }

            }
        );

    })
}

function addEditEmployee(name, gender, dob, mobile, altMobile, email, companyId, departmentId, designationId, uanNo, doj, bankName, bankBranch, ifscCode, accountNo, bankDetailsId = undefined, employeeId = undefined, personId = undefined) {

    let data = { 
        name,
        gender, 
        dob, 
        mobile,
        altMobile,
        email,
        companyId,
        departmentId,
        designationId,
        uanNo,
        doj,
        bankName,
        bankBranch,
        ifscCode,
        accountNo
    }
    
    if (bankDetailsId != undefined) {
        data.bankDetailsId = bankDetailsId;
    }

    if (employeeId != undefined && personId != undefined ) {
        data.employeeId = employeeId;
        data.personId = personId;
    }

    $("#addEditEmployeeLoader").show();
    $.ajax({
        type: "POST",
        url: "/employees/addEditEmployee",
        data: data,
        dataType: 'json'
    }).always(function (data, textStatus, jqXHR) {

        $("#addEditEmployeeLoader").hide();
        ajaxResponseHandler(
            data,
            textStatus,
            jqXHR,
            (responseData) => {
                if (responseData.msg) {
                    $("#modalAddEditEmployee").modal('hide');
                    showSuccessMessage(responseData.msg);
                    let companyId = $("#currentUserCompanyId").val();
                    //getEmployeesList(companyId);
                    location.reload();
                } else {
                    showFailureMessage("Something went wrong");
                }

            }
        );

    })
}