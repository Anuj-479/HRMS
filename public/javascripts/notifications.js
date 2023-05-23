var departmentsList  = [];
var designationsList = [];
var notificationList = [];

$(document).ready(function () {

    $("#selectNotificationForDepartment").on('change', ()=>{
        let departmentId = $("#selectNotificationForDepartment :selected").val();
        console.log("departmentId", departmentId);
        console.log("designationsList", designationsList);

        populateDesignationOptions(departmentId)
    })

    $(".btnCreateNotification").on('click', () => {
        
        $("#modalAddNotification").modal('show');
    });

    $(".saveDepartment").on('click', () => {
        let departmentId = $("#selectNotificationForDepartment").val();
        let designationId = $("#selectNotificationForDesignation").val();
        let msg = $("#inputNotificationMessage").val();
        let priority = $("#selectPriority").val();
        let companyId = $("#currentUserCompanyId").val();
        let createdBy = $("#currentUserEmployeeId").val();

        if (departmentId.trim() != "") {
            addNotification(departmentId, designationId, msg, priority, companyId, createdBy);
        }
    })

    let companyId = $("#currentUserCompanyId").val();
    let departmentId = $("#currentUserDepartmentId").val();
    let designationId = $("#currentUserDesignationId").val();
    getDepartmentsList( companyId );
    getDesignationsList( companyId );
    getNotificationList(companyId,departmentId,designationId);
    
})

function getDataFromList(id) {
    for (let i = 0; i < departmentsList.length; i++) {
        let department = departmentsList[i];
        if (department.departmentId == id) {
            return department;
        }
    }
}

function populateDepartmentOptions(){
    
    let departmentsOptionContent = "<option value = '-1' >All Department</option>";

    for (let i = 0; i < departmentsList.length; i++) {
        let department = departmentsList[i];
        departmentsOptionContent +=
        `<option value="${department.departmentId}">${department.departmentName}(${department.departmentNameAbbr})</option>`;
    }
    $("#selectNotificationForDepartment").html(departmentsOptionContent);

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

function getDesignationsList(companyId, departmentId = undefined) {

    let data = { 'companyId': companyId };
    if(departmentId != undefined) {
        data.departmentId = departmentId;
    }

    $("#pageContentLoader").show();
    $.ajax({
        type: "POST",
        url: "/designations/fetchDesignationsList",
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
                    designationsList = responseData.data;
                    populateDesignationOptions(null);

                } else {
                    showFailureMessage("Something went wrong");
                }

            }
        );

    })
}

function getNotificationList(companyId, departmentId, designationId) {

    let data = { 'companyId': companyId };
    if(departmentId != undefined) {
        data.departmentId = departmentId;
    }

    if(designationId != undefined) {
        data.designationId = designationId;
    }

    $("#pageContentLoader").show();
    $.ajax({
        type: "POST",
        url: "/notifications/fetchNotificationsList",
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
                    notificationList = responseData.data;
                    populateNotificationTable()

                } else {
                    showFailureMessage("Something went wrong");
                }

            }
        );

    })
}

function populateDesignationOptions(departmentId){
    
    let departmentsOptionContent = "<option value = '-1' >All Designations</option>";

    for (let i = 0; i < designationsList.length; i++) {
        let designation = designationsList[i];
        if(departmentId == designation.departmentId){
            departmentsOptionContent +=
            `<option value="${designation.designationId}">${designation.designationName}(${designation.designationNameAbbr})</option>`;
        }
        
    }
    $("#selectNotificationForDesignation").html(departmentsOptionContent);
    $("#selectNotificationForDesignation").val("-1").trigger('change');
}

function addNotification(departmentId, designationId,  msg, priority, companyId, createdBy, employeeId = undefined) {

    let data = { departmentId: departmentId, designationId: designationId, msg: msg, priority: priority, createdBy: createdBy, companyId: companyId  }
    if (designationId != undefined) {
        data.designationId = designationId;
    }

    $("#addNotificationLoader").show();
    $.ajax({
        type: "POST",
        url: "/notifications/addNotifications",
        data: data,
        dataType: 'json'
    }).always(function (data, textStatus, jqXHR) {

        $("#addNotificationLoader").hide();
        ajaxResponseHandler(
            data,
            textStatus,
            jqXHR,
            (responseData) => {
                if (responseData.msg) {
                    $("#modalAddNotification").modal('hide');
                    showSuccessMessage(responseData.msg);
                    let companyId = $("#currentUserCompanyId").val();
                    //getDesignationsList(companyId);
                    location.reload();
                } else {
                    showFailureMessage("Something went wrong");
                }

            }
        );

    })
}

function populateNotificationTable() {

    let notificationTableBodyContent = "";

    for (let i = 0; i < notificationList.length; i++) {
        let notification = notificationList[i];
        notificationTableBodyContent +=
        `<tr>
            <td>${notification.notificationId}</td>
            <td>${notification.msg}</td>
            <td>${notification.priority}</td>
            <td>${notification.createdBy}</td>
            <td>${formatDate(notification.createdAt)}</td>
        </tr>`;
    }

    $("#notificationTableBody").html(notificationTableBodyContent);


    $("#notificationTable").DataTable({
        "responsive": true, 
        "lengthChange": false, 
        "autoWidth": false, 
    });

}