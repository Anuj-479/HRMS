var designationsList = [];
var departmentsList = [];
var employeesList = [];

$(document).ready(function () {

    $("#selectEmployeeDepartment").on('change', ()=>{
        let departmentId = $("#selectEmployeeDepartment :selected").val();
        console.log("departmentId", departmentId);
        console.log("designationsList", designationsList);

        populateDesignationOptions(departmentId)
    })

    $(".btnAddEmployee").on('click', () => {
        $("#inputEmployeeId").val("");
        $("#inputDesignationName").val("");
        $("#inputDesignationAbbr").val("");
        $("#selectDepartmentName").val(null).trigger('change');
        $("#modalAddEditEmployee").modal('show');
    });


    $(".deleteEmployee").on('click', () => {
        let designationToDelete = $("#inputDeleteEmployeeId").val();
        deleteEmployee(designationToDelete)
    })

    $(".saveEmployee").on('click', () => {
        let designationId = $("#inputEmployeeId").val();
        let designationName = $("#inputDesignationName").val();
        let designationNameAbbr = $("#inputDesignationAbbr").val();

        let departmentId = $("#selectDepartmentName :selected").val();

        let companyId = $("#currentUserCompanyId").val();

        if (designationId.trim() != "") {
            addEditEmployee(designationName, designationNameAbbr, departmentId, companyId, designationId);
        } else {
            addEditEmployee(designationName, designationNameAbbr, departmentId, companyId);
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

function onRowEditClick(designationId){
    console.log("designationId", designationId);
    let designation = getDataFromList(designationId);
    $("#inputEmployeeId").val(designation.designationId);
    $("#inputDesignationName").val(designation.designationName);
    $("#inputDesignationAbbr").val(designation.designationNameAbbr);

    $("#selectDepartmentName").val(designation.departmentId).trigger('change');

    $("#modalAddEditEmployee").modal();
}

function onRowDeleteClick(designationId){

    console.log("designationId", designationId)
    let designation = getDataFromList(designationId);
    console.log("designation", designation)
    $("#inputDeleteEmployeeId").val(designation.designationId);
    $("#toBeDeletedEmployeeName").html(`${designation.designationName}(${designation.designationNameAbbr})`)

    $("#modalDeleteEmployee").modal();
}
function testButton(id) {
    console.log("testButton", id);
}

function getDataFromList(id) {
    for (let i = 0; i < designationsList.length; i++) {
        let designation = designationsList[i];
        if (designation.designationId == id) {
            return designation;
        }
    }
}

function populateEmployeeTable() {

    let employeeTableBodyContent = "";

    for (let i = 0; i < employeesList.length; i++) {
        let employee = employeesList[i];
        employeeTableBodyContent +=
        `<tr>
            <td>${employee.employeeId}</td>
            <td>${employee.personName}</td>
            <td>${employee.personGender}</td>
            <td>${handleNullValues(employee.personDOB)}</td>
            <td>${employee.designationName} (${employee.designationNameAbbr})</td>
            <td>${employee.departmentName} (${employee.departmentNameAbbr})</td>
            <td>${handleNullValues(employee.joiningDate)}</td>
            <td>${handleNullValues(employee.uanNo)}</td>
            <td>
                <button type="button" class="btn bg-gradient-primary btnEditEmployee" data-employee-id="${employee.employeeId}" onclick="onRowEditClick(${employee.employeeId})">Edit</button>
                <button type="button" class="btn bg-gradient-danger btnDeleteEmployee" data-employee-id="${employee.employeeId}" onclick="onRowDeleteClick(${employee.employeeId})">Delete</button>
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

function addEditEmployee(designationName, designationAbbr,  departmentId, companyId, designationId = undefined) {

    let data = { designationName: designationName, designationAbbr: designationAbbr, departmentId: departmentId, companyId: companyId }
    if (designationId != undefined) {
        data.designationId = designationId;
    }

    $("#addEditEmployeeLoader").show();
    $.ajax({
        type: "POST",
        url: "/designations/addEditEmployee",
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