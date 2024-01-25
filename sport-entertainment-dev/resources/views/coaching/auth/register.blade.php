@extends('coaching.auth.layouts.app')
@push('extra-css')
    <script src=" {{ asset('assets/frontend/js/tagify.js') }}"></script>
    <script src="{{ asset('assets/frontend/js/tagify.polyfills.min.js') }}"></script>
    <link href=" {{ asset('assets/frontend/css/tagify.css') }}" rel="stylesheet" type="text/css" />
    <style>
        .select2-selection__rendered {
            line-height: 31px !important;
        }

        .select2-container .select2-selection--single {
            height: 35px !important;
        }

        .select2-selection__arrow {
            height: 34px !important;
        }
    </style>
@endpush
@section('content')

    <body id="kt_body"
        class="header-fixed header-mobile-fixed subheader-enabled subheader-fixed aside-enabled aside-fixed aside-minimize-hoverable page-loading">
        <div class="d-flex flex-column flex-root">
            <div class="login login-4 wizard d-flex flex-column flex-lg-row flex-column-fluid wizard register-login"
                id="kt_login">
                <div class="login-aside order-1 order-lg-1 bgi-no-repeat bgi-position-x-right" id="logo_background"
                    style="
                    background-position-y: calc(100% + 5rem);
                    background-image: url('{{ asset('frontend/images/logo.png') }}');
                    background-position: center center;
                  ">
                    {{-- <div class="login-conteiner bgi-no-repeat bgi-position-x-right bgi-position-y-bottom">
                        <h3
                            class="pt-lg-40 pl-lg-20 pb-lg-0 pl-10 py-20 m-0 d-flex justify-content-lg-start font-weight-boldest display5 display1-lg text-white">
                            We Got
                            <br />A Surprise
                            <br />For You
                        </h3>
                    </div> --}}

                </div>
                <div class="login-container d-flex flex-center flex-row flex-row-fluid order-2 order-lg-1 flex-row-fluid py-lg-0 pb-lg-0 pt-15 pb-12"
                    style="#F3F5F9">
                    <div class="login-content login-content-signup d-flex flex-column">
                        <div class="d-flex flex-column-auto flex-column px-10">
                            <div class="wizard-nav pt-5 pt-lg-15 pb-10">
                                <div class="wizard-steps d-flex flex-column flex-sm-row">
                                    <div class="wizard-step flex-grow-1 flex-basis-0" data-wizard-type="step"
                                        data-wizard-state="current">
                                        <div class="wizard-wrapper pr-7">
                                            <div class="wizard-icon">
                                                <i class="wizard-check ki ki-check"></i>
                                                <span class="wizard-number">1</span>
                                            </div>
                                            <div class="wizard-label">
                                                <h3 class="wizard-title">Personal Details </h3>
                                            </div>
                                            <span class="svg-icon pl-6">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px"
                                                    viewBox="0 0 24 24" version="1.1">
                                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                        <polygon points="0 0 24 0 24 24 0 24" />
                                                        <rect fill="#000000" opacity="0.3"
                                                            transform="translate(8.500000, 12.000000) rotate(-90.000000) translate(-8.500000, -12.000000)"
                                                            x="7.5" y="7.5" width="2" height="9"
                                                            rx="1" />
                                                        <path
                                                            d="M9.70710318,15.7071045 C9.31657888,16.0976288 8.68341391,16.0976288 8.29288961,15.7071045 C7.90236532,15.3165802 7.90236532,14.6834152 8.29288961,14.2928909 L14.2928896,8.29289093 C14.6714686,7.914312 15.281055,7.90106637 15.675721,8.26284357 L21.675721,13.7628436 C22.08284,14.136036 22.1103429,14.7686034 21.7371505,15.1757223 C21.3639581,15.5828413 20.7313908,15.6103443 20.3242718,15.2371519 L15.0300721,10.3841355 L9.70710318,15.7071045 Z"
                                                            fill="#000000" fill-rule="nonzero"
                                                            transform="translate(14.999999, 11.999997) scale(1, -1) rotate(90.000000) translate(-14.999999, -11.999997)" />
                                                    </g>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="wizard-step flex-grow-1 flex-basis-0" data-wizard-type="step">
                                        <div class="wizard-wrapper pr-7">
                                            <div class="wizard-icon">
                                                <i class="wizard-check ki ki-check"></i>
                                                <span class="wizard-number">2</span>
                                            </div>
                                            <div class="wizard-label">
                                                <h3 class="wizard-title">Coaching Centre Details
                                                </h3>
                                            </div>
                                            <span class="svg-icon pl-6">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px"
                                                    viewBox="0 0 24 24" version="1.1">
                                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                        <polygon points="0 0 24 0 24 24 0 24" />
                                                        <rect fill="#000000" opacity="0.3"
                                                            transform="translate(8.500000, 12.000000) rotate(-90.000000) translate(-8.500000, -12.000000)"
                                                            x="7.5" y="7.5" width="2" height="9"
                                                            rx="1" />
                                                        <path
                                                            d="M9.70710318,15.7071045 C9.31657888,16.0976288 8.68341391,16.0976288 8.29288961,15.7071045 C7.90236532,15.3165802 7.90236532,14.6834152 8.29288961,14.2928909 L14.2928896,8.29289093 C14.6714686,7.914312 15.281055,7.90106637 15.675721,8.26284357 L21.675721,13.7628436 C22.08284,14.136036 22.1103429,14.7686034 21.7371505,15.1757223 C21.3639581,15.5828413 20.7313908,15.6103443 20.3242718,15.2371519 L15.0300721,10.3841355 L9.70710318,15.7071045 Z"
                                                            fill="#000000" fill-rule="nonzero"
                                                            transform="translate(14.999999, 11.999997) scale(1, -1) rotate(90.000000) translate(-14.999999, -11.999997)" />
                                                    </g>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="wizard-step flex-grow-1 flex-basis-0" data-wizard-type="step">
                                        <div class="wizard-wrapper pr-7">
                                            <div class="wizard-icon">
                                                <i class="wizard-check ki ki-check"></i>
                                                <span class="wizard-number">3</span>
                                            </div>
                                            <div class="wizard-label">
                                                <h3 class="wizard-title">Contact Details </h3>
                                            </div>
                                            <span class="svg-icon pl-6">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px"
                                                    viewBox="0 0 24 24" version="1.1">
                                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                        <polygon points="0 0 24 0 24 24 0 24" />
                                                        <rect fill="#000000" opacity="0.3"
                                                            transform="translate(8.500000, 12.000000) rotate(-90.000000) translate(-8.500000, -12.000000)"
                                                            x="7.5" y="7.5" width="2" height="9"
                                                            rx="1" />
                                                        <path
                                                            d="M9.70710318,15.7071045 C9.31657888,16.0976288 8.68341391,16.0976288 8.29288961,15.7071045 C7.90236532,15.3165802 7.90236532,14.6834152 8.29288961,14.2928909 L14.2928896,8.29289093 C14.6714686,7.914312 15.281055,7.90106637 15.675721,8.26284357 L21.675721,13.7628436 C22.08284,14.136036 22.1103429,14.7686034 21.7371505,15.1757223 C21.3639581,15.5828413 20.7313908,15.6103443 20.3242718,15.2371519 L15.0300721,10.3841355 L9.70710318,15.7071045 Z"
                                                            fill="#000000" fill-rule="nonzero"
                                                            transform="translate(14.999999, 11.999997) scale(1, -1) rotate(90.000000) translate(-14.999999, -11.999997)" />
                                                    </g>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="wizard-step flex-grow-1 flex-basis-0" data-wizard-type="step">
                                        <div class="wizard-wrapper">
                                            <div class="wizard-icon">
                                                <i class="wizard-check ki ki-check"></i>
                                                <span class="wizard-number">4</span>
                                            </div>
                                            <div class="wizard-label">
                                                <h3 class="wizard-title">Bank Detail </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="login-form">
                            <form class="form px-10 needs-validation" method="POST" novalidate="novalidate"
                                enctype="multipart/form-data" action="{{ route('coaching.postRegister') }}"
                                id="kt_login_signup_form" autocomplete="off" aria-autocomplete="none">
                                @csrf
                                <div class="" data-wizard-type="step-content" data-wizard-state="current">
                                    <div class="pb-10 pb-lg-12">
                                        <h3 class="font-weight-bolder text-dark font-size-h2 font-size-h1-lg">Create
                                            Account
                                        </h3>
                                        @if ($errors->any())
                                            <div class="alert alert-danger">
                                                <ul>
                                                    @foreach ($errors->all() as $error)
                                                        <li>{{ $error }}</li>
                                                    @endforeach
                                                </ul>
                                            </div>
                                        @endif
                                        <div class="text-muted font-weight-bold font-size-h4">Already have an Account ?
                                            <a href="{{ route('coaching.login') }}"
                                                class="text-primary font-weight-bolder">Sign In</a>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="font-size-h6 font-weight-bolder text-dark">First Name</label>
                                        <input type="text"
                                            class="form-control h-auto py-7 px-6 border-0 rounded-lg font-size-h6"
                                            name="first_name" placeholder="First Name"
                                            value="{{ old('first_name') ?? '' }}" />
                                    </div>
                                    <div class="form-group">
                                        <label class="font-size-h6 font-weight-bolder text-dark"> Last Name </label>
                                        <input type="text"
                                            class="form-control h-auto py-7 px-6 border-0 rounded-lg font-size-h6"
                                            name="last_name" placeholder="Last Name"
                                            value="{{ old('last_name') ?? '' }}" />
                                    </div>
                                    <div class="form-group">
                                        <label class="font-size-h6 font-weight-bolder text-dark"> Email </label>
                                        <input type="text"
                                            class="form-control email_already_exists h-auto py-7 px-6 border-0 rounded-lg font-size-h6"
                                            name="email" placeholder="Email" value="{{ old('email') ?? '' }}" />
                                        <span class="text-danger email_already_msg"> Email is already registred </span>
                                    </div>
                                    <div class="form-group">
                                        <label class="font-size-h6 font-weight-bolder text-dark"> Mobile Number </label>
                                        <input type="text"
                                            class="form-control h-auto py-7 px-6 border-0 rounded-lg font-size-h6"
                                            name="mobile_number" placeholder="Mobile Number"
                                            value="{{ old('mobile_number') ?? '' }}" />
                                    </div>
                                    <div class="form-group">
                                        <label class="font-size-h6 font-weight-bolder text-dark"> Password </label>
                                        <div class="input-group-append">
                                            <input type="password" class="form-control h-auto py-7 px-6  font-size-h6"
                                                name="password" placeholder="Password"
                                                value="{{ old('password') ?? '' }}" id="password" />
                                            <div class="input-group-append"><span class="input-group-text"><i
                                                        class="far fa-eye" id="togglePassword"></i></span></div>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="font-size-h6 font-weight-bolder text-dark"> Confirm Password </label>
                                        <div class="input-group-append">
                                            <input type="password" class="form-control h-auto py-7 px-6  font-size-h6"
                                                name="password_confirmation" id="password_confirmation"
                                                placeholder="Confirm password"
                                                value="{{ old('password_confirmation') ?? '' }}" />
                                            <div class="input-group-append">
                                                <span class="input-group-text "><i class="far fa-eye"
                                                        id="togglePasswordConfirmPassword"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <input type="checkbox" name="terms_and_contition" id="terms_and_contition">
                                        <label class="font-size-h6 font-weight-bolder text-dark"> I agree with all <a
                                                href="#">Terms and Conditions</a> </label>

                                        {{-- <div class="fv-plugins-message-container invalid-feedback">
                                            <div data-field="toc" data-validator="notEmpty">You must accept the terms and
                                                conditions </div>
                                        </div> --}}
                                    </div>


                                </div>
                                <div class="pb-5" data-wizard-type="step-content">
                                    <div class="pt-lg-0 pt-5 pb-15">
                                        <h3 class="font-weight-bolder text-dark font-size-h2 font-size-h1-lg"> Coaching
                                            Centre Details </h3>
                                    </div>
                                    <div class="form-group">
                                        <label class="font-size-h6 font-weight-bolder text-dark"> Name </label>
                                        <input type="text"
                                            class="form-control h-auto py-7 px-6 border-0 rounded-lg font-size-h6"
                                            name="coaching_name" value="{{ old('coaching_name') ?? '' }}"
                                            placeholder="Coaching centre name" />
                                    </div>

                                    <div class="form-group">
                                        <label class="font-size-h6 font-weight-bolder text-dark"> Logo </label>
                                        <input type="file" accept="image/*"
                                            class="form-control h-auto py-7 px-6 border-0 rounded-lg font-size-h6"
                                            name="logo" />
                                    </div>
                                    <div class="form-group">
                                        <label class="font-size-h6 font-weight-bolder text-dark"> Select Offered Sports
                                        </label>
                                        <br>
                                        <select name="sport_id"
                                            class="select2_multiple form-control h-auto border-0 rounded-lg py-7 px-6 font-size-h6 select2"
                                            style="width: 100%; font-size:1.175rem !important" multiple="multiple">
                                            >
                                            @foreach ($sports as $sport)
                                                <option value="">Please select sports</option>
                                                <option data-img_sport="{{ generate_url($sport->logo) }}"
                                                    value=" {{ $sport->id }} "> {{ $sport->name }} </option>
                                            @endforeach
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label class="font-size-h6 font-weight-bolder text-dark">
                                            Experience </label>
                                        <input type="text"
                                            class="only_digit_with_dot form-control h-auto py-7 px-6 border-0 rounded-lg font-size-h6"
                                            name="experience" placeholder="Enter experience in year"
                                            value="{{ old('experience') ?? '' }}" autocomplete="off" />
                                    </div>
                                    <div class="form-group">
                                        <label class="font-size-h6 font-weight-bolder text-dark"> Bio </label>
                                        <textarea class="form-control" name="bio" placeholder="Please enter your bio" style="height: 120px;"></textarea>
                                    </div>
                                    <div class="form-group">
                                        <label class="font-size-h6 font-weight-bolder text-dark"> Facilities </label>
                                        <input id="facility"
                                            class="form-control find_facility h-auto py-7 px-6 border-0 rounded-lg font-size-h6 tagify"
                                            name='facility' placeholder='type...' />
                                    </div>
                                </div>

                                <div class="pb-5" data-wizard-type="step-content">
                                    <div class="pt-lg-0 pt-5 pb-15">
                                        <h3 class="font-weight-bolder text-dark font-size-h2 font-size-h1-lg"> Contact
                                            Details: </h3>
                                    </div>
                                    <div class="form-group">
                                        <label class="font-size-h6 font-weight-bolder text-dark"> Contact Number </label>
                                        <input type="text"
                                            class="form-control h-auto py-7 px-6 border-0 rounded-lg font-size-h6"
                                            name="contact_number" value="{{ old('contact_number') ?? '' }}"
                                            placeholder="Contact number" />
                                    </div>

                                    <div class="form-group">
                                        <label class="font-size-h6 font-weight-bolder text-dark"> Contact Email </label>
                                        <input type="text"
                                            class="form-control h-auto py-7 px-6 border-0 rounded-lg font-size-h6"
                                            name="contact_email" placeholder="Contact Email"
                                            value="{{ old('contact_email') ?? '' }}" />
                                    </div>

                                    <div class="form-group">
                                        <label class="font-size-h6 font-weight-bolder text-dark"> Select Location on Map
                                        </label>
                                        <div id="map" style="height: 300px">
                                            <input id="searchInput" class="controls" type="text"
                                                placeholder="Search Box" />
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label class="font-size-h6 font-weight-bolder text-dark"> Address </label>
                                        <input type="text"
                                            class="form-control h-auto py-7 px-6 border-0 rounded-lg font-size-h6"
                                            name="lat" id="lat" placeholder="Latitude" readonly />
                                        <input type="text"
                                            class="form-control mt-5 h-auto py-7 px-6 border-0 rounded-lg font-size-h6"
                                            name="long" id="long" placeholder="Longitude" readonly />
                                    </div>

                                    <div class="form-group">
                                        <label class="font-size-h6 font-weight-bolder text-dark"> Address line one
                                        </label>
                                        <input type="text"
                                            class="form-control mt-5 h-auto py-7 px-6 border-0 rounded-lg font-size-h6"
                                            name="address_line1" placeholder="address line one"
                                            value="{{ old('address_line1') ?? '' }}" />
                                    </div>
                                    <div class="form-group">
                                        <label class="font-size-h6 font-weight-bolder text-dark"> Address line two
                                        </label>
                                        <input type="text"
                                            class="form-control mt-5 h-auto py-7 px-6 border-0 rounded-lg font-size-h6"
                                            name="address_line2" placeholder="address line two"
                                            value="{{ old('address_line2') ?? '' }}" />
                                    </div>
                                    <div class="form-group custom-select-single">
                                        <label class="font-size-h6 font-weight-bolder text-dark"> State </label>
                                        <select name="state_id"
                                            class="state_select2 form-control h-auto py-7 px-6 border-0 rounded-lg font-size-h6"
                                            id="state_id" style="width: 100%">
                                            <option value="">Please select the state</option>
                                            @foreach ($states as $state)
                                                <option value=" {{ $state->id }} "> {{ $state->name }} </option>
                                            @endforeach
                                        </select>
                                    </div>
                                    <div class="form-group custom-select-single">
                                        <label class="font-size-h6 font-weight-bolder text-dark"> City </label>
                                        <select name="city_id"
                                            class="city_select2 form-control h-auto py-7 px-6 border-0 rounded-lg font-size-h6"
                                            id="city_id" style="width: 100%">
                                            <option value="">Please select the city</option>
                                            @foreach ($cities as $city)
                                                <option value="{{ $city->id }}"> {{ $city->name }} </option>
                                            @endforeach
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label class="font-size-h6 font-weight-bolder text-dark"> Postal Code </label>
                                        <input type="text" id="pincode"
                                            class="form-control h-auto py-7 px-6 border-0 rounded-lg font-size-h6"
                                            name="pincode" placeholder="Enter Postal Code" />
                                    </div>
                                </div>


                                <div class="pb-5" data-wizard-type="step-content">
                                    <div class="pt-lg-0 pt-5 pb-15">
                                        <h3 class="font-weight-bolder text-dark font-size-h2 font-size-h1-lg"> Bank Details
                                        </h3>
                                    </div>
                                    <div class="form-group">
                                        <label class="font-size-h6 font-weight-bolder text-dark"> Account Person Name
                                        </label>
                                        <input type="text"
                                            class="form-control h-auto py-7 px-6 border-0 rounded-lg font-size-h6"
                                            name="account_person_name" value="{{ old('account_person_name') }}"
                                            placeholder="Enter Account Person Name" />
                                    </div>
                                    <div class="form-group">
                                        <label class="font-size-h6 font-weight-bolder text-dark"> Bank Name </label>
                                        <input type="text"
                                            class="form-control h-auto py-7 px-6 border-0 rounded-lg font-size-h6"
                                            name="bank_name" value="{{ old('bank_name') }}"
                                            placeholder="Enter Bank Name" />
                                    </div>

                                    <div class="form-group">
                                        <label class="font-size-h6 font-weight-bolder text-dark"> Account Number </label>
                                        <input type="text"
                                            class="form-control h-auto py-7 px-6 border-0 rounded-lg font-size-h6"
                                            name="account_number" value="{{ old('account_number') }}"
                                            placeholder="Enter Account Number" />
                                    </div>

                                    <div class="form-group">
                                        <label class="font-size-h6 font-weight-bolder text-dark">Isfc Code </label>
                                        <input type="text"
                                            class="form-control h-auto py-7 px-6 border-0 rounded-lg font-size-h6"
                                            name="ifsc_code" value="{{ old('ifsc_code') }}"
                                            placeholder="Enter Isfc Code" />
                                    </div>
                                </div>

                                <div class="d-flex justify-content-between pt-7">
                                    <div class="mr-2">
                                        <button type="button"
                                            class="btn btn-light-primary font-weight-bolder font-size-h6 pr-8 pl-6 py-4 my-3 mr-3"
                                            data-wizard-type="action-prev">
                                            <span class="svg-icon svg-icon-md mr-2">

                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                                                    height="24px" viewBox="0 0 24 24" version="1.1">
                                                    <g stroke="none" stroke-width="1" fill="none"
                                                        fill-rule="evenodd">
                                                        <polygon points="0 0 24 0 24 24 0 24" />
                                                        <rect fill="#000000" opacity="0.3"
                                                            transform="translate(15.000000, 12.000000) scale(-1, 1) rotate(-90.000000) translate(-15.000000, -12.000000)"
                                                            x="14" y="7" width="2" height="10"
                                                            rx="1" />
                                                        <path
                                                            d="M3.7071045,15.7071045 C3.3165802,16.0976288 2.68341522,16.0976288 2.29289093,15.7071045 C1.90236664,15.3165802 1.90236664,14.6834152 2.29289093,14.2928909 L8.29289093,8.29289093 C8.67146987,7.914312 9.28105631,7.90106637 9.67572234,8.26284357 L15.6757223,13.7628436 C16.0828413,14.136036 16.1103443,14.7686034 15.7371519,15.1757223 C15.3639594,15.5828413 14.7313921,15.6103443 14.3242731,15.2371519 L9.03007346,10.3841355 L3.7071045,15.7071045 Z"
                                                            fill="#000000" fill-rule="nonzero"
                                                            transform="translate(9.000001, 11.999997) scale(-1, -1) rotate(90.000000) translate(-9.000001, -11.999997)" />
                                                    </g>
                                                </svg>

                                            </span>Previous</button>
                                    </div>
                                    <div>
                                        <button class="btn btn-primary font-weight-bolder font-size-h6 pl-8 pr-4 py-4 my-3"
                                            data-wizard-type="action-submit" type="submit"
                                            id="kt_login_signup_form_submit_button">Confirm & Submit
                                            <span class="svg-icon svg-icon-md ml-2">

                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                                                    height="24px" viewBox="0 0 24 24" version="1.1">
                                                    <g stroke="none" stroke-width="1" fill="none"
                                                        fill-rule="evenodd">
                                                        <polygon points="0 0 24 0 24 24 0 24" />
                                                        <rect fill="#000000" opacity="0.3"
                                                            transform="translate(8.500000, 12.000000) rotate(-90.000000) translate(-8.500000, -12.000000)"
                                                            x="7.5" y="7.5" width="2" height="9"
                                                            rx="1" />
                                                        <path
                                                            d="M9.70710318,15.7071045 C9.31657888,16.0976288 8.68341391,16.0976288 8.29288961,15.7071045 C7.90236532,15.3165802 7.90236532,14.6834152 8.29288961,14.2928909 L14.2928896,8.29289093 C14.6714686,7.914312 15.281055,7.90106637 15.675721,8.26284357 L21.675721,13.7628436 C22.08284,14.136036 22.1103429,14.7686034 21.7371505,15.1757223 C21.3639581,15.5828413 20.7313908,15.6103443 20.3242718,15.2371519 L15.0300721,10.3841355 L9.70710318,15.7071045 Z"
                                                            fill="#000000" fill-rule="nonzero"
                                                            transform="translate(14.999999, 11.999997) scale(1, -1) rotate(90.000000) translate(-14.999999, -11.999997)" />
                                                    </g>
                                                </svg>
                                            </span>
                                        </button>
                                        <button type="button"
                                            class="btn btn-primary font-weight-bolder font-size-h6 pl-8 pr-4 py-4 my-3"
                                            data-wizard-type="action-next">Next
                                            <span class="svg-icon svg-icon-md ml-2">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                                                    height="24px" viewBox="0 0 24 24" version="1.1">
                                                    <g stroke="none" stroke-width="1" fill="none"
                                                        fill-rule="evenodd">
                                                        <polygon points="0 0 24 0 24 24 0 24" />
                                                        <rect fill="#000000" opacity="0.3"
                                                            transform="translate(8.500000, 12.000000) rotate(-90.000000) translate(-8.500000, -12.000000)"
                                                            x="7.5" y="7.5" width="2" height="9"
                                                            rx="1" />
                                                        <path
                                                            d="M9.70710318,15.7071045 C9.31657888,16.0976288 8.68341391,16.0976288 8.29288961,15.7071045 C7.90236532,15.3165802 7.90236532,14.6834152 8.29288961,14.2928909 L14.2928896,8.29289093 C14.6714686,7.914312 15.281055,7.90106637 15.675721,8.26284357 L21.675721,13.7628436 C22.08284,14.136036 22.1103429,14.7686034 21.7371505,15.1757223 C21.3639581,15.5828413 20.7313908,15.6103443 20.3242718,15.2371519 L15.0300721,10.3841355 L9.70710318,15.7071045 Z"
                                                            fill="#000000" fill-rule="nonzero"
                                                            transform="translate(14.999999, 11.999997) scale(1, -1) rotate(90.000000) translate(-14.999999, -11.999997)" />
                                                    </g>
                                                </svg>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        </div>
    @endsection

    @push('extra-js')
        <script src="{{ asset('assets/plugins/global/plugins.bundle.js') }}"></script>
        <script src="{{ asset('assets/js/scripts.bundle.js') }}"></script>
        <script src="{{ asset('assets/frontend/js/custom.js') }}"></script>
        <script src="{{ asset('assets/js/pages/custom/login/login-4.js') }}"></script>
        <script
            src="https://maps.googleapis.com/maps/api/js?sensor=true&key={{ config('utility.MAP_KEY') }}&libraries=geometry,places">
        </script>
        <script>
            $(document).ready(function() {
                /* map start */
                let map;
                initMap();

                function errorCallback(error) {
                    console.log("Error getting location: " + error.message);
                }

                function initMap() {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
                    } else {
                        console.log("Geolocation is not supported by this browser.");
                    }

                    function successCallback(position) {
                        latitude = position.coords.latitude;
                        longitude = position.coords.longitude;
                        $("#lat").val(latitude);
                        $("#long").val(longitude);
                        // console.log("Latitude: " + latitude);
                        // console.log("Longitude: " + longitude);
                        var latlng = "";
                        if (latitude != null && longitude != null) {
                            latlng = new google.maps.LatLng(latitude,
                                longitude);
                        } else {
                            latlng = new google.maps.LatLng('23.033863',
                                '72.585022');
                        }
                        var mapDiv = document.getElementById('map');

                        var map = new google.maps.Map(mapDiv, {
                            center: latlng,
                            zoom: 7,
                            mapTypeId: google.maps.MapTypeId.MAP
                        });

                        var marker = new google.maps.Marker({
                            map: map,
                            position: latlng,
                            draggable: true,
                        });

                        google.maps.event.addListener(marker, 'dragend', function(marker) {

                            var latLng = marker.latLng;
                            currentLatitude = latLng.lat();
                            currentLongitude = latLng.lng();
                            var latlng = {
                                lat: currentLatitude,
                                lng: currentLongitude
                            };
                            geocoder = new google.maps.Geocoder();
                            geocoder.geocode({
                                'location': latlng
                            }, function(results, status) {
                                console.log(results);
                                if (status == 'OK') {
                                    console.log(results[0].geometry.location.lat());
                                    $('#lat').val(results[0].geometry.location.lat());
                                    $('#long').val(results[0].geometry.location.lng());
                                } else {
                                    alert('Geocode was not successful for the following reason: ' +
                                        status);
                                }
                            });
                        });

                    }

                }

                /*map end */
                $(".email_already_msg").hide();

                $('.select2_multiple').select2({
                    placeholder: "Select Sports.",
                    templateResult: formatOption,
                    templateSelection: formatOption,
                });

                $(".city_select2").select2({
                    placeHolder: "Please select the city",
                });

                $(".state_select2").select2({
                    placeHolder: "Please select the state",
                });

                var KTTagify = function() {
                    var demo1 = () => {
                        var input = document.querySelector('input[name=facility]');
                        // var responseData;
                        $.ajax({
                            type: "GET",
                            url: "{{ route('coaching.get-facility') }}",
                            data: {
                                name: input.value,
                            },
                            success: function(response) {
                                tagify = new Tagify(input, {
                                    whitelist: response,
                                })

                                document.querySelector('input[name=facility]').addEventListener(
                                    'click', tagify
                                    .removeAllTags.bind(tagify));
                                tagify.on('add', function() {});
                            }
                        });
                    }
                    return {
                        init: function() {
                            demo1();
                        }
                    };
                }();
                KTTagify.init();
            });


            function formatOption(option) {
                let sportImg = $(option.element).data('img_sport');
                if (!option.id) {
                    return option.text;
                }
                var $option = $(
                    '<span><img style="width:20px; height=20px"  src="' + sportImg + '" class="select2-option-image" /> ' +
                    option.text + '</span>'
                );

                return $option;
            }


            const togglePassword = document.querySelector('#togglePassword');
            const password = document.querySelector('#password');
            togglePassword.addEventListener('click', function(e) {
                const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
                password.setAttribute('type', type);
                this.classList.toggle('fa-eye-slash');
            });

            const togglePasswordC = document.querySelector('#togglePasswordConfirmPassword');
            const passwordC = document.querySelector('#password_confirmation');
            togglePasswordC.addEventListener('click', function(e) {
                const type = passwordC.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordC.setAttribute('type', type);
                this.classList.toggle('fa-eye-slash');
            });

            const validateEmail = (email) => {
                return
            };
            $(document).on("blur", '.email_already_exists', function() {
                $(".email_already_msg").hide();
                let email = $(this).val();
                if (email) {
                    $.ajax({
                        type: "POST",
                        url: "{{ route('coaching.isAlreadyRegistered') }}",
                        data: {
                            "_token": $('meta[name="csrf-token"]').attr('content'),
                            email: email,
                        },
                        success: function(response) {
                            if (response) {
                                $(".email_already_msg").show();
                            }

                        }
                    });
                }


            });
            $(document).on("change", '#state_id', function() {
                var stateId = $(this).val();
                // console.log(stateId);
                if (stateId) {
                    $.ajax({
                        url: "{{ route('getCities') }}",
                        type: 'post',
                        data: {
                            "_token": "{{ csrf_token() }}",
                            state_id: stateId
                        },
                        dataType: 'json',
                        success: function(response) {
                            if (response.cities) {
                                $('#city_id').html(
                                    '<option value=""> Select City  </option>');
                                $.each(response.cities, function(key, city) {
                                    $("#city_id").append('<option value="' + city.id +
                                        '">' + city.name + '</option>');
                                });
                            }
                        }
                    });
                }
            })
        </script>
    @endpush
