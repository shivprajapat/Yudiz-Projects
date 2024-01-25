@extends('coaching.auth.layouts.app')
@push('extra-css')
    <style>
        .password-container {
            position: relative;
        }

        .password-container input[type="password"],
        .password-container input[type="text"] {}
    </style>
@endpush
@section('content')
    <div class="d-flex flex-column flex-root">
        <!--begin::Login-->
        <div class="login login-3 wizard d-flex flex-column flex-lg-row flex-column-fluid">
            <div class="login-aside d-flex flex-column flex-row-auto">
                <div class="aside-img d-flex flex-row-fluid bgi-no-repeat bgi-position-x-center"
                    style="
                    background-position-y: calc(100% + 5rem);
                    background-image: url('{{ asset('frontend/images/logo.png') }}');
                    background-position: center center;">
                </div>
            </div>
            <div class="login-content flex-row-fluid d-flex flex-column p-10">

                <div class="d-flex flex-row-fluid flex-center">
                    <div class="login-form">
                        <form class="form" method="POST" action="{{ route('coaching.verifyLogin') }}" id="frmLogin"
                            autocomplete="off">
                            @csrf
                            <div class="pb-5 pb-lg-15">
                                <h3 class="font-weight-bolder text-dark font-size-h2 font-size-h1-lg">
                                    Sign In
                                </h3>
                                <div class="text-muted font-weight-bold font-size-h4">
                                    New User?
                                    <a href=" {{ route('coaching.register') }} "
                                        class="text-primary font-weight-bolder">Create Account</a>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="font-size-h6 font-weight-bolder text-dark">Your Email</label>
                                <input
                                    class="form-control h-auto py-7 px-6 rounded-lg border-0 @error('email') is-invalid @enderror"
                                    type="text" id="email" name="email" placeholder="Email" />
                                @if ($errors->has('email'))
                                    <span class="invalid-feedback">
                                        <strong>{{ $errors->first('email') }}</strong>
                                    </span>
                                @endif
                            </div>
                            <div class="form-group">
                                <div class="d-flex justify-content-between mt-n5">
                                    <label class="font-size-h6 font-weight-bolder text-dark pt-5">Your Password</label>
                                    <a href=" {{ route('coaching.showForgotPassword') }} "
                                        class="text-primary font-size-h6 font-weight-bolder text-hover-primary pt-5">Forgot
                                        Password ?</a>
                                </div>
                                <div class="password-container">
                                    <div class="input-group flex-nowrap login-custom-password">
                                        <input type="password" name="password" id="password"
                                            class="form-control h-auto py-7 px-6 rounded-lg border-0 "
                                            placeholder="Password" aria-label="Username" aria-describedby="addon-wrapping">
                                        <span class="input-group-text" id="addon-wrapping"><i class="far fa-eye"
                                                id="eye"></i></span>
                                    </div>

                                    @if ($errors->has('password'))
                                        <span class="invalid-feedback text-left">
                                            <strong>{{ $errors->first('password') }}</strong>
                                        </span>
                                    @endif
                                </div>
                            </div>
                            <input type="hidden" name="web_token" id="web_token">
                            <div class="pb-lg-0 pb-5">
                                <button type="submit" id="kt_login_singin_form_submit_button"
                                    class="btn btn-primary font-weight-bolder font-size-h6 px-8 py-4 my-3 mr-3">
                                    Sign In
                                </button>
                            </div>
                        </form>
                        <div class="mt-10">
                            <p class="text-center text-muted">&copy; {{ \Carbon\Carbon::today()->format('F, Y') }} |
                                {{ config('app.name') }}. All Rights Reserved</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('extra-js')
    <script src="{{ asset('assets/admin/js/custom_validations.js') }}"></script>
    <script src="https://www.gstatic.com/firebasejs/8.3.2/firebase.js"></script>
    <script>
        $(document).ready(function() {
            const passwordInput = document.querySelector("#password");
            const eye = document.querySelector("#eye");
            eye.addEventListener("click", function() {
                this.classList.toggle("fa-eye-slash")
                const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
                passwordInput.setAttribute("type", type)
            })
            $("#frmLogin").validate({
                rules: {
                    email: {
                        required: true,
                        maxlength: 80,
                        email: true,
                        valid_email: true,
                    },
                    password: {
                        required: true,
                        minlength: 8,
                    },
                },
                messages: {
                    email: {
                        required: "@lang('validation.required', ['attribute' => 'email address'])",
                        maxlength: "@lang('validation.max.string', ['attribute' => 'email address', 'max' => 80])",
                        email: "@lang('validation.email', ['attribute' => 'email address'])",
                        valid_email: "@lang('validation.email', ['attribute' => 'email address'])",
                    },
                    password: {
                        required: "@lang('validation.required', ['attribute' => 'password'])",
                        minlength: "@lang('validation.min.string', ['attribute' => 'password', 'min' => 8])",
                    },
                },
                errorClass: 'invalid-feedback',
                errorElement: 'span',
                highlight: function(element) {
                    $(element).addClass('is-invalid');
                    $(element).siblings('label').addClass('text-danger'); // For Label
                },
                unhighlight: function(element) {
                    $(element).removeClass('is-invalid');
                    $(element).siblings('label').removeClass('text-danger'); // For Label
                },
                errorPlacement: function(error, element) {
                    if (element.attr("data-error-container")) {
                        error.appendTo(element.attr("data-error-container"));
                    } else {
                        if (element.attr("id") == "password") {
                            element.parent().after(error)
                        } else {
                            error.insertAfter(element);
                        }
                    }
                }
            });

            $('#frmLogin').submit(function() {
                if ($(this).valid()) {
                    console.log("validated");
                    $("input[type=submit], input[type=button], button[type=submit]").prop("disabled",
                        "disabled");
                    return true;
                } else {
                    return false;
                }
            });
            var firebaseConfig = {
                apiKey: "AIzaSyB9ZFDuGtYvJcqqsjO04uDuWhcjtSUd2CU",
                authDomain: "test-project-1625b.firebaseapp.com",
                projectId: "test-project-1625b",
                storageBucket: "test-project-1625b.appspot.com",
                messagingSenderId: "100074898491",
                appId: "1:100074898491:web:5554f31ed97ea9d26d881e"
            };

            firebase.initializeApp(firebaseConfig);
            // const messaging = firebase.messaging();

            var messaging = firebase.messaging();

            messaging.requestPermission()
                .then(function() {
                    return messaging.getToken();
                })
                .then(function(token) {
                    // Store the token in the hidden input field
                    document.getElementById('web_token').value = token;
                })
                .catch(function(error) {
                    console.error('Error obtaining Firebase token:', error);
                });
        });
    </script>
@endpush
