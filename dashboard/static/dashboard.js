
$('.input-daterange.individual-filter input').each(function() {
    $(this).datepicker({
        autoclose: true,
        format: 'yyyy-mm-dd',
    })
    .on('changeDate', function(e) {
        if (e.currentTarget.name == 'start')
            start = e.currentTarget.value;
        else
            end = e.currentTarget.value;
        if (start > end)
            start = end;
        changeURL();
    });
});

$('table').dataTable({
    "sort": false,
});

function changeType(type) {
    rtype = type;
    changeURL();
}

function changeURL() {
    location.href = `/?rtype=${rtype}&start=${start}&end=${end}&paypal=${paypal}`;
}

function changePaypal() {
    paypal = $('#paypal_select').val();
    changeURL();
}