var departmentsList = [];
$(document).ready(function () {

    $(".btnAddDepartment").on('click', () => {
        $("#inputDepartmentId").val("");
        $("#inputDepartmentName").val("");
        $("#inputDepartmentAbbr").val("");
        $("#modalAddEditDepartment").modal('show');
    });


    $(".deleteDepartment").on('click', () => {
        let departmentToDelete = $("#inputDeleteDepartmentId").val();
        deleteDepartment(departmentToDelete)
    })

    $(".saveDepartment").on('click', () => {
        let departmentId = $("#inputDepartmentId").val();
        let departmentName = $("#inputDepartmentName").val();
        let departmentNameAbbr = $("#inputDepartmentAbbr").val();

        if (departmentId.trim() != "") {
            addEditDepartment(departmentName, departmentNameAbbr, 1, departmentId);
        } else {
            addEditDepartment(departmentName, departmentNameAbbr, 1);
        }
    })

    getDepartmentsList();

})

function onRowEditClick(departmentId){
    console.log("departmentId", departmentId);
    let department = getDataFromList(departmentId);
    $("#inputDepartmentId").val(department.departmentId);
    $("#inputDepartmentName").val(department.departmentName);
    $("#inputDepartmentAbbr").val(department.departmentNameAbbr);

    $("#modalAddEditDepartment").modal();
}

function onRowDeleteClick(departmentId){

    console.log("departmentId", departmentId)
    let department = getDataFromList(departmentId);
    console.log("department", department)
    $("#inputDeleteDepartmentId").val(department.departmentId);
    $("#toBeDeletedDepartmentName").html(`${department.departmentName}(${department.departmentNameAbbr})`)

    $("#modalDeleteDepartment").modal();
}
function testButton(id) {
    console.log("testButton", id);
}

function getDataFromList(id) {
    for (let i = 0; i < departmentsList.length; i++) {
        let department = departmentsList[i];
        if (department.departmentId == id) {
            return department;
        }
    }
}

function populateDepartmentTable() {
    
    let role = $("#currentUserRole").val();
    let departmentTableBodyContent = "";

    for (let i = 0; i < departmentsList.length; i++) {
        let department = departmentsList[i];
        departmentTableBodyContent +=
        `<tr>
            <td>${department.departmentId}</td>
            <td>${department.departmentName}</td>
            <td>${department.departmentNameAbbr}</td>
            <td>
            ${
                (role.toLowerCase() == 'admin' || role.toLowerCase() == 'hr')?
                `<button type="button" class="btn bg-gradient-primary btnEditDepartment" data-department-id="${department.departmentId}" onclick="onRowEditClick(${department.departmentId})">Edit</button>
                <button type="button" class="btn bg-gradient-danger btnDeleteDepartment" data-department-id="${department.departmentId}" onclick="onRowDeleteClick(${department.departmentId})">Delete</button>`
                :
                ``
            }
                
            </td>
        </tr>`;
    }

    $("#departmentTableBody").html(departmentTableBodyContent);

    $("#departmentTable").DataTable({
        "responsive": true,
        "lengthChange": false,
        "autoWidth": true
    });

}


function getDepartmentsList() {
    $("#pageContentLoader").show();
    $.ajax({
        type: "POST",
        url: "/departments/fetchDepartmentsList",
        data: { 'companyId': 1 },
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
                    departmentsList = responseData.data;
                    populateDepartmentTable()

                } else {
                    showFailureMessage("Something went wrong");
                }

            }
        );

    })
}


function deleteDepartment(departmentId) {
    let data = { departmentId: departmentId };

    $("#deleteDepartmentLoader").show();
    $.ajax({
        type: "POST",
        url: "/departments/deleteDepartment",
        data: data,
        dataType: 'json'
    }).always(function (data, textStatus, jqXHR) {

        $("#deleteDepartmentLoader").hide();
        ajaxResponseHandler(
            data,
            textStatus,
            jqXHR,
            (responseData) => {
                if (responseData.msg) {
                    $("#modalDeleteDepartment").modal('hide');
                    showSuccessMessage(responseData.msg);
                    //getDepartmentsList();
                    location.reload();
                } else {
                    showFailureMessage("Something went wrong");
                }

            }
        );

    })
}

function addEditDepartment(departmentName, departmentAbbr, companyId, departmentId = undefined) {

    let data = { departmentName: departmentName, departmentAbbr: departmentAbbr, companyId: companyId }
    if (departmentId != undefined) {
        data.departmentId = departmentId;
    }

    $("#addEditDepartmentLoader").show();
    $.ajax({
        type: "POST",
        url: "/departments/addEditDepartment",
        data: data,
        dataType: 'json'
    }).always(function (data, textStatus, jqXHR) {

        $("#addEditDepartmentLoader").hide();
        ajaxResponseHandler(
            data,
            textStatus,
            jqXHR,
            (responseData) => {
                if (responseData.msg) {
                    $("#modalAddEditDepartment").modal('hide');
                    showSuccessMessage(responseData.msg);
                    //getDepartmentsList();
                    location.reload();
                } else {
                    showFailureMessage("Something went wrong");
                }

            }
        );

    })
}