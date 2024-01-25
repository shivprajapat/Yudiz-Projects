@extends('coaching.layouts.app')
@push('extra-css')
    <style>
        .password-container {
            position: relative;
        }

        .password-container input[type="password"],
        .password-container input[type="text"] {}

        .eye_password {
            position: absolute;
            top: 59%;
            right: 4%;
            cursor: pointer;
            color: lightgray;
        }
    </style>
@endpush
@section('content')
    <div class="container">
        <div class="card card-custom">
            <div class="card-header">
                <div class="card-title">
                    <span class="card-icon">
                        <i class="{{ $icon }} text-primary"></i>
                    </span>
                    <h3 class="card-label text-uppercase"> Change Password </h3>
                </div>
            </div>

            <form id="frmChangePassword" method="POST" action="{{ route('coaching.updatePassword') }}">
                @csrf
                <div class="card-body">
                    <div class="form-group row">
                        <div class="col-md-5">
                            <label for="password"> Old Password: </label>
                            <input type="password" class="form-control @error('old_password') is-invalid @enderror"
                                id="old_password" name="old_password" value="{{ old('old_password') }}" />
                            <i class="far fa-eye eye_password" id="eye"></i>

                            @if ($errors->has('old_password'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('old_password') }}</strong>
                                </span>
                            @endif
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-md-5">
                            <label for="password"> New Password: </label>
                            <input type="password" class="form-control @error('password') is-invalid @enderror"
                                id="password" name="password" value="{{ old('password') }}" />
                            <i class="far fa-eye eye_password" id="eye"></i>

                            @if ($errors->has('password'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('password') }}</strong>
                                </span>
                            @endif
                        </div>
                    </div>

                    <div class="form-group row">
                        <div class="col-md-5">
                            <label for="password_confirmation"> Re-enter new Password: </label>
                            <input type="password" class="form-control @error('password') is-invalid @enderror"
                                id="password_confirmation" name="password_confirmation"
                                value="{{ old('password_confirmation') }}" />
                            <i class="far fa-eye eye_password" id="eye"></i>

                            @if ($errors->has('password_confirmation'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('password_confirmation') }}</strong>
                                </span>
                            @endif
                        </div>
                    </div>
                    <div class="card-footer">
                        <button type="submit" class="btn btn-primary mr-2"> Save </button>
                        <a href="{{ route('coaching.dashboard') }}" class="btn btn-secondary mr-4">Cancel</a>
                    </div>
            </form>
        </div>
    </div>
@endsection
@push('extra-js')
    <script src="{{ asset('assets/admin/js/custom_validations.js') }}"></script>
    <script>
        $(document).on('click', '.eye_password', function() {
            $(this).toggleClass("fa-eye fa-eye-slash");
            var type = $(this).hasClass("fa-eye-slash") ? "text" : "password";
            $(this).siblings("input").attr("type", type);
        })
        $(document).ready(function() {
            $("#frmChangePassword").validate({
                rules: {
                    old_password: {
                        required: true,
                        maxlength: 80,
                        minlength: 6,
                    },
                    password: {
                        required: true,
                        maxlength: 80,
                        minlength: 6,
                    },
                    password_confirmation: {
                        required: true,
                        maxlength: 80,
                        minlength: 6,
                        equalTo: "#password"
                    },
                },
                messages: {
                    old_password: {
                        required: "@lang('validation.required', ['attribute' => 'old password'])",
                        maxlength: "@lang('validation.max.string', ['attribute' => 'old password', 'max' => 80])",
                        minlength: "@lang('validation.min.string', ['attribute' => 'old password', 'min' => 6])",
                    },
                    password: {
                        required: "@lang('validation.required', ['attribute' => 'password'])",
                        minlength: "@lang('validation.min.string', ['attribute' => 'password', 'min' => 6])",
                    },
                    password_confirmation: {
                        required: "@lang('validation.required', ['attribute' => 're-enter password'])",
                        minlength: "@lang('validation.min.string', ['attribute' => 're-entered password', 'min' => 6])",
                        equalTo: "Re-entered password is not same."
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

            $('#frmChangePassword').submit(function() {
                if ($(this).valid()) {
                    console.log("validated");
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
