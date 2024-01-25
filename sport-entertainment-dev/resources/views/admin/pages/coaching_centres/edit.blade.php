@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('coaching-centres_update', $coaching_centre->id) !!}
@endpush
@push('extra-css')
    <style>
        #searchInput {
            background-color: #fff;
            font-family: Roboto;
            font-size: 15px;
            font-weight: 300;
            margin-left: 12px;
            padding: 0 11px 0 13px;
            text-overflow: ellipsis;
            width: 40%;
        }

        #searchInput:focus {
            border-color: #4d90fe;
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
            <form id="frmEditCoachingCentre" method="POST"
                action="{{ route('admin.coaching-centres.update', $coaching_centre->id) }}" enctype="multipart/form-data">
                @csrf
                @method('put')
                <div class="card-body">
                    <div class="form-group row">
                        <div class="col-lg-12">
                            <h3><b><u>User Details</u></b>
                                <h3>
                        </div>
                    </div>
                    {{-- Personal Details --}}
                    <div class="form-group row">
                        <div class="col-lg-3">
                            <label for="first_name">{!! $mend_sign !!}First Name:</label>
                            <input type="text" class="form-control @error('first_name') is-invalid @enderror"
                                id="first_name" name="first_name"
                                value="{{ old('first_name') != null ? old('first_name') : $coaching_centre->first_name }}"
                                placeholder="Enter first name" autocomplete="first_name" spellcheck="false"
                                autocapitalize="sentences" tabindex="0" autofocus />
                            @if ($errors->has('first_name'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('first_name') }}</strong>
                                </span>
                            @endif
                        </div>
                        <div class="col-lg-3">
                            <label for="last_name">{!! $mend_sign !!}Last Name:</label>
                            <input type="text" class="form-control @error('last_name') is-invalid @enderror"
                                id="last_name" name="last_name"
                                value="{{ old('last_name') != null ? old('last_name') : $coaching_centre->last_name }}"
                                placeholder="Enter last name" autocomplete="last_name" spellcheck="false"
                                autocapitalize="sentences" tabindex="0" autofocus />
                            @if ($errors->has('last_name'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('last_name') }}</strong>
                                </span>
                            @endif
                        </div>
                        <div class="col-lg-3">
                            <label for="email">{!! $mend_sign !!}Email Id:</label>
                            <input type="email" class="form-control @error('email') is-invalid @enderror" id="email"
                                name="email" value="{{ old('email') != null ? old('email') : $coaching_centre->email }}"
                                placeholder="Enter email Id" autocomplete="email" spellcheck="false"
                                autocapitalize="sentences" tabindex="0" autofocus />
                            @if ($errors->has('email'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('email') }}</strong>
                                </span>
                            @endif
                        </div>
                        <div class="col-lg-3">
                            <label for="mobile_number">{!! $mend_sign !!}Mobile Number:</label>
                            <input type="text" class="form-control @error('mobile_number') is-invalid @enderror"
                                id="mobile_number" name="mobile_number"
                                value="{{ old('mobile_number') != null ? old('mobile_number') : $coaching_centre->mobile_number }}"
                                placeholder="Enter mobile number" autocomplete="mobile_number" spellcheck="false"
                                autocapitalize="sentences" tabindex="0" autofocus />
                            @if ($errors->has('mobile_number'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('mobile_number') }}</strong>
                                </span>
                            @endif
                        </div>
                    </div>
                    {{-- Coaching Centre Details --}}
                    <div class="form-group row mt-10">
                        <div class="col-lg-12">
                            <h3><b><u>Coaching Centre Details</u></b>
                                <h3>
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-lg-3">
                            <label for="coaching_name">{!! $mend_sign !!}Coaching Centre Name:</label>
                            <input type="text" class="form-control @error('coaching_name') is-invalid @enderror"
                                id="coaching_name" name="coaching_name"
                                value="{{ old('coaching_name') != null ? old('coaching_name') : $coaching_centre->coaching_name }}"
                                placeholder="Enter coaching center name" autocomplete="coaching_name" spellcheck="false"
                                autocapitalize="sentences" tabindex="0" autofocus />
                            @if ($errors->has('coaching_name'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('coaching_name') }}</strong>
                                </span>
                            @endif
                            <label for="experience" class="mt-5">{!! $mend_sign !!}Experience:</label>
                            <input type="text" class="form-control @error('experience') is-invalid @enderror"
                                id="experience" name="experience"
                                value="{{ old('experience') != null ? old('experience') : $coaching_centre->experience }}"
                                placeholder="Enter experience" autocomplete="experience" spellcheck="false"
                                autocapitalize="sentences" tabindex="0" autofocus />
                            @if ($errors->has('experience'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('experience') }}</strong>
                                </span>
                            @endif
                        </div>
                        <div class="col-lg-3" style="text-align: center">
                            <div>
                                <label>Coaching Centre Logo</label>
                            </div>

                            <div class="image-input" id="kt_image_2">
                                <div class="image-input-wrapper"
                                    style="background-image: url({{ generate_url($coaching_centre->logo) }}); "></div>
                                <label class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                                    data-action="change" data-toggle="tooltip" title=""
                                    data-original-title="Change avatar">
                                    <i class="fa fa-pen icon-sm text-muted"></i>
                                    <input type="file" name="logo" accept="image/*" />
                                    <input type="hidden" name="logo_remove" />
                                </label>

                                <span class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                                    data-action="cancel" data-toggle="tooltip" title="Cancel avatar">
                                    <i class="ki ki-bold-close icon-xs text-muted"></i>
                                </span>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div>
                                <label for="offered_sports[]">{!! $mend_sign !!}Offered Sports:</label>
                                <select
                                    class="form-control @error('offered_sports[]') is-invalid @enderror select2_multiple"
                                    id="kt_select2_11" multiple name="offered_sports[]">
                                    @foreach ($sports as $sport)
                                        <option data-img_sport="{{ generate_url($sport->logo) }}"
                                            value=" {{ $sport->id }}"
                                            {{ in_array($sport->id, $coaching_centre->offeredSports->pluck('sport_id')->toArray()) ? 'selected' : '' }}>
                                            {{ $sport->name }} </option>
                                    @endforeach
                                </select>
                            </div>
                            <label for="bio" class="mt-5">{!! $mend_sign !!}Bio:</label>
                            <textarea class="form-control @error('bio') is-invalid @enderror" id="bio" name="bio"
                                placeholder="Enter Bio" autocomplete="bio" spellcheck="false" autocapitalize="sentences" tabindex="0"
                                autofocus />{{ $coaching_centre->bio }}</textarea>
                            @if ($errors->has('bio'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('bio') }}</strong>
                                </span>
                            @endif
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-lg-6">
                            <div>
                                <label>Images</label>
                            </div>
                            @forelse ($coaching_centre->coachingCentreImages->take(3) as $image)
                                <label>
                                    <h5>
                                        <img src="{{ generate_url($image->image_path) }}" alt="sports logo"
                                            width="120" height="70">
                                    </h5>
                                </label>
                            @empty
                                <a href="{{ route('admin.coaching-centres.edit-images', $coaching_centre->id) }}"
                                    class="ml-5"><u>Add Images</u></a>
                            @endforelse
                            <a href="{{ route('admin.coaching-centres.edit-images', $coaching_centre->id) }}"
                                class="ml-5"><u>View More</u></a>
                        </div>
                        <div class="col-lg-6">
                            <label for="facilities">{!! $mend_sign !!}Facilities:</label>
                            <select class="form-control @error('facilities[]') is-invalid @enderror select2_multiple"
                                id="kt_select2_1" multiple name="facilities[]">
                                <option value=""> Please select sports </option>
                                @foreach ($facilities as $facility)
                                    <option value=" {{ $facility->name }}"
                                        {{ in_array($facility->id, explode(',', $coaching_centre->facility)) ? 'selected' : '' }}>
                                        {{ $facility->name }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    {{-- Location Details --}}
                    <div class="form-group row mt-5">
                        <div class="col-lg-12">
                            <h3><b><u>Location Details</u></b>
                                <h3>
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-lg-3">
                            <label for="contact_number">{!! $mend_sign !!}Contact Number :</label>
                            <input type="text" class="form-control @error('contact_number') is-invalid @enderror"
                                id="contact_number" name="contact_number"
                                value="{{ old('contact_number') != null ? old('contact_number') : $coaching_centre->contact_number }}"
                                placeholder="Enter contact number" autocomplete="contact_number" spellcheck="false"
                                autocapitalize="sentences" tabindex="0" autofocus />
                            @if ($errors->has('contact_number'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('contact_number') }}</strong>
                                </span>
                            @endif

                            <label for="contact_email" class="mt-10">{!! $mend_sign !!}Contact Email-Id :</label>
                            <input type="text" class="form-control @error('contact_email') is-invalid @enderror"
                                id="contact_email" name="contact_email"
                                value="{{ old('contact_email') != null ? old('contact_email') : $coaching_centre->contact_email }}"
                                placeholder="Enter contact number" autocomplete="contact_email" spellcheck="false"
                                autocapitalize="sentences" tabindex="0" autofocus />
                            @if ($errors->has('contact_email'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('contact_email') }}</strong>
                                </span>
                            @endif
                        </div>
                        <div class="col-lg-5 mt-1">
                            <input id="searchInput" class="controls" type="text" placeholder="Search Box" />
                            <div id="map" style="height: 300px">
                                <input id="searchInput" class="controls" type="text" placeholder="Search Box" />
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <label for="address_line1">{!! $mend_sign !!}Address</label>
                            <input type="text" class="form-control @error('address_line1') is-invalid @enderror"
                                id="address_line1" name="address_line1" value="{{ $coaching_centre->address_line1 }}"
                                placeholder="Enter Address Line1" autocomplete="address_line1" spellcheck="false"
                                autocapitalize="sentences" tabindex="0" autofocus />
                            @if ($errors->has('address_line1'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('address_line1') }}</strong>
                                </span>
                            @endif

                            <input type="text" class="form-control @error('address_line2') is-invalid @enderror mt-5"
                                id="address_line2" name="address_line2" value="{{ $coaching_centre->address_line2 }}"
                                placeholder="Enter Address Line2" autocomplete="address_line2" spellcheck="false"
                                autocapitalize="sentences" tabindex="0" autofocus />
                            @if ($errors->has('address_line2'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('address_line2') }}</strong>
                                </span>
                            @endif
                            <input type="hidden" name="lat" value="" placeholder="latitude"
                                id="latitude" />
                            <input type="hidden" name="long" value="" placeholder="longitude"
                                id="longitude" />
                            <div class="mt-5">
                                <select
                                    class="form-control custom_select2_state @error('state_id') is-invalid @enderror mt-5"
                                    id="state_id" name="state_id">

                                    @foreach ($states as $state)
                                        <option value=" {{ $state->id }}"
                                            {{ $state->id == $coaching_centre->state->id ? 'selected' : '' }}>
                                            {{ $state->name }} </option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="mt-5">
                                <select
                                    class="form-control custom_select2_city @error('city_id') is-invalid @enderror mt-5"
                                    id="city_id" name="city_id">
                                    @foreach ($cities as $city)
                                        <option value=" {{ $city->id }}"
                                            {{ $city->id == $coaching_centre->city->id ? 'selected' : '' }}>
                                            {{ $city->name }} </option>
                                    @endforeach
                                    <option value="das">Select City</option>
                                </select>
                            </div>
                            <input type="text" class="form-control @error('pincode') is-invalid @enderror mt-5"
                                id="pincode" name="pincode" value="{{ $coaching_centre->pincode }}"
                                placeholder="Enter pincode" autocomplete="pincode" spellcheck="false"
                                autocapitalize="sentences" tabindex="0" autofocus />
                            @if ($errors->has('pincode'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('pincode') }}</strong>
                                </span>
                            @endif

                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <button type="submit" class="btn btn-primary mr-2">Update {{ $custom_title }}</button>
                    <a href="{{ route('admin.coaching-centres.index') }}" class="btn btn-secondary">Cancel</a>
                </div>
            </form>
            <!--end::Form-->
        </div>
    </div>
@endsection

@push('extra-js')
    <script
        src="https://maps.googleapis.com/maps/api/js?sensor=true&key={{ config('utility.MAP_KEY') }}&libraries=geometry,places">
    </script>
    <script>
        $(document).ready(function(e) {
            let map;
            initMap();
            $("#frmEditCoachingCentre").validate({
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
                    mobile_number: {
                        required: true,
                        not_empty: true,
                        maxlength: 10,
                        minlength: 10,
                        digits: true,
                        pattern: /^(\d+)(?: ?\d+)*$/,
                    },
                    coaching_name: {
                        required: true,
                        not_empty: true,
                        minlength: 3,
                        maxlength: 255,
                    },
                    experience: {
                        required: true,
                        not_empty: true,
                        number: true,
                    },
                    'offered_sports[]': {
                        required: true,
                        not_empty: true,
                    },
                    bio: {
                        required: true,
                        not_empty: true,
                        minlength: 5,
                    },
                    'facilities[]': {
                        required: true,
                        not_empty: true,
                    },
                    contact_number: {
                        required: true,
                        not_empty: true,
                        maxlength: 10,
                        minlength: 10,
                        digits: true,
                        pattern: /^(\d+)(?: ?\d+)*$/,
                    },
                    contact_email: {
                        required: true,
                        maxlength: 80,
                        email: true,
                        valid_email: true,
                    },
                    address_line1: {
                        required: true,
                        not_empty: true,
                        minlength: 5,
                    },
                    address_line2: {
                        required: true,
                        not_empty: true,
                        minlength: 5,
                    },
                    pincode: {
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
                    logo: {
                        extension: "jpg|jpeg|png",
                    },
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
                        required: "@lang('validation.required', ['attribute' => 'email Id'])",
                        maxlength: "@lang('validation.max.string', ['attribute' => 'email Id', 'max' => 80])",
                        email: "@lang('validation.email', ['attribute' => 'email Id'])",
                        valid_email: "@lang('validation.email', ['attribute' => 'email Id'])",
                    },
                    mobile_number: {
                        required: "@lang('validation.required', ['attribute' => 'mobile number'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'mobile number'])",
                        maxlength: "@lang('validation.max.string', ['attribute' => 'mobile number', 'max' => 10])",
                        minlength: "@lang('validation.min.string', ['attribute' => 'mobile number', 'min' => 10])",
                        pattern: "@lang('validation.numeric', ['attribute' => 'mobile number'])",
                    },
                    coaching_name: {
                        required: "@lang('validation.required', ['attribute' => 'coaching centre name'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'coaching centre name'])",
                        minlength: "@lang('validation.min.string', ['attribute' => 'coaching centre name', 'min' => 3])",
                        maxlength: "@lang('validation.min.string', ['attribute' => 'coaching centre name', 'min' => 50])",
                    },
                    experience: {
                        required: "@lang('validation.required', ['attribute' => 'coaching centre experience'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'coaching centre experience'])",
                        number: "@lang('validation.number', ['attribute' => 'coaching centre experience'])",
                    },
                    'offered_sports[]': {
                        required: "@lang('validation.required', ['attribute' => 'sports'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'sports'])",
                    },
                    bio: {
                        required: "@lang('validation.required', ['attribute' => 'bio'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'bio'])",
                        minlength: "@lang('validation.min.string', ['attribute' => 'bio', 'min' => 5])",
                        maxlength: "@lang('validation.min.string', ['attribute' => 'bio', 'min' => 255])",
                    },
                    'facilities[]': {
                        required: "@lang('validation.required', ['attribute' => 'facility'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'facility'])",
                    },
                    contact_number: {
                        required: "@lang('validation.required', ['attribute' => 'contact number'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'contact number'])",
                        maxlength: "@lang('validation.max.string', ['attribute' => 'contact number', 'max' => 10])",
                        minlength: "@lang('validation.min.string', ['attribute' => 'contact number', 'min' => 10])",
                        pattern: "@lang('validation.numeric', ['attribute' => 'contact number'])",
                    },
                    contact_email: {
                        required: "@lang('validation.required', ['attribute' => 'contact email Id'])",
                        maxlength: "@lang('validation.max.string', ['attribute' => 'contact email Id', 'max' => 80])",
                        email: "@lang('validation.email', ['attribute' => 'contact email Id'])",
                        valid_email: "@lang('validation.email', ['attribute' => 'contact email Id'])",
                    },
                    address_line1: {
                        required: "@lang('validation.required', ['attribute' => 'address line1'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'address line1'])",
                        minlength: "@lang('validation.min.string', ['attribute' => 'address line1', 'min' => 5])",
                        maxlength: "@lang('validation.min.string', ['attribute' => 'address line1', 'min' => 255])",
                    },
                    address_line2: {
                        required: "@lang('validation.required', ['attribute' => 'address line2'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'address line2'])",
                        minlength: "@lang('validation.min.string', ['attribute' => 'address line2', 'min' => 5])",
                        maxlength: "@lang('validation.min.string', ['attribute' => 'address line2', 'min' => 255])",
                    },
                    pincode: {
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
                    logo: {
                        extension: "@lang('validation.mimetypes', ['attribute' => 'profile photo', 'value' => 'jpg|png|jpeg'])",
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
                    $(element).siblings('label').removeClass('text-danger');
                },
                errorPlacement: function(error, element) {
                    if (element.is('select')) {
                        error.insertAfter(element.next());
                        // error.insertAfter(element);

                    } else if (element.attr("data-error-container")) {
                        error.appendTo(element.attr("data-error-container"));
                    } else {
                        error.insertAfter(element);
                    }
                }
            });
            $('#frmEditCoachingCentre').submit(function() {
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

            //remove the imaegs
            $(".remove-img").on('click', function(e) {
                e.preventDefault();
                $(this).parents(".symbol").remove();
                $('#frmEditCoachingCentre').append(
                    '<input type="hidden" name="remove_profie_photo" id="remove_image" value="removed">'
                );
            });

            // tagging support
            $('#kt_select2_11').select2({
                placeholder: "Add sports",
                tags: false,
                templateResult: formatOption,
                templateSelection: formatOption
            });
            // tagging support
            $('#kt_select2_1').select2({
                placeholder: "Add facility",
                tags: true,
            });

            function formatOption(option) {
                let sportImg = $(option.element).data('img_sport');
                if (!option.id) {
                    return option.text;
                }
                var $option = $(
                    '<span><img style="width:20px; height=20px"  src="' + sportImg +
                    '" class="select2-option-image" /> ' +
                    option.text + '</span>'
                );

                return $option;
            }

            var avatar2 = new KTImageInput('kt_image_2');
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

            function initMap() {

                var latlng = new google.maps.LatLng('{{ $coaching_centre->lat }}',
                    '{{ $coaching_centre->long }}');
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

                        if (status == 'OK') {
                            $('#latitude').val(results[0].geometry.location.lat());
                            $('#longitude').val(results[0].geometry.location.lng());
                        } else {
                            alert('Geocode was not successful for the following reason: ' + status);
                        }
                    });
                });

                var input = document.getElementById('searchInput');
                map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

                var autocomplete = new google.maps.places.Autocomplete(input);
                autocomplete.bindTo('bounds', map);
                var infowindow = new google.maps.InfoWindow();

                // Prevent form submission on Enter key press
                input.addEventListener('keypress', function(event) {
                    if (event.keyCode === 13) {
                        event.preventDefault();
                    }
                });

                autocomplete.addListener('place_changed', function(e) {
                    infowindow.close();
                    marker.setVisible(false);
                    var place = autocomplete.getPlace();
                    if (!place.geometry) {
                        window.alert("Autocomplete's returned place contains no geometry");
                        return;
                    }

                    // If the place has a geometry, then present it on a map.
                    if (place.geometry.viewport) {
                        map.fitBounds(place.geometry.viewport);
                    } else {
                        map.setCenter(place.geometry.location);
                        map.setZoom(17);
                    }
                    marker.setPosition(place.geometry.location);
                    marker.setVisible(true);
                    $('#latitude').val(place.geometry.location.lat());
                    $('#longitude').val(place.geometry.location.lng());
                    //------address name-------
                    // var address = '';
                    // if (place.address_components) {
                    //     address = [
                    //         (place.address_components[0] && place.address_components[0].short_name ||
                    //             ''),
                    //         (place.address_components[1] && place.address_components[1].short_name ||
                    //             ''),
                    //         (place.address_components[2] && place.address_components[2].short_name ||
                    //             '')
                    //     ].join(' ');
                    // }

                    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
                    infowindow.open(map, marker);


                });

            }

        });
    </script>
@endpush
