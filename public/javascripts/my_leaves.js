var leaveRequestsList = [];
var leavesList = [];

$(document).ready(function () {

    $(".btnAddLeaveRequest").on('click', () => {
        $("#inputLeaveRequestId").val("");
        $("#inputLeaveRequestStartDate").val("");
        $("#inputLeaveRequestEndDate").val("");
        
        $("#modalAddEditLeaveRequest").modal('show');
    });


    $(".saveLeaveRequest").on('click', () => {

        let leaveRequestId = $("#inputLeaveRequestId").val();
        let startDate = $("#inputLeaveRequestStartDate").val();
        let endDate = $("#inputLeaveRequestEndDate").val();

        let employeeId = $("#currentUserEmployeeId").val();
        let companyId = $("#currentUserCompanyId").val();

        if (leaveRequestId.trim() != "") {
            addEditLeaveRequest(startDate, endDate, employeeId, companyId, leaveRequestId);
        } else {
            addEditLeaveRequest(startDate, endDate, employeeId, companyId);
        }
    })

    let companyId = $("#currentUserCompanyId").val();
    let employeeId = $("#currentUserEmployeeId").val();

    getLeavesList(employeeId, companyId);

})

function onRowEditClick(designationId){
    console.log("designationId", designationId);
    let designation = getDataFromList(designationId);
    $("#inputLeaveRequestId").val(designation.designationId);
    $("#inputLeaveRequestName").val(designation.designationName);
    $("#inputLeaveRequestAbbr").val(designation.designationNameAbbr);

    $("#selectDepartmentName").val(designation.departmentId).trigger('change');

    $("#modalAddEditLeaveRequest").modal();
}

function onRowDeleteClick(designationId){

    console.log("designationId", designationId)
    let designation = getDataFromList(designationId);
    console.log("designation", designation)
    $("#inputDeleteLeaveRequestId").val(designation.designationId);
    $("#toBeDeletedLeaveRequestName").html(`${designation.designationName}(${designation.designationNameAbbr})`)

    $("#modalDeleteLeaveRequest").modal();
}

function getDataFromList(id) {
    for (let i = 0; i < leaveRequestsList.length; i++) {
        let designation = leaveRequestsList[i];
        if (designation.designationId == id) {
            return designation;
        }
    }
}

function populateLeaveTables() {

    let myLeaveTableBodyContent = "";

    for (let i = 0; i < leavesList.length; i++) {
        let leave = leavesList[i];
        myLeaveTableBodyContent +=
        `<tr>
            <td>${leave.leaveRequestId}</td>
            <td>${formatDate(leave.leaveStartDate)}</td>
            <td>${formatDate(leave.leaveRequestEndDate)}</td>
            <td>${handleNullValues(leave.leaveRequestMarkedByName)}</td>
            <td>${formatDate(leave.leaveApprovedOn)}</td>
            <td>${leave.leaveRequestMarkedBy == null? "Pending": (leave.isApproved? "Approved":"Rejected")}</td>
            <td>${leave.cancelledBy == null? "NA": handleNullValues(leave.cancelledByName, "NA")}</td>
            <td>${formatDate(leave.leaveCancelledOn)}</td>
        </tr>`;
    }

    $("#myLeaveTableBody").html(myLeaveTableBodyContent);


    let leaveRequestTableBodyContent = "";

    for (let i = 0; i < leaveRequestsList.length; i++) {
        let leaveRequest = leaveRequestsList[i];
        leaveRequestTableBodyContent +=
        `<tr>
            <td>${leaveRequest.leaveRequestId}</td>
            <td>${formatDate(leaveRequest.leaveRequestStartDate)}</td>
            <td>${formatDate(leaveRequest.leaveRequestEndDate)}</td>
            <td>${formatDate(leaveRequest.leaveStartDate)}</td>
            <td>${formatDate(leaveRequest.leaveEndDate)}</td>
            <td>${leaveRequest.leaveRequestMarkedBy == null? "Pending": (leaveRequest.isApproved? "Approved":"Rejected")}</td>
            <td>${leaveRequest.leaveRequestMarkedBy == null? "NA": handleNullValues(leaveRequest.leaveRequestMarkedByName, "NA")}</td>
        </tr>`;
    }

    $("#leaveRequestTableBody").html(leaveRequestTableBodyContent);


    $("#leaveRequestTable").DataTable({
        "responsive": true, 
        "lengthChange": false, 
        "autoWidth": false, 
    });

    $("#myLeavesTable").DataTable({
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
    $("#selectDepartmentName").html(departmentsOptionContent);

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



function getLeavesList(employeeId, companyId) {

    let data = { 'companyId': companyId, employeeId: employeeId };

    $("#pageContentLoader").show();
    $.ajax({
        type: "POST",
        url: "/leaves/fetchMyLeaves",
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
                    leaveRequestsList = responseData.data.myLeaveRequests;
                    leavesList = responseData.data.myLeaves
                    populateLeaveTables()

                } else {
                    showFailureMessage("Something went wrong");
                }

            }
        );

    })
}

function addEditLeaveRequest(startDate, endDate, employeeId, companyId, leaveRequestId = undefined) {

    let data = { 
        startDate: startDate, 
        endDate: endDate, 
        employeeId: employeeId, 
        companyId: companyId
    }
    
    if (leaveRequestId != undefined) {
        data.leaveRequestId = designationId;
    }

    $("#addEditLeaveRequestLoader").show();
    $.ajax({
        type: "POST",
        url: "/leaves/createLeaveRequests",
        data: data,
        dataType: 'json'
    }).always(function (data, textStatus, jqXHR) {

        $("#addEditLeaveRequestLoader").hide();
        ajaxResponseHandler(
            data,
            textStatus,
            jqXHR,
            (responseData) => {
                if (responseData.msg) {
                    $("#modalAddEditLeaveRequest").modal('hide');
                    showSuccessMessage(responseData.msg);
                    let companyId = $("#currentUserCompanyId").val();
                    //getleaveRequestsList(companyId);
                    location.reload();
                } else {
                    showFailureMessage("Something went wrong");
                }

            }
        );

    })
}