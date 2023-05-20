function showFailureMessage(msg){
    console.log('msg', msg);
    toastr.error(msg.toString())
}

function showSuccessMessage(msg){
    console.log('success msg', msg);
    toastr.success(msg.toString());
}

function showWarningMessage(msg){
    console.log('warning msg', msg);
    toastr.warning(msg.toString())

}

function handleNullValues(val, nullSub = "NA"){

    if(val == undefined || val == null){
        return nullSub;
    }

    return val;

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