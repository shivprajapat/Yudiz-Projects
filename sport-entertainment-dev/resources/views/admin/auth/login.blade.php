@extends('admin.layouts.auth')

@section('content')
    <div class="d-flex flex-column flex-root">
        <div class="login login-4 login-signin-on d-flex flex-row-fluid">
            <div class="d-flex flex-center flex-row-fluid bgi-size-cover bgi-position-top bgi-no-repeat" style="background-image: url({{ asset('assets/media/bg/bg-3.jpg') }});">
                <div class="login-form text-center p-7 position-relative overflow-hidden" style="max-width: 450px;width:100%">
                    <div class="d-flex flex-center mb-15">
                        <a href="#">
                            <img class="img-fluid" style="max-width: 240px; max-height: 60px;" src="{{ $sitesetting['site_logo'] ? generate_url($sitesetting['site_logo']) : asset('frontend/images/logo.png')  }}" />
                        </a>
                    </div>
                    <div class="login-signin">
                        <div class="mb-20">
                            <h3>Login To Your Account</h3>
                            <div class="text-muted font-weight-bold">Enter your details to login to your account:</div>
                        </div>
                        <form id="frmLogin" method="POST" action="{{ route('admin.login') }}" class="form" >
                            @csrf
                            <div class="form-group mb-5 fv-plugins-icon-container">
                                <input type="text" class="form-control h-auto py-4 px-8 @error('email') is-invalid @enderror" id="email" name="email" value="{{ old('email') }}" placeholder="Email" />
                                @if ($errors->has('email'))
                                    <span class="invalid-feedback">
                                        <strong>{{ $errors->first('email') }}</strong>
                                    </span>
                                @endif
                            </div>
                            <div class="form-group text-left mb-5 fv-plugins-icon-container">
                                <div class="input-group">
                                    <input type="password"
                                        class="form-control h-auto py-4 px-8 @error('password') is-invalid @enderror"
                                        id="password" name="password" placeholder="Password" value="{{ old('password') }}"  data-error-container="#password-error"/>
                                        <div class="input-group-append"><span class="input-group-text" ><i class="far fa-eye" id="togglePassword" ></i></span></div>
                                    @if ($errors->has('password'))
                                        <span class="invalid-feedback text-left">
                                            <strong>{{ $errors->first('password') }}</strong>
                                        </span>
                                    @endif
                                </div>
                                <span id="password-error"> </span>
                            </div>
                            <div class="form-group d-flex flex-wrap justify-content-between align-items-center">
                                <div class="checkbox-inline">
                                    <label class="checkbox m-0 text-muted" for="remember_me">
                                    <input type="checkbox"  id="remember_me" name="remember_me">
                                    <span></span>Remember me</label>
                                </div>
                                <a href="{{ route('admin.password.request') }}" class="text-muted text-hover-primary">Forgot password ?</a>
                            </div>
                            <button type="submit" class="btn btn-pill btn-primary font-weight-bold px-9 py-4 my-3 mx-4 opacity-90 px-15 py-3">Login</button>
                        </form>

                    </div>
                    <div class="mt-10">
                        <p class="text-center text-muted">&copy; {{ \Carbon\Carbon::today()->format('F, Y') }} | {{ config('app.name') }}. All Rights Reserved</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('extra-js')
    <script src="{{ asset('assets/admin/js/custom_validations.js') }}"></script>
    <script>
        $(document).ready(function () {
            const togglePassword = document.querySelector('#togglePassword');
            const password = document.querySelector('#password');

            togglePassword.addEventListener('click', function (e) {
                // toggle the type attribute
                const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
                password.setAttribute('type', type);
                // toggle the eye slash icon
                this.classList.toggle('fa-eye-slash');
            });

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
                        required: "@lang('validation.required',['attribute'=>'email address'])",
                        maxlength:"@lang('validation.max.string',['attribute'=>'email address','max'=>80])",
                        email:"@lang('validation.email',['attribute'=>'email address'])",
                        valid_email:"@lang('validation.email',['attribute'=>'email address'])",
                    },
                    password: {
                        required:"@lang('validation.required',['attribute'=>'password'])",
                        minlength:"@lang('validation.min.string',['attribute'=>'password','min'=>8])",
                    },
                },
                errorClass: 'invalid-feedback',
                errorElement: 'span',
                highlight: function (element) {
                    $(element).addClass('is-invalid');
                    $(element).siblings('label').addClass('text-danger'); // For Label
                },
                unhighlight: function (element) {
                    $(element).removeClass('is-invalid');
                    $(element).siblings('label').removeClass('text-danger'); // For Label
                },
                errorPlacement: function (error, element) {
                    if (element.attr("data-error-container")) {
                        error.appendTo(element.attr("data-error-container"));
                    } else {
                        error.insertAfter(element);
                    }
                }
            });

            $('#frmLogin').submit(function () {
                if ($(this).valid()) { console.log("validated");
                    $("input[type=submit], input[type=button], button[type=submit]").prop("disabled", "disabled");
                    return true;
                } else {
                    return false;
                }
            });
        });
    </script>
@endpush
