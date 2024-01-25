require(
    [
        'jquery',
        'mage/translate',
    ],
    function ($) {
        $("#contact_images_delete").css("display", "none");
        $(".delete-image").find('label').css("display", "none");
        $(document).on('click', '.wsproductsgrid-contacts-edit input[type="checkbox"]', function() { 
            $('input[type="checkbox"]').not(this).prop('checked', false);
            var check_val = $("input:checkbox:checked").val();
            $('input[name="products"]').val("");
            $('input[name="products"]').val(check_val); 
        });

           
    }
);