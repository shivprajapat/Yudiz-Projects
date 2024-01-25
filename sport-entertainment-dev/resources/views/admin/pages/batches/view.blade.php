@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('batches_view', $batch->id) !!}
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
                    @if (in_array('delete', $permissions))
                        <a data-target-href="{{ route('admin.batches.destroy', $batch->id) }}" name="del_select"
                            id="top_delete" class="btn btn-md btn-light-danger font-weight-bolder text-uppercase mr-2"
                            style="width:100px">
                            Delete
                        </a>
                    @endif
                    @if (in_array('edit', $permissions))
                        <a href="{{ route('admin.batches.edit', $batch->id) }}"
                            class="btn btn-md btn-primary font-weight-bolder text-uppercase" style="width:100px">
                            Edit
                        </a>
                    @endif
                </div>
            </div>
            <div class="card-header">
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
                                        @if ($batch->CoachingCentre->coaching_name)
                                            {{ $batch->CoachingCentre->coaching_name }}
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
                                        @if ($batch->CoachingCentre->address_line1 || $batch->CoachingCentre->address_line1)
                                            {{ $batch->CoachingCentre->address_line1 }} <br>
                                            {{ $batch->CoachingCentre->address_line2 }}<br>
                                            {{ $batch->CoachingCentre->city->name . ' , ' . $batch->CoachingCentre->state->name . ' , ' . $batch->CoachingCentre->pincode }}
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
                                        <img src="{{ generate_url($batch->CoachingCentre->logo) }}" alt="sports logo"
                                            width="150" height="120">
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div id="map" style="height: 300px;">
                            </div>
                        </div>
                    </div>
                </div>

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
                                        @if ($batch->name)
                                            {{ $batch->name }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div>
                                <label>Start Date | End Date </label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($batch->start_date || $batch->end_date)
                                            {{ $batch->start_date . ' | ' . $batch->end_date }}
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
                                        @if ($batch->sport->name)
                                            {{ $batch->sport->name }}
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
                                <label>Age Group</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($batch->ageGroup->age_name)
                                            {{ $batch->ageGroup->age_name }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div>
                                <label>Batch Size </label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($batch->batch_size)
                                            {{ $batch->batch_size }}
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
                                        @if ($batch->session_days)
                                            {{ $batch->session_days }}
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
                                        @if ($batch->start_time || $batch->end_time)
                                            {{ $batch->start_time . ' To ' . $batch->end_time }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div>
                                <label>Number of sessions</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($batch->number_of_session)
                                            {{ $batch->number_of_session }}
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
                                        @if ($batch->price)
                                            {{ $batch->price . ' INR' }}
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
                                <label>Live Status</label>
                            </div>
                            @php
                                use App\Enums\BatchStatus;
                            @endphp
                            <div>
                                <label>
                                    <h5>
                                        @if ($batch->live_status == BatchStatus::LIVE->value)
                                            ON
                                        @else
                                            OFF
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div>
                                <label>Completion status </label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($batch->completion_status)
                                            {{ $batch->completion_status }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div>
                                <label>Session Brief </label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($batch->brief_details)
                                            {{ $batch->brief_details }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
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
            var latlng = new google.maps.LatLng('{{ $batch->CoachingCentre->lat }}',
                '{{ $batch->CoachingCentre->long }}');
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
