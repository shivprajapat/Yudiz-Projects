@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('bookings_view', $booking->id) !!}
@endpush
@push('extra-css')
    <style>
        #myDiv {
            border: 1px solid rgb(15, 15, 18);
            margin-left: 51px;
            padding: 5px;
            margin-top: 1px;
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
            </div>
            <div class="card-header">
                <div class="card-body col-md-12" style="padding-left:50px; padding-bottom:0px;">
                    <div class="row">
                        <div class="col-md-12">
                            <div>
                                <label>
                                    <h3><b><u>Booking Details</u>
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
                                <label>Booking ID</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($booking->booking_id)
                                            {{ $booking->booking_id }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div>
                                <label>Booking Date | Time </label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($booking->booking_date || $booking->booking_time )
                                            {{ $booking->booking_date . ' | ' .  $booking->booking_time }}
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
                                    <h3><b><u>User's Details</u>
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
                                <label>
                                    <h5>
                                        <img src="{{ generate_url($booking->user->profile_photo) }}" alt="sports logo"
                                            width="150" height="120">
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div>
                                <label>End User Name</label>
                            </div>
                            <div>
                                <label>
                                    <h4>
                                        @if ($booking->user->first_name || $booking->user->last_name)
                                            {{ $booking->user->first_name. ' ' .$booking->user->last_name}}
                                        @else
                                            --
                                        @endif
                                    </h4>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-5">
                            <div>
                                <label>Mobile Number</label>
                            </div>
                            <div>
                                <label>
                                    <h4>
                                        @if ($booking->user->mobile_number)
                                            {{'+91 - '  .$booking->user->mobile_number }}
                                        @else
                                            --
                                        @endif
                                    </h4>
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
                                    <h3><b><u>Other Participants Details</u>
                                        </b>
                                        <h3>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                @foreach ($booking->user->participants as $participant)
                <div class="card-body col-md-12" style="padding-left:50px; padding-bottom:0px;">
                    <div class="row">
                        <div class="col-md-2">
                            <div>
                                <label>
                                    <h5>
                                        <img src="{{ generate_url($participant->profile_photo) }}" alt="sports logo"
                                            width="75" height="60">
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div>
                                <label>Firts Name</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($participant->first_name)
                                            {{ $participant->first_name }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div>
                                <label>Last Name</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($participant->last_name)
                                            {{ $participant->last_name }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>

                        <div class="col-md-2">
                            <div>
                                <label>Gender</label>
                            </div>
                            <div>
                                <label>
                                    <h5>

                                            {{ $participant->gender == 1 ? "Male" : "Female" }}
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div>
                                <label>DOB</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($participant->dob)
                                            {{ $participant->dob }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div>
                                <label>School Name</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($participant->school_name)
                                            {{ $participant->school_name }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                @endforeach
                <div class="card-body col-md-12" style="padding-left:50px; padding-bottom:0px;">
                    <div class="row">
                        <div class="col-md-12">
                            <div>
                                <label>
                                    <h3><b><u>Batch Details</u>
                                        </b>
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
                                <label>Batch Name</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($booking->batch->name)
                                            {{ $booking->batch->name }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>

                        <div class="col-md-4">
                            <div>
                                <label>Sport Name </label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($booking->batch->sport->name)
                                            {{ $booking->batch->sport->name }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div>
                                <label>Age Group</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($booking->batch->ageGroup->age_name)
                                            {{ $booking->batch->ageGroup->age_name }}
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
                                <label>Session Timing</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($booking->batch->start_time || $booking->batch->end_time)
                                            {{ $booking->batch->start_time . ' To ' . $booking->batch->end_time }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div>
                                <label>Session Days </label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($booking->batch->session_days)
                                            {{ $booking->batch->session_days }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div>
                                <label>Price </label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($booking->batch->price)
                                            {{ $booking->batch->price . ' INR'}}
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
                                    <h3><b><u>Coaching Centre Details</u>
                                        </b>
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
                                <label>Coaching Centre Name</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($booking->batch->coachingCentre->coaching_name)
                                            {{ $booking->batch->coachingCentre->coaching_name }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div>
                                <label>Address</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($booking->batch->coachingCentre->address_line1 || $booking->batch->coachingCentre->address_line1)
                                            {{ $booking->batch->coachingCentre->address_line1 .' , '.  $booking->batch->coachingCentre->address_line2 .' , '.$booking->batch->coachingCentre->city ->name .' , '. $booking->batch->coachingCentre->state->name .' , '.$booking->batch->coachingCentre->pincode }}
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
                                <label>Coaching Centre logo</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        <img src="{{ generate_url($booking->batch->coachingCentre->logo) }}" alt="sports logo"
                                            width="150" height="120">
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div id="map" style="height: 300px;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br><br>
        </div>
    </div>
@endsection
@push('extra-js')
<script
src="https://maps.googleapis.com/maps/api/js?sensor=true&key={{ config('utility.MAP_KEY') }}&libraries=geometry,places">
</script>
<script>
     $(document).ready(function(e) {
            var latlng = new google.maps.LatLng('{{ $booking->batch->coachingCentre->lat }}',
                '{{ $booking->batch->coachingCentre->long }}');
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
    var userIndexRoute = "{{ route('admin.batches.index') }}";
</script>
@endpush
