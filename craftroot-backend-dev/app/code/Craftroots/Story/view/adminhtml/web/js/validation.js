define(['jquery'], function ($) {
    'use strict'
    return function () {
        $.validator.addMethod("youtube", function (value, element) {
            if (value == '') return true;
            var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
            return (value.match(p)) ? RegExp.$1 : false;
        }, "Enter valid youtube URL");
    }
});