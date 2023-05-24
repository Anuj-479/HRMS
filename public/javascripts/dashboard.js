$(document).ready(function () {
    
    $("#pageContentLoader").show();
    $.ajax({
        type: "POST",
        url: "/fetchDashboardData",
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
                    $("#employeesCount").html(responseData.data[0].employeesCount)
                    $("#departmentsCount").html(responseData.data[0].departmentsCount)
                    $("#designationsCount").html(responseData.data[0].designationsCount)
                    $("#pendingLeaveRequestsCount").html(responseData.data[0].pendingLeaveRequestsCount)
                } else {
                    showFailureMessage("Something went wrong");
                }

            }
        );

    })


})