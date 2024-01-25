@extends('coaching.layouts.app')
@php
    $type = $data['type'];
    $step_name = $data['step_name'];
    $view_more_images = $data['view_more_images'];
@endphp

@push('breadcrumb')
    @if ($step_name == 'personal_details')
        {!! Breadcrumbs::render('personal_details') !!}
    @elseif($step_name == 'coaching_centre_details')
        {!! Breadcrumbs::render('coaching_centre_details') !!}
    @elseif($step_name == 'coaching_centre_contact_details')
        {!! Breadcrumbs::render('coaching_centre_contact_details') !!}
    @elseif($step_name == 'bank_details')
        {!! Breadcrumbs::render('bank_details') !!}
    @endif
@endpush

@push('extra-css')
    <style>
        .a_tag_witdh a {
            width: 100%;
            font-weight: 500
        }

        .p_font_bold {
            font-weight: 600;
            font-family: 'Inter';
            font-style: normal;
            font-weight: 600;
            font-size: 18px;
            line-height: 22px;
            text-align: left;
        }

        .offered_sports {
            font-family: 'Inter';
            font-style: normal;
            font-weight: 600;
            font-size: 14px;
            line-height: 17px;
        }

        .offered_sports_img_with_text {
            display: inline;
            border: 1px solid #e4e0e0;
            background: #f2f5f8;
            font-weight: 600;
            padding: 8px;
            margin-right: 4px;
            display: flex;
            border-radius: 10px;
            gap: 5px;
        }

        .offer-wrapper {
            display: flex;
            flex-wrap: wrap;
            gap: 10px
        }

        label.lbl_custom_css {
            font-family: 'Inter';
            font-style: normal;
            font-weight: 400;
            font-size: 16px;
            line-height: 19px;
            text-align: left;
        }

        .disable_a_tag {
            pointer-events: none;
            cursor: default;
            text-decoration: none;
            color: black;
        }
    </style>
@endpush

@section('content')
    <div class="container">
        <div class="card card-custom">
            <div class="card-header">
                <div class="card-title">
                    <span class="card-icon">
                        <i class="fas fa-users text-primary"></i>
                    </span>
                    <h3 class="card-label">{{ ucwords(str_replace('_', ' ', $step_name)) }}</h3>
                </div>
                <div class="card-toolbar">
                    @if ($type == 'view')
                        <a href="{{ route('coaching.coachingDetails', ['step_name' => $step_name, 'view_more_images' => $view_more_images, 'type' => 'edit']) }}"
                            style="width: 90px" class="btn btn-primary font-weight-bolder text-uppercase">
                            Edit
                        </a>
                    @elseif($type = 'edit')
                        <a href="{{ route('coaching.coachingDetails', ['step_name' => $step_name, 'view_more_images' => $view_more_images, 'type' => 'view']) }}"
                            style="width: 90px" class="btn btn-primary font-weight-bolder text-uppercase ">
                            view
                        </a>
                    @endif

                </div>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-xxl-3 col-xl-4 col-lg-6 col-md-6 mb-2">
                        <a href="{{ route('coaching.coachingDetails', ['step_name' => 'personal_details']) }}"
                            class="btn btn-outline-primary w-100 {{ $step_name == 'personal_details' ? 'active disable_a_tag' : '' }}">Personal
                            Details</a>
                    </div>
                    <div class="col-xxl-3 col-xl-4 col-lg-6 col-md-6 mb-2">
                        <a href="{{ route('coaching.coachingDetails', ['step_name' => 'coaching_centre_details']) }}"
                            class="btn btn-outline-primary w-100 {{ $step_name == 'coaching_centre_details' ? 'active disable_a_tag' : '' }}">Coaching
                            Center Details</a>
                    </div>
                    <div class="col-xxl-3 col-xl-4 col-lg-6 col-md-6 mb-2">
                        <a href="{{ route('coaching.coachingDetails', ['step_name' => 'coaching_centre_contact_details']) }}"
                            class="btn btn-outline-primary w-100 {{ $step_name == 'coaching_centre_contact_details' ? 'active disable_a_tag' : '' }}">Coaching
                            Center Contact Details</a>
                    </div>
                    <div class="col-xxl-3 col-xl-4 col-lg-6 col-md-6 mb-2">
                        <a href="{{ route('coaching.coachingDetails', ['step_name' => 'bank_details']) }}"
                            class="btn btn-outline-primary w-100 {{ $step_name == 'bank_details' ? 'active disable_a_tag' : '' }}">Bank
                            Details</a>
                    </div>
                </div>
            </div>
            <div class="card-body">
                @if ($step_name == 'personal_details')
                    <form action="{{ route('coaching.coachingUpdate', ['step_name' => $step_name]) }}"
                        id="personal_details" method="POST" enctype="multipart/form-data">
                        @csrf
                        <div class="row">
                            <div class="col-md-3">
                                @if ($type == 'edit')
                                    @if ($coaching_data->profile_photo)
                                        <div class="symbol symbol-120 mr-5">
                                            <div class="symbol-label"
                                                style="background-image:url({{ asset('storage/' . $coaching_data->profile_photo) }})">
                                                </a>
                                            </div>
                                        </div>
                                    @endif
                                    <div class="form-group mt-2">
                                        <div class="custom-file">
                                            <input type="file" class="custom-file-input" id="profile_photo"
                                                name="profile_photo" accept="image/*" tabindex="0" />
                                            <label class="custom-file-label @error('profile_photo') is-invalid @enderror"
                                                for="customFile">Choose file</label>
                                            @if ($errors->has('profile_photo'))
                                                <span class="text-danger">
                                                    <strong
                                                        class="form-text">{{ $errors->first('profile_photo') }}</strong>
                                                </span>
                                            @endif
                                        </div>
                                    </div>
                                @else
                                    <img src="{{ generate_url($coaching_data->profile_photo) }}" alt="profile_photo"
                                        style="height: auto; width: 100%">
                                @endif

                            </div>
                            <div class="col-md-3">
                                <div>
                                    <label for="" class="lbl_custom_css">First Name</label>
                                    @if ($type == 'edit')
                                        <input type="text" name="first_name" class="form-control"
                                            value="{{ $coaching_data->first_name }}" />
                                        @if ($errors->has('first_name'))
                                            <span class="text-danger">
                                                <strong class="form-text">{{ $errors->first('first_name') }}</strong>
                                            </span>
                                        @endif
                                    @else
                                        <p class="p_font_bold">
                                            {{ $coaching_data->first_name }}
                                        </p>
                                    @endif
                                </div>
                                <div style="margin-top: 30px">
                                    <label for="" class="lbl_custom_css">Email Id</label>
                                    @if ($type == 'edit')
                                        <input type="text" name="email" class="form-control"
                                            value="{{ $coaching_data->email }}" />
                                        @if ($errors->has('email'))
                                            <span class="text-danger">
                                                <strong class="form-text">{{ $errors->first('email') }}</strong>
                                            </span>
                                        @endif
                                    @else
                                        <p class="p_font_bold">
                                            {{ $coaching_data->email }}
                                        </p>
                                    @endif
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div>
                                    <label for="" class="lbl_custom_css">Last Name</label>
                                    @if ($type == 'edit')
                                        <input type="text" name="last_name" class="form-control"
                                            value="{{ $coaching_data->last_name }}" />
                                        @if ($errors->has('last_name'))
                                            <span class="text-danger">
                                                <strong class="form-text">{{ $errors->first('last_name') }}</strong>
                                            </span>
                                        @endif
                                    @else
                                        <p class="p_font_bold">
                                            {{ $coaching_data->last_name }}
                                        </p>
                                    @endif

                                </div>
                                <div style="margin-top: 30px">
                                    <label for="" class="lbl_custom_css">Mobile Number</label>
                                    @if ($type == 'edit')
                                        <input type="text" name="mobile_number" class="form-control"
                                            value="{{ $coaching_data->mobile_number }}" />
                                        @if ($errors->has('mobile_number'))
                                            <span class="text-danger">
                                                <strong class="form-text">{{ $errors->first('mobile_number') }}</strong>
                                            </span>
                                        @endif
                                    @else
                                        <p class="p_font_bold">
                                            +91 {{ $coaching_data->mobile_number }}
                                        </p>
                                    @endif

                                </div>
                            </div>

                        </div>
                        @if ($type == 'edit')
                            <div class="card-footer mt-5">
                                <button type="submit" class="btn btn-primary mr-2"> Update Personal Details</button>
                                <a href="{{ route('coaching.coachingDetails', ['step_name' => $step_name, 'type' => 'view']) }}"
                                    style="width: 90px" class="btn btn-primary font-weight-bolder text-uppercase ">
                                    Cancel
                                </a>
                            </div>
                        @endif

                    </form>
                @endif
                @if ($step_name == 'coaching_centre_details')
                    @if ($view_more_images == false)
                        <form action="{{ route('coaching.coachingUpdate', ['step_name' => $step_name]) }}"
                            id="coaching_centre_details" method="POST" enctype="multipart/form-data">
                            @csrf
                            <div class="row">
                                <div class="col-md-3">
                                    <label for="" class="lbl_custom_css">Coaching Center Logo</label>
                                    @if ($type == 'edit')
                                        @if ($coaching_data->logo)
                                            {{-- <div class="symbol symbol-120 mr-5">
                                            <div class="symbol-label"
                                                style="background-image:url({{ asset('storage/' . $coaching_data->logo) }})">
                                                </a>
                                            </div>
                                        </div> --}}
                                            <img src="{{ generate_url($coaching_data->logo) }}" alt="logo"
                                                style="height: auto; width: 100%">
                                        @endif
                                        <div class="form-group mt-2">
                                            <div class="custom-file">
                                                <input type="file" class="custom-file-input" id="logo"
                                                    name="logo" accept="image/*" tabindex="0" />
                                                <label class="custom-file-label @error('logo') is-invalid @enderror"
                                                    for="customFile">Choose file</label>
                                                @if ($errors->has('logo'))
                                                    <span class="text-danger">
                                                        <strong class="form-text">{{ $errors->first('logo') }}</strong>
                                                    </span>
                                                @endif
                                            </div>
                                        </div>
                                    @else
                                        <img src="{{ generate_url($coaching_data->logo) }}" alt="logo"
                                            style="height: auto; width: 100%">
                                    @endif
                                </div>
                                <div class="col-md-3">
                                    <div>
                                        <label for="" class="lbl_custom_css">Coaching Center Name</label>
                                        @if ($type == 'edit')
                                            <input type="text" name="coaching_name" class="form-control"
                                                value="{{ $coaching_data->coaching_name }}" />
                                            @if ($errors->has('coaching_name'))
                                                <span class="text-danger">
                                                    <strong
                                                        class="form-text">{{ $errors->first('coaching_name') }}</strong>
                                                </span>
                                            @endif
                                        @else
                                            <p class="p_font_bold">
                                                {{ $coaching_data->coaching_name }}
                                            </p>
                                        @endif
                                    </div>
                                    <div style="margin-top: 30px">
                                        <label for="" class="lbl_custom_css">Experience</label>
                                        @if ($type == 'edit')
                                            <input type="text" name="experience" class="form-control"
                                                value="{{ $coaching_data->experience }}" />
                                            @if ($errors->has('experience'))
                                                <span class="text-danger">
                                                    <strong class="form-text">{{ $errors->first('experience') }}</strong>
                                                </span>
                                            @endif
                                        @else
                                            <p class="p_font_bold">
                                                {{ $coaching_data->experience }} Year
                                            </p>
                                        @endif
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div>
                                        <label for="" class="lbl_custom_css">Offered Sports</label>
                                        @if ($type == 'edit')
                                            <select name="sport_id[]" id="sport_id" multiple="multiple"
                                                class="form-control select2_offered_sports">
                                                @foreach ($allSports as $sport)
                                                    <option data-img_sport="{{ generate_url($sport->logo) }}"
                                                        value="{{ $sport->id }}"
                                                        {{ in_array($sport->id, $offeredSports) ? 'selected' : '' }}>
                                                        {{ $sport->name }}
                                                    </option>
                                                @endforeach
                                            </select>

                                            @if ($errors->has('sport_id'))
                                                <span class="text-danger">
                                                    <strong class="form-text">{{ $errors->first('sport_id') }}</strong>
                                                </span>
                                            @endif
                                        @else
                                            <p class="offered_sports">
                                            <div class="offer-wrapper">
                                                @if ($coaching_data->offeredSports)
                                                    @foreach ($coaching_data->offeredSports as $sports)
                                                        <div class="offered_sports_img_with_text">
                                                            <img src=" {{ generate_url($sports->sport->logo) }} "
                                                                style="width: 21px; height: auto;" alt="">
                                                            <span> {{ $sports->sport->name }} </span>
                                                        </div>
                                                    @endforeach
                                                @endif
                                            </div>
                                            </p>
                                        @endif

                                    </div>
                                    <div style="margin-top: 30px">
                                        <label for="" class="lbl_custom_css">Bio</label>
                                        @if ($type == 'edit')
                                            <textarea type="text" name="bio" class="form-control"> {{ $coaching_data->bio }} </textarea>
                                            @if ($errors->has('bio'))
                                                <span class="text-danger">
                                                    <strong class="form-text">{{ $errors->first('bio') }}</strong>
                                                </span>
                                            @endif
                                        @else
                                            <p class="p_font_bold">
                                                {{ $coaching_data->bio }}
                                            </p>
                                        @endif

                                    </div>
                                </div>

                            </div>
                            <div class="row mt-5">
                                <div class="col-md-6">
                                    <label for="" class="lbl_custom_css">Facilities</label>
                                    @if ($type == 'edit')
                                        <input id="facility" class="form-control  tagify" name='facility'
                                            placeholder='type...' value=" {{ $editedFacilities }} " />
                                    @else
                                        <ol>
                                            @foreach ($facilities as $facility)
                                                @if ($facility['is_selected'])
                                                    <li class="p_font_bold">
                                                        {{ $facility['name'] }}
                                                    </li>
                                                @endif
                                            @endforeach
                                        </ol>
                                    @endif
                                </div>
                                <div class="col-md-4">
                                    <label for="" class="lbl_custom_css">Images</label>
                                    @if ($coaching_data->coachingCentreImages)
                                        <p>
                                            @foreach ($coaching_data->coachingCentreImages->take(3) as $image)
                                                <img src="{{ generate_url($image->image_path) }}" alt="sports logo"
                                                    width="100" height="80">
                                            @endforeach
                                            @if ($type == 'edit')
                                                <a href="{{ route('coaching.coachingDetails', ['step_name' => 'coaching_centre_details', 'view_more_images' => true, 'type' => 'edit']) }}"
                                                    class="ml-5"><u>View More</u></a>
                                        </p>
                                    @else
                                        <a href="{{ route('coaching.coachingDetails', ['step_name' => 'coaching_centre_details', 'view_more_images' => true, 'type' => 'view']) }}"
                                            class="ml-5"><u>View More</u></a>
                                        </p>
                                    @endif
                                </div>
                            </div>
                            @if ($type == 'edit')
                                <div class="card-footer mt-3">
                                    <button type="submit" class="btn btn-primary mr-2"> Update Coaching Centre
                                        Details</button>
                                    <a href="{{ route('coaching.coachingDetails', ['step_name' => $step_name, 'type' => 'view']) }}"
                                        style="width: 90px" class="btn btn-primary font-weight-bolder text-uppercase ">
                                        Cancel
                                    </a>
                                </div>
                            @endif
                        </form>
                    @endif
                @else
                    @if ($type == 'edit')
                        <div class="card-toolbar" style="margin-left: 72%">
                            <a href="{{ route('coaching.coachingUpdateImages.performAction', 0) }}" name="del_select"
                                id="del_select" data-action="delete_all"
                                class="btn btn-sm btn-light-danger font-weight-bolder text-uppercase mr-2 perform_action">
                                <i class="far fa-trash-alt"></i> Delete Selected
                            </a>
                            <a href="{{ route('coaching.coachingUpdateImages.performAction', $coaching_data->id) }}"
                                data-action="set_all_banner"
                                class="btn btn-sm btn-primary font-weight-bolder text-uppercase perform_action">
                                <i class="fa fa-image"></i>
                                Set As Banner
                            </a>
                        </div>
                    @endif
                    <form
                        action="{{ route('coaching.coachingUpdateImages', ['step_name' => $step_name, 'type' => $type, 'coaching_id' => $coaching_data->id, 'view_more_images' => $view_more_images]) }}"
                        id="coaching_centre_images" method="POST" enctype="multipart/form-data">
                        @csrf
                        @if ($type == 'edit')
                            <div class="form-group">
                                <label for="images[]">Images (Multiple):</label>
                                <div class="custom-file">
                                    <input type="file" class="custom-file-input" id="imageInput" name="images[]"
                                        enctype="multipart/form-data" tabindex="0" multiple="multiple"
                                        accept="image/*" />
                                    <input type="hidden" name="images[]" value="" />
                                    <label class="custom-file-label @error('images[]') is-invalid @enderror"
                                        for="customFile">Choose
                                        file</label>
                                    @if ($errors->has('images[]'))
                                        <span class="text-danger">
                                            <strong class="form-text">{{ $errors->first('images[]') }}</strong>
                                        </span>
                                    @endif
                                </div>
                            </div>
                        @endif
                        <div class="form-group" id="div-image">
                            <div class="row">
                                <div class="col-md-12">
                                    <div>
                                        <label>
                                            <h5>Banner Images</h5>
                                        </label>
                                    </div>
                                    <ol class="dd-list sortable_list1" id="sortable_list1"
                                        style="overflow:hidden; padding: 0px;">
                                        @foreach ($coaching_data->coachingCentreImages as $image)
                                            @if ($image->image_path && $image->is_banner == 1)
                                                <li class="dd-item dd3-item" style="display:inline-block; margin: 10px; ">
                                                    <div class="symbol symbol-120 mb-10">
                                                        <a href="{{ Storage::url($image->image_path) }}"
                                                            target="_blank"><img style="height:100px; width:100px"
                                                                src="{{ Storage::url($image->image_path) }}"></a>
                                                        @if ($type == 'edit')
                                                            <input type="checkbox" class="image-checkbox"
                                                                data-id="{{ $image->id }}"
                                                                value="{{ $image->id }}"
                                                                style="position: absolute; top: 0px; right: 0px;">
                                                        @endif
                                                    </div>
                                                </li>
                                            @endif
                                        @endforeach
                                    </ol>
                                </div>
                            </div>
                        </div>
                        <div class="form-group" id="div-image">
                            <div class="row">
                                <div class="col-md-12">
                                    <div>
                                        <label>
                                            <h5>Images</h5>
                                        </label>
                                    </div>
                                    <ol class="dd-list" id="sortable_list" style="overflow:hidden; padding: 0px;">
                                        @foreach ($coaching_data->coachingCentreImages as $image)
                                            @if ($image->image_path && $image->is_banner == 0)
                                                <li class="dd-item dd3-item" style="display:inline-block; margin: 10px; ">
                                                    <div class="symbol symbol-120 mb-10">
                                                        <a href="{{ Storage::url($image->image_path) }}"
                                                            target="_blank"><img style="height:80px; width:80px"
                                                                src="{{ Storage::url($image->image_path) }}"></a>
                                                        @if ($type == 'edit')
                                                            <input type="checkbox" class="image-checkbox"
                                                                data-id="{{ $image->id }}"
                                                                value="{{ $image->id }}"
                                                                style="position: absolute; top: 0px; right: 0px;">
                                                        @endif
                                                    </div>
                                                </li>
                                            @endif
                                        @endforeach
                                    </ol>
                                </div>
                            </div>
                        </div>
                        @if ($type == 'edit')
                            <div class="card-footer mt-3">
                                <button type="submit" class="btn btn-primary mr-2"> Update Images
                                </button>
                                <a href="{{ route('coaching.coachingDetails', ['step_name' => $step_name, 'view_more_images' => true, 'type' => 'edit']) }}"
                                    style="width: 90px" class="btn btn-primary font-weight-bolder text-uppercase ">
                                    Cancel
                                </a>
                                <a href="{{ route('coaching.coachingDetails', ['step_name' => $step_name, 'type' => 'edit']) }}"
                                    style="width: 90px" class="btn btn-primary font-weight-bolder text-uppercase ">
                                    back
                                </a>
                            </div>
                        @else
                            <div class="card-footer mt-3">
                                <a href="{{ route('coaching.coachingDetails', ['step_name' => $step_name, 'type' => 'view']) }}"
                                    style="width: 90px" class="btn btn-primary font-weight-bolder text-uppercase ">
                                    back
                                </a>
                            </div>
                        @endif
                    </form>
                @endif
                @endif
                @if ($step_name == 'coaching_centre_contact_details')

                    <form action="{{ route('coaching.coachingUpdate', ['step_name' => $step_name]) }}"
                        id="coaching_centre_contact_details" method="POST" enctype="multipart/form-data">
                        @csrf
                        <div class="row">
                            <div class="col-md-3">
                                <div>
                                    <label for="" class="lbl_custom_css">Contact Number</label>
                                    @if ($type == 'edit')
                                        <input type="text" name="contact_number" class="form-control"
                                            value="{{ $coaching_data->contact_number }}" />
                                        @if ($errors->has('contact_number'))
                                            <span class="text-danger">
                                                <strong class="form-text">{{ $errors->first('contact_number') }}</strong>
                                            </span>
                                        @endif
                                    @else
                                        <p class="p_font_bold">
                                            {{ $coaching_data->contact_number }}
                                        </p>
                                    @endif
                                </div>
                                <div style="margin-top: 30px">
                                    <label for="" class="lbl_custom_css">Address Line 1</label>
                                    @if ($type == 'edit')
                                        <input type="text" name="address_line1" class="form-control"
                                            value="{{ $coaching_data->address_line1 }}" />
                                        @if ($errors->has('address_line1'))
                                            <span class="text-danger">
                                                <strong class="form-text">{{ $errors->first('address_line1') }}</strong>
                                            </span>
                                        @endif
                                    @else
                                        <p class="p_font_bold">
                                            {{ $coaching_data->address_line1 }}
                                        </p>
                                    @endif
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div>
                                    <label for="" class="lbl_custom_css">Contact Email Id</label>
                                    @if ($type == 'edit')
                                        <input type="email" name="contact_email" class="form-control"
                                            value="{{ $coaching_data->contact_email }}" />
                                        @if ($errors->has('contact_email'))
                                            <span class="text-danger">
                                                <strong class="form-text">{{ $errors->first('contact_email') }}</strong>
                                            </span>
                                        @endif
                                    @else
                                        <p class="p_font_bold">
                                            {{ $coaching_data->contact_email }}
                                        </p>
                                    @endif

                                </div>
                                <div style="margin-top: 30px">
                                    <label for="" class="lbl_custom_css">Address Line 2</label>
                                    @if ($type == 'edit')
                                        <input type="text" name="address_line2" class="form-control"
                                            value="{{ $coaching_data->address_line2 }}" />
                                        @if ($errors->has('address_line2'))
                                            <span class="text-danger">
                                                <strong class="form-text">{{ $errors->first('address_line2') }}</strong>
                                            </span>
                                        @endif
                                    @else
                                        <p class="p_font_bold">
                                            {{ $coaching_data->address_line2 }}
                                        </p>
                                    @endif
                                </div>

                            </div>
                        </div>
                        @if ($type == 'edit')
                            <div class="card-footer mt-2">
                                <button type="submit" class="btn btn-primary mr-2"> Update Contact Details </button>
                                <a href="{{ route('coaching.coachingDetails', ['step_name' => $step_name, 'type' => 'view']) }}"
                                    style="width: 90px" class="btn btn-primary font-weight-bolder text-uppercase ">
                                    Cancel
                                </a>
                            </div>
                        @endif

                    </form>
                @endif
                @if ($step_name == 'bank_details')
                    <form action="{{ route('coaching.coachingUpdate', ['step_name' => $step_name]) }}"
                        id="personal_details" method="POST" enctype="multipart/form-data">
                        @csrf
                        <div class="row">
                            <div class="col-md-4">
                                <div>
                                    <label for="" class="lbl_custom_css">Account Holder Name</label>
                                    @if ($type == 'edit')
                                        <input type="text" name="account_person_name" class="form-control"
                                            value="{{ $coaching_data->account_person_name }}" />
                                        @if ($errors->has('account_person_name'))
                                            <span class="text-danger">
                                                <strong
                                                    class="form-text">{{ $errors->first('account_person_name') }}</strong>
                                            </span>
                                        @endif
                                    @else
                                        <p class="p_font_bold">
                                            {{ $coaching_data->account_person_name }}
                                        </p>
                                    @endif
                                </div>
                                <div style="margin-top: 30px">
                                    <label for="" class="lbl_custom_css"> Account Number </label>
                                    @if ($type == 'edit')
                                        <input type="text" name="account_number" class="form-control"
                                            value="{{ $coaching_data->account_number }}" />
                                        @if ($errors->has('account_number'))
                                            <span class="text-danger">
                                                <strong class="form-text">{{ $errors->first('account_number') }}</strong>
                                            </span>
                                        @endif
                                    @else
                                        <p class="p_font_bold">
                                            {{ $coaching_data->account_number }}
                                        </p>
                                    @endif
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div>
                                    <label for="" class="lbl_custom_css">Bank Name</label>
                                    @if ($type == 'edit')
                                        <input type="text" name="bank_name" class="form-control"
                                            value="{{ $coaching_data->bank_name }}" />
                                        @if ($errors->has('bank_name'))
                                            <span class="text-danger">
                                                <strong class="form-text">{{ $errors->first('bank_name') }}</strong>
                                            </span>
                                        @endif
                                    @else
                                        <p class="p_font_bold">
                                            {{ $coaching_data->bank_name }}
                                        </p>
                                    @endif

                                </div>
                                <div style="margin-top: 30px">
                                    <label for="" class="lbl_custom_css">IFSC Code</label>
                                    @if ($type == 'edit')
                                        <input type="text" name="ifsc_code" class="form-control"
                                            value="{{ $coaching_data->ifsc_code }}" />
                                        @if ($errors->has('ifsc_code'))
                                            <span class="text-danger">
                                                <strong class="form-text">{{ $errors->first('ifsc_code') }}</strong>
                                            </span>
                                        @endif
                                    @else
                                        <p class="p_font_bold">
                                            {{ $coaching_data->ifsc_code }}
                                        </p>
                                    @endif

                                </div>
                            </div>
                        </div>
                        @if ($type == 'edit')
                            <div class="card-footer">
                                <button type="submit" class="btn btn-primary mr-2"> Update Bank Detail </button>
                                <a href="{{ route('coaching.coachingDetails', ['step_name' => $step_name, 'type' => 'view']) }}"
                                    style="width: 90px" class="btn btn-primary font-weight-bolder text-uppercase ">
                                    Cancel
                                </a>
                            </div>
                        @endif

                    </form>
                @endif
            </div>
        </div>
    </div>
@endsection
@push('extra-js')
    <script>
        $('.select2_offered_sports').select2({
            placeholder: "Please Select Sports",
            templateResult: formatOption,
            templateSelection: formatOption,
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

        $(document).ready(function() {
            // let isEditMode = "{{ $data['type'] }}";
            // if (isEditMode == "edit") {
            //     var KTTagify = function() {
            //         var demo1 = () => {
            //             var input = document.querySelector('input[name=facility]');

            //             tagify = new Tagify(input, {

            //             })

            //             input.addEventListener(
            //                 'click', tagify
            //                 .removeAllTags.bind(tagify));
            //             tagify.on('add', function() {});
            //         }
            //         return {
            //             init: function() {
            //                 demo1();
            //             }
            //         };
            //     }();
            //     KTTagify.init();
            // }

            // Add Image
            $("#imageInput").on('change', function() {
                event.preventDefault();
                var files = $(this)[0].files;
                var formData = new FormData();
                for (var i = 0; i < files.length; i++) {
                    formData.append('images[]', files[i]);
                    loadImage(files[i]);
                }

                function loadImage(path) {
                    var reader = new FileReader();
                    reader.onload = function(path) {
                        var img = path.target.result;

                        var listItem = $(
                            '<li class="dd-item dd3-item" style="display:inline-block; margin:10px;">' +
                            '<div class="symbol symbol-120 mb-10">' +
                            '<a href="' + img +
                            '" target="_blank"><img style="height:100px; width:100px" src="' +
                            img + '"></a>' +
                            '</li>');

                        $('#sortable_list').append(listItem);
                    }
                    reader.readAsDataURL(files[i]);
                }
            });

            $(document).on("click", ".perform_action", function(e) {
                $(".perform_action").attr("disabled", "disabled");
                e.preventDefault();
                var url = $(this).attr("href");
                var action = $(this).data("action");
                var selectedImages = [];
                var totalBanners = {!! json_encode($total_banners) !!};
                var checkboxes = $(".sortable_list1  input[class='image-checkbox']");
                var checkedCheckboxes = checkboxes.filter(":checked");

                $(".dd-list input[class='image-checkbox']:checked").each(
                    function() {
                        selectedImages.push($(this).val());
                    }
                );
                if (selectedImages.length > 0) {
                    var ids = selectedImages.join();
                    var confirmTitle;
                    var confirmText;
                    var confirmIcon;
                    var showCancel;
                    var confirmButtonTxt;
                    var showConfirm = false;
                    if (action == 'set_all_banner') {
                        if (checkedCheckboxes.length >= 1) {
                            confirmTitle = "Oops!";
                            confirmText = "Some images are already selected as banner!";
                            confirmIcon = "warning";
                            showCancel = false;
                            showConfirm = false;
                            confirmButtonTxt = "Yes";
                        } else if (totalBanners >= 10 || ($(
                                ".dd-list input[class='image-checkbox']:checked").length + totalBanners) >
                            10) {
                            confirmTitle = "Oops!";
                            confirmText = "You can not set more than 10 banner images!";
                            confirmIcon = "warning";
                            showCancel = false;
                            showConfirm = false;
                            confirmButtonTxt = "Yes";
                        } else {
                            confirmTitle = "Are you sure?";
                            confirmText = "You want to add this image as a banner!";
                            confirmIcon = "warning";
                            showCancel = true;
                            showConfirm = true;
                            confirmButtonTxt = "Yes";
                        }
                    } else {
                        if (totalBanners <= 1 || checkboxes.length === checkedCheckboxes.length) {
                            confirmTitle = "Oops!";
                            confirmText = "At least 1 banner image is required!";
                            confirmIcon = "warning";
                            showCancel = false;
                            showConfirm = false;
                            confirmButtonTxt = "Yes";
                        } else {
                            confirmTitle = "Are you sure?";
                            confirmText = "You want to delete these images!";
                            confirmIcon = "warning";
                            showCancel = true;
                            showConfirm = true;
                            confirmButtonTxt = "Yes";
                        }
                    }
                    Swal.fire({
                        title: confirmTitle,
                        text: confirmText,
                        icon: confirmIcon,
                        showCancelButton: showCancel,
                        showConfirmButton: showConfirm,
                        confirmButtonText: confirmButtonTxt,
                    }).then(function(result) {
                        if (result.value) {
                            $.ajax({
                                url: url,
                                type: "GET",
                                dataType: "json",
                                data: {
                                    action: action,
                                    ids: ids,
                                    _token: $('meta[name="csrf_token"]').attr(
                                        "content"
                                    ),
                                },
                                success: function(response) {

                                    $(".delete_all_link").removeAttr("disabled");
                                    if (response.action == 'delete_all')
                                        Swal.fire({
                                            title: "Deleted!",
                                            icon: "success",
                                            text: "Records was deleted.",
                                            showConfirmButton: false,
                                            timer: 1500,
                                        });
                                    else {
                                        Swal.fire({
                                            title: "Set!",
                                            icon: "success",
                                            text: "Successfully set as banner.",
                                            showConfirmButton: false,
                                            timer: 1500,
                                        });
                                    }
                                    location.reload(true)
                                },
                            });

                        } else {
                            $(".image-checkbox").prop('checked', false);
                        }
                    });
                } else {
                    $(".image-checkbox").prop('checked', false);
                    $(".delete_all_link").removeAttr("disabled");
                }
            });

        });
    </script>
@endpush
