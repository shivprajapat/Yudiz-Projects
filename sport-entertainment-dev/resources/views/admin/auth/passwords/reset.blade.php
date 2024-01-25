@extends('admin.layouts.auth')

@section('content')
    <div class="d-flex flex-column flex-root">
        <div class="login login-4 login-signin-on d-flex flex-row-fluid">
            <div class="d-flex flex-center flex-row-fluid bgi-size-cover bgi-position-top bgi-no-repeat"
                style="background-image: url({{ asset('assets/media/bg/bg-3.jpg') }});">
                <div class="login-form text-center p-7 position-relative overflow-hidden" style="max-width: 450px;width:100%">
                    <div class="d-flex flex-center mb-15">
                        <a href="#">
                            <img class="img-fluid" style="max-width: 240px; max-height: 60px;"
                                src="{{ $sitesetting['site_logo'] ? generate_url($sitesetting['site_logo']) : asset('frontend/images/logo.png') }}"
                                alt="{{ env('APP_NAME') }}" />
                        </a>
                    </div>
                    <div class="login-signin">
                        <div class="mb-20">
                            <h3>Reset Password</h3>
                            <div class="text-muted font-weight-bold">Enter your email and new password.</div>
                        </div>

                        <form class="form-horizontal" id="resetpwdForm" role="form" method="POST"
                            action="{{ url('/admin/password/reset') }}" class="form">
                            @csrf
                            <input type="hidden" name="token" value="{{ $token }}">
                            <div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">
                                <input id="email" type="email" class="form-control h-auto py-4 px-8 bg-secondary"
                                    name="email" value="{{ $email ?? old('email') }}" required autocomplete="email"
                                    readonly placeholder="Email">
                                @if ($errors->has('email'))
                                    <span class="help-block">
                                        <strong class="text-danger">{{ $errors->first('email') }}</strong>
                                    </span>
                                @endif
                            </div>

                            <div class="form-group{{ $errors->has('password') ? ' has-error' : '' }}">
                                <input id="password" type="password" class="form-control h-auto py-4 px-8" name="password"
                                    placeholder="Password"required autocomplete="new-password" autofocus>

                                @if ($errors->has('password'))
                                    <span class="help-block">
                                        <strong class="text-danger">{{ $errors->first('password') }}</strong>
                                    </span>
                                @endif
                            </div>

                            <div class="form-group{{ $errors->has('password_confirmation') ? ' has-error' : '' }}">
                                <input id="password-confirm" type="password" class="form-control h-auto py-4 px-8"
                                    placeholder="Confirm Password" name="password_confirmation" required
                                    autocomplete="new-password">
                                @if ($errors->has('password_confirmation'))
                                    <span class="help-block">
                                        <strong class="text-danger">{{ $errors->first('password_confirmation') }}</strong>
                                    </span>
                                @endif
                            </div>

                            <button type="submit"
                                class="btn btn-pill btn-primary font-weight-bold px-9  my-3 mx-4 opacity-90 px-15 py-3">
                                Reset Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('extra-js')
    <script src="{{ asset('assets/admin/js/custom_validations.js') }}"></script>
    <script>
        $(document).ready(function() {
            $("#resetpwdForm").validate({
                rules: {
                    email: {
                        required: true,
                        maxlength: 80,
                        email: true,
                        valid_email: true,
                    },
                    password: {
                        required: true,
                        no_space: true,
                        minlength: 8,
                        maxlength: 16,
                    },
                    password_confirmation: {
                        required: true,
                        no_space: true,
                        minlength: 8,
                        maxlength: 16,
                        equalTo: '#password'
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
                        required: "The Password field is required.",
                        no_space: "The Password must not have space.",
                        minlength: "The Password must be at least 8 characters.",
                        maxlength: "The Password may not be greater than 16 characters."
                    },
                    password_confirmation: {
                        required: "The Confirm Password field is required.",
                        no_space: "The Confirm Password must not have space.",
                        minlength: "The Confirm Password must be at least 8 characters.",
                        maxlength: "The Confirm Password may not be greater than 16 characters.",
                        equalTo: "The Confirm Password does not match Password.",
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
                        error.insertAfter(element);
                    }
                }
            });

            $('#resetpwdForm').submit(function() {
                if ($(this).valid()) {
                    $("input[type=submit], input[type=button], button[type=submit]").prop("disabled",
                        "disabled");
                    return true;
                } else {
                    return false;
                }
            });
        });
    </script>
@endpush
