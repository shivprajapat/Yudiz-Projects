@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('users_update', $user->id) !!}
@endpush
@push('extra-css')
    <style>
        .fa-plus-circle {
            color: #237541;
            margin-top: 32px;
            margin-left: 90px;
            cursor: pointer;
        }

        .fa-minus-circle {
            color: #ce3a3a;
            font-size: 24px;
            margin-top: 32px;
            margin-left: 90px;
            cursor: pointer;
        }
    </style>
@endpush
@section('content')
    <div class="container">
        <div class="card card-custom">
            <div class="card-header">
                <div class="card-title">
                    <span class="card-icon">
                        <i class="fas fa-user-edit text-primary"></i>
                    </span>
                    <h3 class="card-label text-uppercase">Edit {{ $custom_title }}</h3>
                </div>
            </div>

            <!--begin::Form-->
            <form id="frmEditUser" method="POST" action="{{ route('admin.users.update', $user->custom_id) }}"
                enctype="multipart/form-data">
                @csrf
                @method('put')
                <div class="card-body">
                    <div class="form-group row">
                        <div class="col-lg-12">
                            <h3><b><u>User's Details</u></b> </h3>
                        </div>
                    </div>
                    <div class="form-group row participant_border">
                        <div class="col-lg-3 img_center_show">
                            <div class="image-input kt_image_user" id="kt_image_user">
                                <div class="image-input-wrapper"
                                    style="background-image: url({{ generate_url($user->profile_photo) }}); "></div>
                                <label class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                                    data-action="change" data-toggle="tooltip" title=""
                                    data-original-title="Change avatar">
                                    <i class="fa fa-pen icon-sm text-muted"></i>
                                    <input type="file" name="profile_photo" accept=".png, .jpg, .jpeg" />
                                    <input type="hidden" name="profile_photo_remove" />
                                </label>

                                <span class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                                    data-action="cancel" data-toggle="tooltip" title="Cancel avatar">
                                    <i class="ki ki-bold-close icon-xs text-muted"></i>
                                </span>
                            </div>
                        </div>
                        <div class="col-lg-3">
                            {{-- First Name --}}
                            <div class="form-group">
                                <label for="first_name">First Name: {!! $mend_sign !!}</label>
                                <input type="text" class="form-control @error('first_name') is-invalid @enderror"
                                    id="first_name" name="first_name"
                                    value="{{ old('first_name') != null ? old('first_name') : $user->first_name }}"
                                    placeholder="Enter first name" autocomplete="first_name" spellcheck="false"
                                    autocapitalize="sentences" tabindex="0" autofocus />
                                @if ($errors->has('first_name'))
                                    <span class="text-danger">
                                        <strong class="form-text">{{ $errors->first('first_name') }}</strong>
                                    </span>
                                @endif
                            </div>

                            {{-- Email --}}
                            <div class="form-group">
                                <label for="email"> Email: {!! $mend_sign !!} </label>
                                <input type="email" class="form-control @error('email') is-invalid @enderror"
                                    id="email" name="email"
                                    value="{{ old('email') != null ? old('email') : $user->email }}"
                                    placeholder="Enter email" autocomplete="email" spellcheck="false" tabindex="0"
                                    readonly />
                                @if ($errors->has('email'))
                                    <span class="text-danger">
                                        <strong class="form-text">{{ $errors->first('email') }}</strong>
                                    </span>
                                @endif
                            </div>
                            {{-- Gender --}}
                            <div class="form-group">
                                <label for="first_name"> Gender {!! $mend_sign !!}</label>
                                <div class="col-9 col-form-label">
                                    <div class="radio-inline">
                                        <label class="radio radio-primary">
                                            <input type="radio" id="male" name="gender" value="1"
                                                @if ($user->gender->value == 1) checked @endif
                                                data-error-container="#error-authorizable">
                                            <span></span>
                                            Male
                                        </label>
                                        <label class="radio radio-primary">
                                            <input type="radio" id="female" name="gender" value="0"
                                                @if ($user->gender->value == 0) checked @endif
                                                data-error-container="#error-authorizable">
                                            <span></span>
                                            Female
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3">
                            {{-- Last Name --}}
                            <div class="form-group">
                                <label for="last_name">Last Name:</label>
                                <input type="text" class="form-control @error('last_name') is-invalid @enderror"
                                    id="last_name" name="last_name"
                                    value="{{ old('last_name') != null ? old('last_name') : $user->last_name }}"
                                    placeholder="Enter last name" autocomplete="last_name" spellcheck="false"
                                    autocapitalize="sentences" tabindex="0" autofocus />
                                @if ($errors->has('last_name'))
                                    <span class="text-danger">
                                        <strong class="form-text">{{ $errors->first('last_name') }}</strong>
                                    </span>
                                @endif
                            </div>
                            {{-- Date of Birth --}}
                            <div class="form-group">
                                <label for="dob">Date of Birth {!! $mend_sign !!}</label>
                                <input type="date" class="form-control @error('dob') is-invalid @enderror" id="dob"
                                    name="dob" value="{{ old('dob') != null ? old('dob') : $user->dob }}"
                                    autocomplete="dob" spellcheck="false" tabindex="0" />
                                @if ($errors->has('dob'))
                                    <span class="text-danger">
                                        <strong class="form-text">{{ $errors->first('dob') }}</strong>
                                    </span>
                                @endif
                            </div>
                            {{-- Contact Number --}}
                            <div class="form-group">
                                <label for="mobile_number">Contact Number {!! $mend_sign !!}</label>
                                <input type="mobile_number"
                                    class="form-control @error('mobile_number') is-invalid @enderror" id="mobile_number"
                                    name="mobile_number"
                                    value="{{ old('mobile_number') != null ? old('mobile_number') : $user->mobile_number }}"
                                    placeholder="Enter contact number" autocomplete="mobile_number" spellcheck="false"
                                    tabindex="0" readonly />
                                @if ($errors->has('mobile_number'))
                                    <span class="text-danger">
                                        <strong class="form-text">{{ $errors->first('mobile_number') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>
                        <div class="col-lg-3">
                            <label for="address_line_1">Address: {!! $mend_sign !!} </label>
                            <input type="text" class="form-control @error('address_line_1') is-invalid @enderror"
                                id="address_line_1" name="address_line_1" value="{{ $user->address_line_1 }}"
                                placeholder="Enter Address Line1" autocomplete="address_line_1" spellcheck="false"
                                autocapitalize="sentences" tabindex="0" autofocus />
                            @if ($errors->has('address_line_1'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('address_line_1') }}</strong>
                                </span>
                            @endif

                            <input type="text" class="form-control @error('address_line_2') is-invalid @enderror mt-2"
                                id="address_line_2" name="address_line_2" value="{{ $user->address_line_2 }}"
                                placeholder="Enter Address Line2" autocomplete="address_line_2" spellcheck="false"
                                autocapitalize="sentences" tabindex="0" autofocus />
                            @if ($errors->has('address_line_2'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('address_line_2') }}</strong>
                                </span>
                            @endif
                            <input type="hidden" name="lat" value="" placeholder="latitude"
                                id="latitude" />
                            <input type="hidden" name="long" value="" placeholder="longitude"
                                id="longitude" />
                            <div class="mt-2">
                                <select class="form-control custom_select2_state @error('state_id') is-invalid @enderror"
                                    id="state_id" name="state_id">
                                    @if (!empty($user->state))
                                        @foreach ($states as $state)
                                            <option value=" {{ $state->id }}"
                                                {{ $state->id == $user->state->id ? 'selected' : '' }}>
                                                {{ $state->name }} </option>
                                        @endforeach
                                    @else
                                        @foreach ($states as $state)
                                            <option value=" {{ $state->id }}">
                                                {{ $state->name }} </option>
                                        @endforeach
                                    @endif
                                </select>
                            </div>
                            <div class="mt-2">
                                <select class="form-control custom_select2_city @error('city_id') is-invalid @enderror"
                                    id="city_id" name="city_id">
                                    @if (!empty($user->state))
                                        @foreach ($cities as $city)
                                            <option value=" {{ $city->id }}"
                                                {{ $city->id == $user->city->id ? 'selected' : '' }}>
                                                {{ $city->name }} </option>
                                        @endforeach
                                    @else
                                        @foreach ($cities as $city)
                                            <option value=" {{ $city->id }}">
                                                {{ $city->name }} </option>
                                        @endforeach
                                    @endif
                                    <option value="das">Select City {!! $mend_sign !!}</option>
                                </select>
                            </div>
                            <input type="text" class="form-control @error('pin_code') is-invalid @enderror mt-2"
                                id="pin_code" name="pin_code" value="{{ $user->pin_code }}"
                                placeholder="Enter pincode" autocomplete="pin_code" spellcheck="false"
                                autocapitalize="sentences" tabindex="0" autofocus />
                            @if ($errors->has('pin_code'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('pin_code') }}</strong>
                                </span>
                            @endif

                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-lg-12 pt-10">
                            <h3><b><u> Other Participants Details</u></b>
                                <h3>
                        </div>
                    </div>
                    @forelse ($user->participants as $key => $participant)
                        <div class="form-group row participant_border">
                            <input type="hidden" name="participants[{{ $key }}][id]"
                                value="{{ $participant->id }}">
                            <div class="col-lg-3 img_center_show">
                                <div class="image-input kt_image_participant kt_image_user"
                                    id="kt_image_participant_{{ $key }}" data-key="{{ $key }}">
                                    <div class="image-input-wrapper"
                                        style="background-image: url({{ generate_url($participant->profile_photo) }});">
                                    </div>
                                    <label
                                        class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                                        data-action="change" data-toggle="tooltip" title=""
                                        data-original-title="Change avatar">
                                        <i class="fa fa-pen icon-sm text-muted"></i>
                                        <input type="file" name="participants[{{ $key }}][participant_photo]"
                                            accept=".png, .jpg, .jpeg" />
                                        <input type="hidden"
                                            name="participants[{{ $key }}][remove_participant_photo]" />
                                    </label>

                                    <span
                                        class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                                        data-action="cancel" data-toggle="tooltip" title="Cancel avatar">
                                        <i class="ki ki-bold-close icon-xs text-muted"></i>
                                    </span>
                                </div>
                            </div>
                            <div class="col-lg-3">
                                {{-- First Name --}}
                                <div class="form-group">
                                    <label for="participant_first_name">First Name: {!! $mend_sign !!}</label>
                                    <input type="text"
                                        class="form-control @error('participants.' . $key . '.first_name') is-invalid @enderror"
                                        id="participant_first_name" name="participants[{{ $key }}][first_name]"
                                        value="{{ old('participant_first_name') != null ? old('participant_first_name') : $participant->first_name }}"
                                        placeholder="Enter first name" autocomplete="participant_first_name"
                                        spellcheck="false" autocapitalize="sentences" tabindex="0" autofocus />
                                    @if ($errors->has('participants.' . $key . '.first_name'))
                                        <span class="text-danger">
                                            <strong
                                                class="form-text">{{ $errors->first("participants.$key.first_name") }}</strong>

                                        </span>
                                    @endif
                                </div>
                                {{-- participant_Gender --}}
                                <div class="form-group">
                                    <label for="participant_gender">Gender {!! $mend_sign !!}</label>
                                    <div class="col-9 col-form-label">
                                        <div class="radio-inline">
                                            <label class="radio radio-primary">
                                                <input type="radio" id="male"
                                                    name="participants[{{ $key }}][gender]" value="1"
                                                    @if ($participant->gender->value == 1) checked @endif
                                                    data-error-container="#error-authorizable">
                                                <span></span>
                                                Male
                                            </label>
                                            <label class="radio radio-primary">
                                                <input type="radio" id="female"
                                                    name="participants[{{ $key }}][gender]" value="0"
                                                    @if ($participant->gender->value == 0) checked @endif
                                                    data-error-container="#error-authorizable">
                                                <span></span>
                                                Female
                                            </label>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div class="col-lg-3">
                                {{-- participant_Last Name --}}
                                <div class="form-group">
                                    <label for="participant_last_name">Last Name:</label>
                                    <input type="text"
                                        class="form-control @error('participants.' . $key . '.last_name') is-invalid @enderror"
                                        id="participant_last_name" name="participants[{{ $key }}][last_name]"
                                        value="{{ old('participant_last_name') != null ? old('participant_last_name') : $participant->last_name }}"
                                        placeholder="Enter last name" autocomplete="participant_last_name"
                                        spellcheck="false" autocapitalize="sentences" tabindex="0" autofocus />
                                    @if ($errors->has('participants.' . $key . '.last_name'))
                                        <span class="text-danger">
                                            <strong
                                                class="form-text">{{ $errors->first("participants.$key.last_name") }}</strong>
                                        </span>
                                    @endif
                                </div>
                                {{-- Date of Birth --}}
                                <div class="form-group">
                                    <label for="participant_dob">Date of Birth: {!! $mend_sign !!}</label>
                                    <input type="date"
                                        class="form-control @error('participants.' . $key . '.dob') is-invalid @enderror"
                                        id="participant_dob" name="participants[{{ $key }}][dob]"
                                        value="{{ old('participant_dob') != null ? old('participant_dob') : $participant->dob }}"
                                        autocomplete="participant_dob" spellcheck="false" tabindex="0" />
                                    @if ($errors->has('participants.' . $key . '.dob'))
                                        <span class="text-danger">
                                            <strong
                                                class="form-text">{{ $errors->first("participants.$key.dob") }}</strong>
                                        </span>
                                    @endif
                                </div>
                            </div>
                            <div class="col-lg-3">

                                {{-- School Name --}}
                                <div class="form-group">
                                    <label for="participant_school_name">School Name: </label>
                                    <input type="text"
                                        class="form-control @error('participants.' . $key . '.school_name') is-invalid @enderror"
                                        id="participant_school_name"
                                        name="participants[{{ $key }}][school_name]"
                                        value="{{ old('participant_school_name') != null ? old('participant_school_name') : $participant->school_name }}"
                                        placeholder="Enter first name" autocomplete="participant_school_name"
                                        spellcheck="false" autocapitalize="sentences" tabindex="0" autofocus />
                                    @if ($errors->has('participants.' . $key . '.school_name'))
                                        <span class="text-danger">
                                            <strong
                                                class="form-text">{{ $errors->first("participants.$key.school_name") }}</strong>
                                        </span>
                                    @endif
                                </div>
                                {{-- <div class="form-group">
                                <div class="add-more-icon">
                                    <i class='fas fa-minus-circle'></i>
                                </div>
                            </div> --}}
                            </div>
                        </div>
                    @empty
                        <p> No Other Participants</p>
                    @endforelse
                    {{-- @foreach ($user->participants as $key => $participant)

                    @endforeach --}}
                </div>
                <div class="card-footer">
                    <button type="submit" class="btn btn-primary mr-2">Update {{ $custom_title }}</button>
                    <a href="{{ route('admin.users.index') }}" class="btn btn-secondary">Cancel</a>
                </div>
            </form>
            <!--end::Form-->
        </div>
    </div>
@endsection

@push('extra-js')
    <script>
        $(document).ready(function() {
            var avatar1 = new KTImageInput('kt_image_user');
            $("#frmEditUser").validate({
                rules: {
                    first_name: {
                        required: true,
                        not_empty: true,
                        no_space: true,
                        alphaonly: true,
                        minlength: 3,
                        maxlength: 50,
                    },
                    last_name: {
                        required: true,
                        not_empty: true,
                        no_space: true,
                        alphaonly: true,
                        minlength: 3,
                        maxlength: 50,
                    },
                    email: {
                        required: true,
                        maxlength: 80,
                        email: true,
                        valid_email: true,
                    },
                    // mobile_number: {
                    //     required: false,
                    //     not_empty: true,
                    //     maxlength: 16,
                    //     minlength: 6,
                    //     digits: true,
                    // },
                    profile_photo: {
                        extension: "jpg|jpeg|png",
                    },
                    address_line_1: {
                        required: true,
                        not_empty: true,
                        minlength: 5,
                    },
                    address_line_2: {
                        required: true,
                        not_empty: true,
                        minlength: 5,
                    },
                    pin_code: {
                        required: true,
                        not_empty: true,
                        maxlength: 6,
                        minlength: 6,
                        digits: true,
                    },
                    'state_id': {
                        required: true,
                        not_empty: true,
                    },
                    'city_id': {
                        required: true,
                        not_empty: true,
                    },
                    //for participants
                    @foreach ($user->participants as $key => $participant)
                        "participants[{{ $key }}][first_name]": {
                            required: true,
                            not_empty: true,
                            no_space: true,
                            alphaonly: true,
                            minlength: 3,
                            maxlength: 50,
                        },
                        "participants[{{ $key }}][gender]": {
                            required: true
                        },
                        "participants[{{ $key }}][last_name]": {
                            required: true,
                            not_empty: true,
                            no_space: true,
                            alphaonly: true,
                            minlength: 3,
                            maxlength: 50,
                        },
                        "participants[{{ $key }}][dob]": {
                            required: true,
                            date: true
                        },
                        "participants[{{ $key }}][school_name]": {
                            required: false,
                            maxlength: 255
                        },
                    @endforeach


                },
                messages: {
                    first_name: {
                        required: "@lang('validation.required', ['attribute' => 'first name'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'first name'])",
                        alphaonly: "@lang('validation.alphaonly', ['attribute' => 'first name'])",
                        no_space: "@lang('validation.no_space', ['attribute' => 'first name'])",
                        minlength: "@lang('validation.min.string', ['attribute' => 'first name', 'min' => 3])",
                        maxlength: "@lang('validation.min.string', ['attribute' => 'first name', 'min' => 50])",
                    },
                    last_name: {
                        required: "@lang('validation.required', ['attribute' => 'last name'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'last name'])",
                        alphaonly: "@lang('validation.alphaonly', ['attribute' => 'last name'])",
                        no_space: "@lang('validation.no_space', ['attribute' => 'last name'])",
                        minlength: "@lang('validation.min.string', ['attribute' => 'last name', 'min' => 3])",
                        maxlength: "@lang('validation.min.string', ['attribute' => 'last name', 'min' => 50])",
                    },
                    email: {
                        required: "@lang('validation.required', ['attribute' => 'email address'])",
                        maxlength: "@lang('validation.max.string', ['attribute' => 'email address', 'max' => 80])",
                        email: "@lang('validation.email', ['attribute' => 'email address'])",
                        valid_email: "@lang('validation.email', ['attribute' => 'email address'])",
                    },
                    mobile_number: {
                        required: "@lang('validation.required', ['attribute' => 'mobile number'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'mobile number'])",
                        maxlength: "@lang('validation.max.string', ['attribute' => 'mobile number', 'max' => 16])",
                        minlength: "@lang('validation.min.string', ['attribute' => 'mobile number', 'min' => 6])",
                        pattern: "@lang('validation.numeric', ['attribute' => 'mobile number'])",
                    },
                    address_line_1: {
                        required: "@lang('validation.required', ['attribute' => 'address line1'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'address line1'])",
                        minlength: "@lang('validation.min.string', ['attribute' => 'address line1', 'min' => 5])",
                        maxlength: "@lang('validation.min.string', ['attribute' => 'address line1', 'min' => 255])",
                    },
                    address_line_2: {
                        required: "@lang('validation.required', ['attribute' => 'address line2'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'address line2'])",
                        minlength: "@lang('validation.min.string', ['attribute' => 'address line2', 'min' => 5])",
                        maxlength: "@lang('validation.min.string', ['attribute' => 'address line2', 'min' => 255])",
                    },
                    pin_code: {
                        required: "@lang('validation.required', ['attribute' => 'pincode'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'pincode'])",
                        maxlength: "@lang('validation.max.string', ['attribute' => 'pincode', 'max' => 6])",
                        minlength: "@lang('validation.min.string', ['attribute' => 'pincode', 'min' => 6])",
                    },
                    'state_id': {
                        required: "@lang('validation.required', ['attribute' => 'state'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'state'])",
                    },
                    'city_id': {
                        required: "@lang('validation.required', ['attribute' => 'city'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'city'])",
                    },
                    @foreach ($user->participants as $key => $participant)
                        "participants[{{ $key }}][first_name]": {
                            required: "@lang('validation.required', ['attribute' => 'first name'])",
                            not_empty: "@lang('validation.not_empty', ['attribute' => 'first name'])",
                            alphaonly: "@lang('validation.alphaonly', ['attribute' => 'first name'])",
                            no_space: "@lang('validation.no_space', ['attribute' => 'first name'])",
                            minlength: "@lang('validation.min.string', ['attribute' => 'first name', 'min' => 3])",
                            maxlength: "@lang('validation.min.string', ['attribute' => 'first name', 'min' => 50])",
                        },
                        "participants[{{ $key }}][gender]": {
                            required: "Please select the gender."
                        },
                        "participants[{{ $key }}][last_name]": {
                            required: "@lang('validation.required', ['attribute' => 'last name'])",
                            not_empty: "@lang('validation.not_empty', ['attribute' => 'last name'])",
                            alphaonly: "@lang('validation.alphaonly', ['attribute' => 'last name'])",
                            no_space: "@lang('validation.no_space', ['attribute' => 'last name'])",
                            minlength: "@lang('validation.min.string', ['attribute' => 'last name', 'min' => 3])",
                            maxlength: "@lang('validation.min.string', ['attribute' => 'last name', 'min' => 50])",
                        },
                        "participants[{{ $key }}][dob]": {
                            required: "Please enter the date of birth.",
                            date: "Please enter a valid date."
                        },
                        "participants[{{ $key }}][school_name]": {
                            required: "Please enter the school name.",
                            maxlength: "The school name must not exceed 255 characters."
                        },
                    @endforeach
                },
                errorClass: 'invalid-feedback',
                errorElement: 'span',
                highlight: function(element) {
                    $(element).addClass('is-invalid');
                    var siblings = $(element).siblings('label');
                    if (siblings.length > 0) {
                        siblings.addClass('text-danger');
                    }

                },
                unhighlight: function(element) {
                    $(element).removeClass('is-invalid');
                    var siblings = $(element).siblings('label');
                    if (siblings.length > 0) {
                        siblings.removeClass('text-danger');
                    }
                },
                errorPlacement: function(error, element) {
                    if (element.attr("data-error-container")) {
                        error.appendTo(element.attr("data-error-container"));
                    } else {
                        error.insertAfter(element);
                    }
                }
            });
            $('#frmEditUser').submit(function() {
                if ($(this).valid()) {
                    addOverlay();
                    $("input[type=submit], input[type=button], button[type=submit]").prop("disabled",
                        "disabled");
                    return true;
                } else {
                    return false;
                }
            });

            $(".custom_select2_state").select2({
                placeHolder: "Please select a state",
            });

            $(".custom_select2_city").select2({
                placeHolder: "Please select a city",
            });

            $(document).on("change", '#state_id', function() {
                var stateId = $(this).val();
                if (stateId) {
                    $.ajax({
                        url: '{{ route('admin.coaching-centres.get-cities', ':state_id') }}'
                            .replace(':state_id', stateId),
                        type: 'GET',
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


            //remove the imaegs
            $(".remove-img").on('click', function(e) {
                e.preventDefault();
                $(this).parents(".symbol").remove();
                $('#frmEditUser').append(
                    '<input type="hidden" name="remove_profie_photo" id="remove_image" value="removed">'
                );
            });

            $('.kt_image_participant').each(function() {
                var elementId = $(this).attr('id');
                var avatar2 = new KTImageInput(elementId);

            });
        });
    </script>
@endpush
