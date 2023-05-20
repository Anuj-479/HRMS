function showFailureMessage(msg) {
    console.log('msg', msg);
    toastr.error(msg.toString())
}

function showSuccessMessage(msg) {
    console.log('success msg', msg);
    toastr.success(msg.toString());
}

function showWarningMessage(msg) {
    console.log('warning msg', msg);
    toastr.warning(msg.toString())

}

function handleNullValues(val, nullSub = "NA") {

    if (val == undefined || val == null) {
        return nullSub;
    }

    return val;

}

function formatDate(date) {
    if (date == undefined || date == null || date == "") {
        return "";
    }
    const d = new Date(date);
    const yyyy = d.getFullYear();
    let mm = d.getMonth() + 1; // Months start at 0!
    let dd = d.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedDate = yyyy + '-' + mm + '-' + dd;

    return formattedDate;

}

function ajaxResponseHandler(data, textStatus, jqXHR, successCallback) {
    if (textStatus == 'success') {
        successCallback(data);
    } else {
        if (data.responseJSON != null && data.responseJSON != undefined && data.responseJSON.msg) {
            showFailureMessage(data.responseJSON.msg);
        } else if (data.responseJSON != null && data.responseJSON != undefined && data.responseJSON.Error) {
            showFailureMessage(data.responseJSON.Error);
        } else if (data.responseJSON != null && data.responseJSON != undefined && data.responseJSON.err) {
            showFailureMessage(data.responseJSON.err);
        } else {
            showFailureMessage(jqXHR);
        }
    }
}