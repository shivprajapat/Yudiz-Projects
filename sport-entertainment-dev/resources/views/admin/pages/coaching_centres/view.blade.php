@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('coaching-centres_view', $coaching_centre->id) !!}
@endpush
@push('extra-css')
    <style>
        #myDiv {
            border: 1px solid rgb(46, 30, 220);
            padding: 10px;
            margin-left: 10px;
        }

        ,
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
                    <h3 class="card-label text-uppercase">{{ $custom_title }} Details</h3>
                </div>
                <div class="card-toolbar">
                    {{-- @php
                        use App\Enums\AdminApproveEnums;
                    @endphp
                    @if ($coaching_centre->is_admin_approve == AdminApproveEnums::PENDING_APPROVAL->value)
                        <a data-url="{{ route('admin.coaching-centres.update', $coaching_centre->id) }}" name="del_select"
                            id="approve_id" data-id="{{ $coaching_centre->id }}" data-type="admin_rejected"
                            class="btn btn-md btn-danger font-weight-bolder text-uppercase mr-2" style="width:100px">
                            Reject
                        </a>
                        <a data-url="{{ route('admin.coaching-centres.update', $coaching_centre->id) }}" name="del_select"
                            id="approve_id" data-id="{{ $coaching_centre->id }}" data-type="admin_approved"
                            class="btn btn-md btn-success font-weight-bolder text-uppercase mr-2" style="width:100px">
                            Approve
                        </a>
                    @else --}}
                    @if (in_array('delete', $permissions))
                        <a data-target-href="{{ route('admin.coaching-centres.destroy', $coaching_centre->id) }}"
                            name="del_select" id="top_delete"
                            class="btn btn-md btn-light-danger font-weight-bolder text-uppercase mr-2" style="width:100px">
                            Delete
                        </a>
                    @endif
                    @if (in_array('edit', $permissions))
                        <a href="{{ route('admin.coaching-centres.edit', $coaching_centre->id) }}"
                            class="btn btn-md btn-primary font-weight-bolder text-uppercase" style="width:100px">
                            Edit
                        </a>
                    @endif
                    {{-- @endif --}}
                </div>
            </div>
            <div class="card-header">
                <div class="card-body col-md-12" style="padding-left:50px; padding-bottom:0px;">
                    <div class="row">
                        <div class="col-md-12">
                            <div>
                                <label>
                                    <h3><b><u>User Details</u>
                                        </b>
                                        <h3>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body col-md-12" style="padding-left:50px; padding-bottom:0px;">
                    <div class="row">
                        <div class="col-md-3">
                            <div>
                                <label>First Name</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($coaching_centre->first_name)
                                            {{ $coaching_centre->first_name }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div>
                                <label>Last Name</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($coaching_centre->last_name)
                                            {{ $coaching_centre->last_name }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div>
                                <label>Email Id
                                </label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($coaching_centre->email)
                                            <a href="mailto:{{ $coaching_centre->email }}">{{ $coaching_centre->email }}</a>
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div>
                                <label>Mobile Number
                                </label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($coaching_centre->mobile_number)
                                            <a
                                                href="tel:' . {{ $coaching_centre->mobile_number }}. '">{{ $coaching_centre->mobile_number }}</a>
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body col-md-12" style="padding-left:50px; padding-bottom:0px;">
                    <div class="row">
                        <div class="col-md-12">
                            <div>
                                <label>
                                    <h3><b><u>Coaching Centre Details</u></b>
                                        <h3>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body col-md-12" style="padding-left:50px; padding-bottom:0px;">
                    <div class="row">
                        <div class="col-md-3">
                            <div>
                                <label>Coaching Centre Name</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($coaching_centre->coaching_name)
                                            {{ $coaching_centre->coaching_name }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                            <div>
                                <label class="mt-5">Experience</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($coaching_centre->experience)
                                            {{ $coaching_centre->experience }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div>
                                <label>Logo</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        <img src="{{ generate_url($coaching_centre->logo) }}" alt="sports logo"
                                            width="150" height="120">
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div>
                                <label>Offered Sports</label>
                            </div>
                            <div>
                                @if ($coaching_centre->sports)
                                    @foreach ($coaching_centre->sports as $offered_sport)
                                        <label class="offered_sports"
                                            style="background-color: rgb(232, 233, 252);   border-radius: 5px; margin:2px;padding-top:7px;
                                        padding-left: 10px;padding-right:10px">
                                            <h6>
                                                <img src="{{ generate_url($offered_sport->logo) }}" alt="sports logo"
                                                    width="15" height="15">
                                                {{ $offered_sport->name }}
                                            </h6>
                                        </label>
                                    @endforeach
                                @else
                                    --
                                @endif

                            </div>
                            <div>
                                <label class="mt-5">Bio </label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($coaching_centre->bio)
                                            {{ $coaching_centre->bio }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body col-md-12" style="padding-left:50px; padding-bottom:0px;">
                    <div class="row">
                        <div class="col-md-6">
                            <div>
                                <label>Images</label>
                            </div>
                            @forelse($coaching_centre->coachingCentreImages->take(3) as $image)
                                <label>
                                    <h5>
                                        <img href="{{ Storage::url($image->image_path) }}"
                                            src="{{ generate_url($image->image_path) }}" alt="sports logo" width="120"
                                            height="70">
                                    </h5>
                                </label>
                            @empty
                                No images found
                            @endforelse
                            @if ($coaching_centre->coachingCentreImages->count() > 3)
                                <a href="{{ route('admin.coaching-centres.view-images', $coaching_centre->id) }}"
                                    class="ml-5"><u>View More</u></a>
                            @endif
                        </div>
                        <div class="col-md-6">
                            <div>
                                <label>Facitilies </label>
                            </div>
                            <div>
                                <label>
                                    <h6>
                                        @if ($coaching_centre->facility)
                                            @foreach ($selected_facilities as $index => $facility)
                                                <p style="margin-bottom: 1px">{{ $loop->index + 1 }}
                                                    {{ ' . ' . $facility->name }}
                                            @endforeach
                                        @else
                                            --
                                        @endif
                                    </h6>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body col-md-12" style="padding-left:50px; padding-bottom:0px;">
                    <div class="row">
                        <div class="col-md-12">
                            <div>
                                <label>
                                    <h3><b><u>Coaching Centre Contact Details</u></b>
                                        <h3>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body col-md-12" style="padding-left:50px; padding-bottom:0px;">
                    <div class="row">
                        <div class="col-md-4">
                            <div>
                                <label>Contact Number
                                </label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($coaching_centre->contact_number)
                                            {{ $coaching_centre->contact_number }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div>
                                <label>Contact Email ID
                                </label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($coaching_centre->contact_email)
                                            {{ $coaching_centre->contact_email }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-5">
                            <div>
                                <label>Sign up Date and Time
                                </label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($coaching_centre->created_at)
                                            {{ $coaching_centre->created_at->format('d/m/Y') . ' | ' }}
                                            {{ $coaching_centre->created_at->format('g:i A') }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body col-md-12" style="padding-left:50px; padding-bottom:0px;">
                    <div class="row">
                        <div class="col-md-4">
                            <div>
                                <label>Address
                                </label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($coaching_centre->address_line1 || $coaching_centre->address_line2)
                                            {{ $coaching_centre->address_line1 }} <br>
                                            {{ $coaching_centre->address_line2 }}<br>
                                            {{ $coaching_centre->city->name . ' , ' . $coaching_centre->state->name . ' , ' . $coaching_centre->pincode }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-8 mb-5">
                            <div id="map" style="height: 300px;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal-->
        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalSizeSm"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header text-center">
                        <h5 class="modal-title w-100"><b>Rejection Reason</b></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <i aria-hidden="true" class="ki ki-close"></i>
                        </button>
                    </div>

                    <form action="" id="addRejectionReason">
                        @csrf
                        <input type="hidden" name="id" value="">
                        <div class="modal-body ">
                            <div class="form-group">
                                <textarea type="text" class="form-control @error('rejection_reason') is-invalid @enderror" id="rejection_reason"
                                    name="rejection_reason" value="{{ old('rejection_reason') }}" placeholder="Please enter a reason for Rejection"
                                    style="height: 100px;"></textarea>
                                @if ($errors->has('rejection_reason'))
                                    <span class="help-block">
                                        <strong class="form-text">{{ $errors->first('rejection_reason') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>
                        <div class="card-footer" style="padding:15px;padding-left:180px">
                            <button type="submit" class="btn btn-primary mr-2">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        {{-- end Modal --}}
    </div>
@endsection
@push('extra-js')
    <script
        src="https://maps.googleapis.com/maps/api/js?sensor=true&key={{ config('utility.MAP_KEY') }}&libraries=geometry,places">
    </script>
    <script>
        $(document).ready(function(e) {
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
                draggable: false,
            });
        });
        var userIndexRoute = "{{ route('admin.coaching-centres.index') }}";
    </script>
@endpush
