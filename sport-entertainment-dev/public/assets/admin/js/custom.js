$(function() {
    $("div.alert").not(".alert-important").delay(3000).fadeOut(350);

    // Toaster Customization
    toastr.options = {
        closeButton: true,
        debug: false,
        newestOnTop: true,
        progressBar: false,
        positionClass: "toast-top-right",
        preventDuplicates: false,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "3000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
    };

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    /* Code to set sidebar li active */
    $(".page-sidebar-menu li")
        .filter(function() {
            return $(this).hasClass("active");
        })
        .parent("ul")
        .parent("li")
        .addClass("active open");

    $(".page-sidebar-menu li")
        .filter(function() {
            return $(this).hasClass("active");
        })
        .parent("ul")
        .siblings("a")
        .children("span.arrow")
        .addClass("open");

    /**
     *  Delete single record from database (using delete action)
     **/

    $(document).on("click", ".action-delete", function(e) {
        e.preventDefault();
        var action = $(this).data("target-href");
        Swal.fire({
            title: "Are you sure?",
            text: "You won't to delete this record!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then(function(result) {
            if (result.value) {
                $.ajax({
                    url: action,
                    type: "DELETE",
                    dataType: "json",
                    success: function(success) {
                        if (typeof oTable.draw !== "undefined") { oTable.draw(); } else if (typeof oTable.fnDraw !== "undefined") { oTable.fnDraw(); }
                    },
                });
                Swal.fire({
                    title: "Deleted!",
                    icon: "success",
                    text: "Record was deleted.",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        });
    });

    $(document).on("change", ".toggleSwitch", function(e) {
        var state = $(this).is(":checked");
        var url = $(this).data("url");
        var id = $(this).data("id");
        var customAct =
            typeof $(this).data("getaction") != "undefined" ?
            $(this).data("getaction") :
            "";
        var action = customAct != "" ? customAct : "change_status";
        var is_active;

        is_active = state ? 1 : 0;

        $.ajax({
            url: url,
            type: "PUT",
            dataType: "json",
            data: {
                _token: $("meta[name='csrf-token']").attr("content"),
                id: id,
                action: action,
                value: is_active,
            },
            success: function(success) {
                toastr.success("Status Changed!");
                // oTable.DataTable().ajax.reload();
            },
        });
    });

    $(document).on("click", ".all_select", function() {
        if ($(this).hasClass("allChecked")) {
            $('.dataTable tbody input[class="small-chk"]').prop(
                "checked",
                false
            );
        } else {
            $('.dataTable tbody input[class="small-chk"]').prop(
                "checked",
                true
            );
        }
        $(this).toggleClass("allChecked");
    });

    $(document).on(
        "click",
        ".dataTable tbody input[class=small-chk]",
        function() {
            var numberOfChecked = $(
                '.dataTable tbody input[class="small-chk"]:checked'
            ).length;
            var totalCheckboxes = $('.dataTable tbody input[class="small-chk"]')
                .length;

            if (numberOfChecked > 0) {
                if (numberOfChecked == totalCheckboxes) {
                    $(".all_select").prop("indeterminate", false);
                    $(".all_select").prop("checked", true);
                    $(".all_select").addClass("allChecked");
                } else {
                    if ($(".all_select").hasClass("allChecked")) {
                        $(".all_select").removeClass("allChecked");
                    }
                    $(".all_select").prop("indeterminate", true);
                }
            } else {
                $(".all_select").prop("indeterminate", false);
                $(".all_select").prop("checked", false);
            }
        }
    );

    $(document).on("click", ".delete_all_link", function(e) {
        $(".delete_all_link").attr("disabled", "disabled");
        e.preventDefault();
        var url = $(this).attr("href");
        var searchIDs = [];
        $(".dataTable tbody input[class='small-chk']:checked").each(
            function() {
                searchIDs.push($(this).val());
            }
        );
        if (searchIDs.length > 0) {
            var ids = searchIDs.join();
            Swal.fire({
                title: "Are you sure?",
                text: "You won't to delete this records!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
            }).then(function(result) {
                if (result.value) {
                    $.ajax({
                        url: url,
                        type: "DELETE",
                        dataType: "json",
                        data: {
                            action: "delete_all",
                            ids: ids,
                            _token: $('meta[name="csrf_token"]').attr(
                                "content"
                            ),
                        },
                        success: function(success) {
                            $(".all_select").prop("indeterminate", false);
                            $(".all_select").prop("checked", false);
                            if ($(".all_select").hasClass("allChecked")) {
                                $(".all_select").removeClass("allChecked");
                            }
                            $(".all_select").prop("indeterminate", false);
                            $(".delete_all_link").removeAttr("disabled");
                            // oTable.ajax.reload();
                            oTable.api().ajax.reload();
                        },
                    });

                    Swal.fire({
                        title: "Deleted!",
                        icon: "success",
                        text: "Records was deleted.",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            });
        } else {
            $(".all_select").prop("indeterminate", false);
            $(".delete_all_link").removeAttr("disabled");
        }
    });
});
$(document).on("click", ".paginate_button", function() {
    if ($('.all_select').hasClass("allChecked")) {
        $('.dataTable tbody input[class="small-chk"]').prop("checked", false);

        $(".all_select").prop("indeterminate", false);
        $(".all_select").prop("checked", false);
        $(".all_select").toggleClass("allChecked");
    }
});

function getStatusText(code) {
    sText = "";
    if (code !== undefined) {
        switch (code) {
            case 200:
                {
                    sText = "Success";
                    break;
                }
            case 404:
                {
                    sText = "Error";
                    break;
                }
            case 403:
                {
                    sText = "Error";
                    break;
                }
            case 500:
                {
                    sText = "Error";
                    break;
                }
            case "success":
                {
                    sText = "Success";
                    break;
                }
            case "danger":
                {
                    sText = "Error";
                    break;
                }
            case "warning":
                {
                    sText = "Error";
                    break;
                }
            default:
                {
                    sText = "Error";
                }
        }
    }
    return sText;
}

function showMessage(sType, sText) {
    sType = getStatusText(sType);
    toastr[sType.toLowerCase()](sText);
}

jQuery.validator.addMethod(
    "not_empty",
    function(value, element) {
        return this.optional(element) || /\S/.test(value);
    },
    "Only space is not allowed."
);

jQuery.validator.addMethod(
    "not_equal",
    function(value, element, compare_with) {
        return value != $(compare_with).val();
    },
    "Same values are not allowed."
);

jQuery.validator.addMethod(
    "no_space",
    function(value, element) {
        return value.indexOf(" ") < 0 && value != "";
    },
    "Space is not allowed."
);

jQuery.validator.addMethod(
    "alpha_numeric",
    function(value, element) {
        return this.optional(element) || /^[a-zA-Z0-9\s.]+$/.test(value);
    },
    "This field may only contain letters, numbers and space."
);

function addOverlay() {
    $('<div class="page-loader page-loader-base" id="overlayDocument"><div class="page-loader page-loader-non-block" ><div class="blockui"><span>Please   wait...</span><span><div class="spinner spinner-primary"></div></span></div></div></div>').prependTo(document.body);
    $("#overlayDocument").show().children().show();
}

function removeOverlay() { $('#overlayDocument').remove(); }

/**
 *  Delete single record button given on view
 **/

$(document).on("click", "#top_delete", function(e) {
    e.preventDefault();
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    var action = $(this).data("target-href");
    Swal.fire({
        title: "Are you sure?",
        text: "You won't to delete this record!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
    }).then(function(result) {
        if (result.value) {
            $.ajax({
                url: action,
                type: "DELETE",
                dataType: "json",
                success: function(success) {
                    window.location.href = userIndexRoute;
                },
            });
            Swal.fire({
                title: "Deleted!",
                icon: "success",
                text: "Record was deleted.",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    });
});
