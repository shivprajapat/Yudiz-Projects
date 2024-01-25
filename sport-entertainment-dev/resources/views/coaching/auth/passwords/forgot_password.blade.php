@extends('coaching.auth.layouts.app')
@section('content')
    <div class="d-flex flex-column flex-root">
        <!--begin::Login-->
        <div class="login login-3 wizard d-flex flex-column flex-lg-row flex-column-fluid">
            <div class="login-aside d-flex flex-column flex-row-auto">
                <!--begin::Aside Bottom-->
                <div class="aside-img d-flex flex-row-fluid bgi-no-repeat bgi-position-x-center"
                style="
                background-position-y: calc(100% + 5rem);
                background-image: url('{{ asset('frontend/images/logo.png') }}');
                background-position: center center;

              ">
            </div>
                <!--end::Aside Bottom-->
            </div>
            <div class="login-content flex-row-fluid d-flex flex-column p-10">
                <div class="d-flex flex-row-fluid flex-center">

                    <div class="login-form">
                        <form class="form" method="POST" action="{{ route('coaching.forgotPassword') }}"
                            id="fromForgotPassword" autocomplete="off">
                            @csrf
                            <div class="pb-5 pb-lg-15">
                                <h3 class="font-weight-bolder text-dark font-size-h2 font-size-h1-lg">
                                    Forgot password
                                </h3>
                                <div class="text-muted font-weight-bold font-size-h4">
                                    You will receive a password recovery link on your registered email Id
                                </div>
                            </div>
                            @if (session('status'))
                                <p class="bg-success text-white py-2 px-4">{{ session('status') }}</p>
                            @endif
                            <div class="form-group">
                                <label class="font-size-h6 font-weight-bolder text-dark">Your Email</label>
                                <input
                                    class="form-control h-auto py-7 px-6 rounded-lg border-0 @error('email') is-invalid @enderror"
                                    type="text" id="email" name="email" autocomplete="off"
                                    placeholder="Enter Your Email" />
                                @if ($errors->has('email'))
                                    <span class="invalid-feedback my-3" style="font-size: 13px">
                                        <strong>{{ $errors->first('email') }}</strong>
                                    </span>
                                @endif
                            </div>
                            <div class="pb-lg-0 pb-5">
                                <button type="submit" id="kt_login_singin_form_submit_button"
                                    class="btn btn-primary font-weight-bolder font-size-h6 px-8 py-4 my-3 mr-3">
                                    Submit
                                </button>
                            </div>
                        </form>
                        <div class="mt-10">
                            <p class="text-center text-muted font-weight-bold font-size-h4">&copy;
                                {{ \Carbon\Carbon::today()->format('F, Y') }} |
                                {{ config('app.name') }}. All Rights Reserved</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('extra-js')
    <script>
        $(document).ready(function() {
            $("#fromForgotPassword").validate({
                rules: {
                    email: {
                        required: true,
                        maxlength: 80,
                        email: true,
                        valid_email: true,
                    },
                },
                messages: {
                    email: {
                        required: "@lang('validation.required', ['attribute' => 'email address'])",
                        maxlength: "@lang('validation.max.string', ['attribute' => 'email address', 'max' => 80])",
                        email: "@lang('validation.email', ['attribute' => 'email address'])",
                        valid_email: "@lang('validation.email', ['attribute' => 'email address'])",
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

            $('#fromForgotPassword').submit(function() {
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
