//Coaching center custom js here
$(".select2").select2(); //single
// $(".select2_multiple").select2(); //multiple
//when key is press then only digits are enter
$(".only_digit_enter").on("keypress", function (event) {
    var aCode = event.which ? event.which : event.keyCode;
    if (aCode > 31 && (aCode < 48 || aCode > 57)) return false;
    return true;
});


onload = function () {
    var ele = document.querySelector(".only_digit_with_dot");
    ele.onkeypress = function (e) {
        if (isNaN(this.value + "" + String.fromCharCode(e.charCode)))
            return false;
    };
    ele.onpaste = function (e) {
        e.preventDefault();
    };
};
