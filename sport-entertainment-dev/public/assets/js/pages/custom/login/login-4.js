"use strict";

var KTLogin = (function () {
    var _handleFormSignup = function () {
        var wizardEl = KTUtil.getById("kt_login");
        var form = KTUtil.getById("kt_login_signup_form");
        var wizardObj;
        var validations = [];

        if (!form) {
            return;
        }

        // Step 1
        validations.push(
            FormValidation.formValidation(form, {
                fields: {
                    first_name: {
                        validators: {
                            notEmpty: {
                                message: "First name is required",
                            },
                            stringLength: {
                                max: 50,
                                min: 3,
                                message:
                                    "First name is must contain 3 character.",
                            },
                            regexp: {
                                regexp: /^[a-z\s]+$/i,
                                message:
                                    "The first name can consist of alphabetical characters and spaces only.",
                            },
                        },
                    },
                    last_name: {
                        validators: {
                            notEmpty: {
                                message: "Last Name is required",
                            },
                            regexp: {
                                regexp: /^[a-z\s]+$/i,
                                message:
                                    "The Last name can consist of alphabetical characters and spaces only.",
                            },
                        },
                    },
                    mobile_number: {
                        validators: {
                            notEmpty: {
                                message: "Phone is required",
                            },
                            regexp: {
                                regexp: /^[0-9]+$/i,
                                message:
                                    "The mobile number can consist only digits.",
                            },
                            stringLength: {
                                max: 10,
                                min: 10,
                                message: "Mobile number must be 10 digits.",
                            },
                        },
                    },
                    email: {
                        validators: {
                            notEmpty: {
                                message: "Email is required",
                            },
                            emailAddress: {
                                message:
                                    "The value is not a valid email address",
                            },
                        },
                    },
                    password: {
                        validators: {
                            notEmpty: {
                                message: "Password is required.",
                            },
                        },
                    },
                    password_confirmation: {
                        validators: {
                            notEmpty: {
                                message: "Confirm password is required.",
                            },
                            identical: {
                                compare: function () {
                                    return form.querySelector(
                                        '[name="password"]'
                                    ).value;
                                },
                                message:
                                    "The password and its confirm are not the same",
                            },
                        },
                    },
                    terms_and_contition: {
                        validators: {
                            notEmpty: {
                                message:
                                    "Please accept the terms and conditions to proceed.",
                            },
                        },
                    },
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap(),
                },
            })
        );

        // Step 2

        // console.log(colorField);
        let step_two_validation = FormValidation.formValidation(form, {
            fields: {
                coaching_name: {
                    validators: {
                        notEmpty: {
                            message: "Coaching centre name is required",
                        },
                        regexp: {
                            regexp: /^[a-z\s]+$/i,
                            message:
                                "The coaching centre can consist of alphabetical characters and spaces only.",
                        },
                    },
                },
                logo: {
                    validators: {
                        notEmpty: {
                            message: "Logo is required",
                        },
                        file: {
                            maxSize: 2 * 1024 * 1024,
                            message:
                                "The file must be in .pdf format and must not exceed 2MB in size",
                        },
                    },
                },
                "sport_id[]": {
                    validators: {
                        callback: {
                            message: "Please select sports.",
                            callback: function (input) {
                                // console.log(input);
                                const options =
                                    sportsIdSelected.select2("data");
                                // console.log(options);
                                if (
                                    Array.isArray(options) &&
                                    options.length == "0"
                                ) {
                                    return false;
                                }
                                return true;
                            },
                        },
                    },
                },
                experience: {
                    validators: {
                        notEmpty: {
                            message: "Please enter experience in year",
                        },
                        stringLength: {
                            max: 5,
                            message: "Enter proper year of experience",
                        },
                        regexp: {
                            regexp: /^(100(\.00?)?|[1-9][0-9]?(\.\d{1,2})?|0?\.\d{1,2})$/i,
                            message: 'Please enter a value less than 100 for years of experience.',
                        },
                    },
                },
                bio: {
                    validators: {
                        notEmpty: {
                            message: "Enter coaching center bio.",
                        },
                        stringLength: {
                            max: 500,
                            message: "Please enter maximum 500 characters.",
                        },
                    },
                },
                facility: {
                    validators: {
                        notEmpty: {
                            message: "Please select at least one facility.",
                        },
                    },
                },
            },
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap(),
                // transformer: new FormValidation.plugins.Transformer({
                //     experience: {
                //         notEmpty: function (field, element, validator) {
                //             // Get the field value
                //             const value = element.value;
                //             if (value > 100) {
                //                 value.trim();
                //                 return false;
                //             } else {
                //                 return true;
                //             }
                //             // Remove the spaces from beginning and ending
                //         },
                //     },
                // }),
            },
        });

        validations.push(step_two_validation);
        const sportsIdSelected = jQuery(
            form.querySelector('[name="sport_id[]"]')
        );
        sportsIdSelected.select2().on("change.select2", function () {
            step_two_validation.revalidateField("sport_id[]");
        });

        //step 3 coaching center details validation
        let form_third_step = FormValidation.formValidation(form, {
            fields: {
                contact_number: {
                    validators: {
                        notEmpty: {
                            message:
                                "Please enter coaching center mobile numbers.",
                        },
                        stringLength: {
                            max: 10,
                            min: 10,
                            message: "Mobile number must be 10 digits.",
                        },
                        regexp: {
                            regexp: /^[0-9]+$/i,
                            message:
                                "The coaching center mobile number is contain only numbers..",
                        },
                    },
                },
                contact_email: {
                    validators: {
                        notEmpty: {
                            message: "Coaching center email is required.",
                        },
                        emailAddress: {
                            message: "The value is not a valid email address.",
                        },
                    },
                },
                state_id: {
                    validators: {
                        notEmpty: {
                            message: "Please select the state.",
                        },
                        callback: {
                            message: "Please choose the state",
                            callback: function (input) {
                                const options = stateValidate.select2("data");
                                return options != null;
                            },
                        },
                    },
                },
                city_id: {
                    validators: {
                        notEmpty: {
                            message: "Please select the city.",
                        },
                        callback: {
                            message: "Please choose the city",
                            callback: function (input) {
                                const options = cityValidate.select2("data");
                                return options != null;
                            },
                        },
                    },
                },
                address_line1: {
                    validators: {
                        notEmpty: {
                            message: "Coaching center address is required.",
                        },
                        stringLength: {
                            max: 200,
                            message:
                                "Address maximum is 200 character.",
                        },
                    },
                },
                pincode: {
                    validators: {
                        notEmpty: {
                            message: "Please enter postal code.",
                        },
                        stringLength: {
                            max: 6,
                            min: 6,
                            message: "postal code is must be 6 characters.",
                        },
                        regexp: {
                            regexp: /^[0-9]+$/i,
                            message: "The postal code can consist only digits.",
                        },
                    },
                },
            },
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap(),
            },
        });
        validations.push(form_third_step);

        const stateValidate = jQuery(
            document.querySelector('[name="state_id"]')
        );
        stateValidate.select2().on("change.select2", function () {
            step_two_validation.revalidateField("state_id");
        });

        const cityValidate = jQuery(document.querySelector('[name="city_id"]'));
        cityValidate.select2().on("change.select2", function () {
            step_two_validation.revalidateField("city_id");
        });

        //step 4 bank account details validation
        let stepFourValidation = FormValidation.formValidation(form, {
            fields: {
                account_person_name: {
                    validators: {
                        notEmpty: {
                            message: "Please enter account person name.",
                        },
                        stringLength: {
                            max: 60,
                            message:
                                "Account person name is not more then 60 characters..",
                        },
                        regexp: {
                            regexp: /^[a-z\s]+$/i,
                            message:
                                "The account person name is only accept the alpha characters.",
                        },
                    },
                },
                bank_name: {
                    validators: {
                        notEmpty: {
                            message: "Please enter bank name.",
                        },
                        stringLength: {
                            max: 60,
                            message:
                                "The bank name is not more then 60 characters..",
                        },
                        regexp: {
                            regexp: /^[a-z\s]+$/i,
                            message:
                                "The bank name is only accept the alpha characters.",
                        },
                    },
                },
                account_number: {
                    validators: {
                        notEmpty: {
                            message: "Please enter the bank account number.",
                        },
                        stringLength: {
                            max: 60,
                            message:
                                "The bank account number is not contain more then 60 characters..",
                        },
                        regexp: {
                            regexp: /^[a-zA-Z0-9_\s]+$/i,
                            message: "Please enter proper account number.",
                        },
                    },
                },
                ifsc_code: {
                    validators: {
                        notEmpty: {
                            message: "Please enter the bank isfc code.",
                        },
                        stringLength: {
                            max: 60,
                            message:
                                "The bank account isfc is not contain more then 60 characters..",
                        },
                        regexp: {
                            regexp: /^[a-zA-Z0-9_\s]+$/i,
                            message: "Please enter proper isfc code.",
                        },
                    },
                },
            },
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap(),
            },
        });

        //manually add the form validation rules for step 4
        const submitButton = document.getElementById(
            "kt_login_signup_form_submit_button"
        );
        submitButton.addEventListener("click", function (e) {
            e.preventDefault();
            if (stepFourValidation) {
                // console.log("hii hardik");
                // debugger;
                stepFourValidation.validate().then(function (status) {
                    if (status == "Valid") {
                        submitButton.setAttribute("data-kt-indicator", "on");
                        submitButton.disabled = true;
                        setTimeout(function () {
                            // Remove loading indication
                            submitButton.removeAttribute("data-kt-indicator");
                            submitButton.disabled = false;
                            form.submit(); // Submit form
                        }, 1000);
                    }
                });
            }
        });

        // Initialize form wizard
        wizardObj = new KTWizard(wizardEl, {
            startStep: 1, // initial active step number
            clickableSteps: false, // to make steps clickable this set value true and add data-wizard-clickable="true" in HTML for class="wizard" element
        });

        // Validation before going to next page
        wizardObj.on("beforeNext", function (wizard) {
            validations[wizard.getStep() - 1]
                .validate()
                .then(function (status) {
                    // return false;
                    if (status == "Valid") {
                        wizardObj.goNext();
                        KTUtil.scrollTop();
                    } else {
                        KTUtil.scrollTop();
                    }
                });

            wizardObj.stop(); // Don't go to the next step
        });

        // Change event
        wizardObj.on("change", function (wizard) {
            KTUtil.scrollTop();
        });
    };

    // Public Functions
    return {
        init: function () {
            // _handleFormSignin();
            // _handleFormForgot();
            _handleFormSignup();
        },
    };
})();

// Class Initialization
jQuery(document).ready(function () {
    KTLogin.init();
});
