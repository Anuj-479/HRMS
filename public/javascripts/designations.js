var designationsList = [];
var departmentsList = [];

$(document).ready(function () {

    $(".btnAddDesignation").on('click', () => {
        $("#inputDesignationId").val("");
        $("#inputDesignationName").val("");
        $("#inputDesignationAbbr").val("");
        $("#selectDepartmentName").val(null).trigger('change');
        $("#modalAddEditDesignation").modal('show');
    });


    $(".deleteDesignation").on('click', () => {
        let designationToDelete = $("#inputDeleteDesignationId").val();
        deleteDesignation(designationToDelete)
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

    getDepartmentsList(companyId);
    getDesignationsList(companyId);

    $("#selectDepartmentName").select2({
        theme: 'bootstrap4',
        placeholder: "Select department",
        allowClear: true
    });

})

function onRowEditClick(designationId){
    console.log("designationId", designationId);
    let designation = getDataFromList(designationId);
    $("#inputDesignationId").val(designation.designationId);
    $("#inputDesignationName").val(designation.designationName);
    $("#inputDesignationAbbr").val(designation.designationNameAbbr);

    $("#selectDepartmentName").val(designation.departmentId).trigger('change');

    $("#modalAddEditDesignation").modal();
}

function onRowDeleteClick(designationId){

    console.log("designationId", designationId)
    let designation = getDataFromList(designationId);
    console.log("designation", designation)
    $("#inputDeleteDesignationId").val(designation.designationId);
    $("#toBeDeletedDesignationName").html(`${designation.designationName}(${designation.designationNameAbbr})`)

    $("#modalDeleteDesignation").modal();
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

function populateDesignationTable() {

    let role = $("#currentUserRole").val();
    let designationTableBodyContent = "";

    for (let i = 0; i < designationsList.length; i++) {
        let designation = designationsList[i];
        designationTableBodyContent +=
        `<tr>
            <td>${designation.designationId}</td>
            <td>${designation.designationName}</td>
            <td>${designation.designationNameAbbr}</td>
            <td>${designation.departmentName}</td>
            <td>${designation.departmentNameAbbr}</td>
            <td>
             ${
                    (role.toLowerCase() == 'admin' || role.toLowerCase() == 'hr')?
                    `<button type="button" class="btn bg-gradient-primary btnEditDesignation" data-designation-id="${designation.designationId}" onclick="onRowEditClick(${designation.designationId})">Edit</button>
                    <button type="button" class="btn bg-gradient-danger btnDeleteDesignation" data-designation-id="${designation.designationId}" onclick="onRowDeleteClick(${designation.designationId})">Delete</button>`
                    :
                    ``
                }
                
            </td>
        </tr>`;
    }

    $("#designationTableBody").html(designationTableBodyContent);


    $("#designationTable").DataTable({
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
                    populateDesignationTable()

                } else {
                    showFailureMessage("Something went wrong");
                }

            }
        );

    })
}


function deleteDesignation(designationId) {
    let data = { designationId: designationId };

    $("#deleteDesignationLoader").show();
    $.ajax({
        type: "POST",
        url: "/designations/deleteDesignation",
        data: data,
        dataType: 'json'
    }).always(function (data, textStatus, jqXHR) {

        $("#deleteDesignationLoader").hide();
        ajaxResponseHandler(
            data,
            textStatus,
            jqXHR,
            (responseData) => {
                if (responseData.msg) {
                    $("#modalDeleteDesignation").modal('hide');
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

function addEditDesignation(designationName, designationAbbr,  departmentId, companyId, designationId = undefined) {

    let data = { designationName: designationName, designationAbbr: designationAbbr, departmentId: departmentId, companyId: companyId }
    if (designationId != undefined) {
        data.designationId = designationId;
    }

    $("#addEditDesignationLoader").show();
    $.ajax({
        type: "POST",
        url: "/designations/addEditDesignation",
        data: data,
        dataType: 'json'
    }).always(function (data, textStatus, jqXHR) {

        $("#addEditDesignationLoader").hide();
        ajaxResponseHandler(
            data,
            textStatus,
            jqXHR,
            (responseData) => {
                if (responseData.msg) {
                    $("#modalAddEditDesignation").modal('hide');
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