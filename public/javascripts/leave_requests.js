var leaveRequestsList = [];

$(document).ready(function () {


    $(".approveLeaveRequests").on('click', () => {
        let leaveRequestToApprove = $("#inputApproveLeaveRequestId").val();
        let leaveRequestApproverEmployeedId = $("#currentUserEmployeeId").val();
        let leaveRequest = getDataFromList(leaveRequestToApprove);

        approveLeaveRequest(leaveRequest, leaveRequestApproverEmployeedId);
    })

    $(".rejectLeaveRequest").on('click', () => {

        let leaveRequestId = $("#inputRejectLeaveRequestId").val();
        let leaveRequestRejecteerEmployeedId = $("#currentUserEmployeeId").val();
        let leaveRequest = getDataFromList(leaveRequestId);

        rejectLeaveRequest(leaveRequest, leaveRequestRejecteerEmployeedId);
    })

    $(".saveDesignation").on('click', () => {
        let designationId = $("#inputDesignationId").val();
        let designationName = $("#inputDesignationName").val();
        let designationNameAbbr = $("#inputDesignationAbbr").val();

        let departmentId = $("#selectDepartmentName :selected").val();

        let companyId = $("#currentUserCompanyId").val();

        if (designationId.trim() != "") {
            addEditDesignation(designationName, designationNameAbbr, departmentId, companyId, designationId);
        } else {
            addEditDesignation(designationName, designationNameAbbr, departmentId, companyId);
        }
    })

    let companyId = $("#currentUserCompanyId").val();

    let employeeId = $("#currentUserEmployeeId").val();

    getLeaveRequestsList(employeeId, companyId);

})

function onRowApproveClick(requestId) {

    console.log("requestId", requestId);
    let leaveRequest = getDataFromList(requestId);

    $("#toBeApprovedLeaveRequestData").val(` of ${leaveRequest.employeeName} from ${formatDate(leaveRequest.leaveRequestStartDate)} to ${formatDate(leaveRequest.leaveRequestEndDate)} `)
    $("#inputApproveLeaveRequestId").val(leaveRequest.leaveRequestId);
    $("#modalApproveLeaveRequests").modal();
}

function onRowRejectClick(requestId) {

    console.log("requestId", requestId);
    let leaveRequest = getDataFromList(requestId);

    $("#toBeRejectedLeaveRequestData").val(` of ${leaveRequest.employeeName} from ${formatDate(leaveRequest.leaveRequestStartDate)} to ${formatDate(leaveRequest.leaveRequestEndDate)} `)
    $("#inputRejectLeaveRequestId").val(leaveRequest.leaveRequestId);
    $("#modalRejectLeaveRequests").modal();
}

function getDataFromList(id) {
    for (let i = 0; i < leaveRequestsList.length; i++) {
        let leaveRequest = leaveRequestsList[i];
        if (leaveRequest.leaveRequestId == id) {
            return leaveRequest;
        }
    }
}

function populateLeaveRequestsTable() {

    let leaveRequestsTableBodyContent = "";

    for (let i = 0; i < leaveRequestsList.length; i++) {
        let leaveRequest = leaveRequestsList[i];
        let status = leaveRequest.leaveRequestMarkedBy == null ? "Pending" : (leaveRequest.isApproved ? "Approved" : "Rejected");
        leaveRequestsTableBodyContent +=
            `<tr>
            <td>${leaveRequest.leaveRequestId}</td>
            <td>${leaveRequest.employeeName}</td>
            <td>${leaveRequest.departmentName} (${leaveRequest.departmentNameAbbr})</td>
            <td>${leaveRequest.designationName}</td>
            <td>${formatDate(leaveRequest.leaveRequestStartDate)}</td>
            <td>${formatDate(leaveRequest.leaveRequestEndDate)}</td>
            <td>${status}</td>
            <td>${leaveRequest.leaveRequestMarkedBy == null ? "NA" : handleNullValues(leaveRequest.leaveRequestMarkedByName, "NA")}</td>
            <td>
                ${
                    status == "Pending"? 
                    `<button type="button" class="btn bg-gradient-success btnApproveLeave" data-leave-request-id="${leaveRequest.leaveRequestsId}" onclick="onRowApproveClick(${leaveRequest.leaveRequestId})">Approve</button>
                    <button type="button" class="btn bg-gradient-danger btnRejectLeave" data-leave-request-id="${leaveRequest.leaveRequestsId}" onclick="onRowRejectClick(${leaveRequest.leaveRequestId})">Reject</button>`
                    :
                    ``
                }   
            </td>
        </tr>`;
    }

    $("#leaveRequestsTableBody").html(leaveRequestsTableBodyContent);


    $("#leaveRequestsTable").DataTable({
        "responsive": true,
        "lengthChange": false,
        "autoWidth": false,
    });

}

function getLeaveRequestsList(companyId, employeeId) {

    let data = { employeeId, companyId };

    $("#pageContentLoader").show();
    $.ajax({
        type: "POST",
        url: "/leaves/fetchLeaveRequests",
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
                    leaveRequestsList = responseData.data;
                    populateLeaveRequestsTable()

                } else {
                    showFailureMessage("Something went wrong");
                }

            }
        );

    })
}



function approveLeaveRequest(leaveRequest, approverEmployeeId) {

    let data = {
        employeeId: leaveRequest.employeeId,
        leaveRequestId: leaveRequest.leaveRequestId,
        startDate: formatDate(leaveRequest.leaveRequestStartDate),
        endDate: formatDate(leaveRequest.leaveRequestEndDate),
        approvedBy: approverEmployeeId
    };

    $("#approveLeaveRequestsLoader").show();
    $.ajax({
        type: "POST",
        url: "/leaves/approveLeaveRequest",
        data: data,
        dataType: 'json'
    }).always(function (data, textStatus, jqXHR) {

        $("#approveLeaveRequestsLoader").hide();
        ajaxResponseHandler(
            data,
            textStatus,
            jqXHR,
            (responseData) => {
                if (responseData.msg) {
                    showSuccessMessage(responseData.msg);
                    location.reload()
                } else {
                    showFailureMessage("Something went wrong");
                }

            }
        );

    })
}


function rejectLeaveRequest(leaveRequest, rejecteerEmployeeId) {

    let data = {
        employeeId: leaveRequest.employeeId,
        leaveRequestId: leaveRequest.leaveRequestId,
        startDate: formatDate(leaveRequest.leaveRequestStartDate),
        endDate: formatDate(leaveRequest.leaveRequestEndDate),
        rejectedBy: rejecteerEmployeeId
    };

    $("#rejectLeaveRequestsLoader").show();
    $.ajax({
        type: "POST",
        url: "/leaves/rejectLeaveRequest",
        data: data,
        dataType: 'json'
    }).always(function (data, textStatus, jqXHR) {

        $("#rejectLeaveRequestsLoader").hide();
        ajaxResponseHandler(
            data,
            textStatus,
            jqXHR,
            (responseData) => {
                if (responseData.msg) {
                    showSuccessMessage(responseData.msg);
                    location.reload()
                } else {
                    showFailureMessage("Something went wrong");
                }

            }
        );

    })
}
