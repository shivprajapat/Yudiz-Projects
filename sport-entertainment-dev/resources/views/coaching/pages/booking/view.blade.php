@extends('coaching.layouts.app')
@push('breadcrumb')
    {!! Breadcrumbs::render('coaching_booking_view', $booking->id) !!}
@endpush
@push('extra-css')
    <style>
        p.view_detail {
            font-weight: 600;
            font-size: 20px;
        }

        label {
            font-size: 15px !important;
        }
    </style>
@endpush
@section('content')
    <div class="container">
        <div class="card card-custom">
            <div class="card-header">
                <div class="card-title">
                    <span class="card-icon">
                        Booking Details
                    </span>
                    <h3 class="card-label"></h3>
                </div>
                {{-- <div class="card-toolbar">
                    <a href="{{ route('coaching.batch.edit', ['batch' => $booking->id]) }}"
                        class="btn btn-sm btn-primary font-weight-bolder text-uppercase">
                        <i class="la la-edit"></i>
                        Edit Batch
                    </a>
                </div> --}}
            </div>
            <div class="card-body">
                <div class="form-group row">
                    <div class="col-md-4">
                        <label for="name"> Booking Id: </label>
                        <p class="view_detail">
                            {{ $booking->id }}
                        </p>
                    </div>

                    <div class="col-md-4">
                        <label for="start_date">Booking Date & Time</label>
                        <p class="view_detail">
                            {{ \Carbon\Carbon::parse($booking->booking_date)->format('d/m/Y') }}
                        </p>
                    </div>
                </div>
                <h2 for="" class="underline"> <u> End User’s Details </u> </h2>
                <div class="form-group row">
                    <div class="col-md-4">
                        <label for="name"> Photo </label>
                        {{-- <p class="view_detail">
                            {{ $booking->sport ? $booking->sport->name : '' }}
                        </p> --}}
                    </div>

                    <div class="col-md-4">
                        <label for="start_date">End User Name</label>
                        <p class="view_detail">
                            {{ $booking->user ? $booking->user->first_name . $booking->user->last_name : '' }}
                        </p>
                    </div>

                    <div class="col-md-4">
                        <label for="start_date">User Mobile Number</label>
                        <p class="view_detail">
                            +91 {{ $booking->user ? $booking->user->mobile_number : '' }}

                        </p>
                    </div>
                </div>

                <h2 class="underline" for=""><u> Other Participants Details </u></h2>
                @foreach ($bookingParticipants as $participant)
                <div class="form-group row">
                        @php
                            $participant = $participant->participant ?? $participant->participateAsUser;
                        @endphp
                        <div class="col-md-2">
                            <label for="name"> first name </label>
                            <p class="view_detail">
                                {{ $participant->first_name }}
                            </p>
                        </div>
                        <div class="col-md-2">
                            <label for="start_date">Last Name</label>
                            <p class="view_detail">
                                {{ $participant->last_name }}
                            </p>
                        </div>
                        <div class="col-md-2">
                            <label for="start_date">Gender</label>
                            <p class="view_detail">
                                {{ $participant->gender == '0' ? 'Female' : 'Male' }}
                            </p>
                        </div>
                        <div class="col-md-2">
                            <label for="start_date">Dob</label>
                            <p class="view_detail">
                                {{  \Carbon\Carbon::parse($participant->dob)->format("d/m/Y") }}
                            </p>
                        </div>
                    </div>
                    @endforeach

                <h2 class="underline" for=""> <u> Batch Details</u></h2>
                <div class="form-group row">
                    <div class="col-md-4">
                        <label for="name"> Batch Name </label>
                        <p class="view_detail">
                            {{ $booking->batch ? $booking->batch->name : '' }}
                        </p>
                    </div>

                    <div class="col-md-4">
                        <label for="start_date">Sport Name</label>
                        <p class="view_detail">
                            {{ $booking->batch ? ($booking->batch->sport ? $booking->batch->sport->name : '') : '' }}
                        </p>
                    </div>

                    <div class="col-md-4">
                        <label for="start_date"> Age Group</label>
                        <p class="view_detail">
                            {{ $booking->batch ? ($booking->batch->ageGroup ? $booking->batch->ageGroup->age_name : '') : '' }}
                        </p>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="col-md-4">
                        <label for="name"> Session Timing </label>
                        <p class="view_detail">
                            {{ $booking->batch ? $booking->batch->start_time . ' To ' . $booking->batch->end_time : '' }}
                        </p>
                    </div>

                    <div class="col-md-4">
                        <label for=""> Session Days </label>
                        <p class="view_detail">
                            {{ $booking->batch ? $booking->batch->session_days : '' }}

                        </p>
                    </div>
                    <div class="col-md-4">
                        <label for=""> Total Price </label>
                        <p class="view_detail">
                            {{ $booking->total_price }} INR

                        </p>
                    </div>
                </div>

                <h2 class="underline" for=""> <u> Ratings & Reviews </u> </h2>
                <div class="form-group row">
                    <div class="col-md-4">
                        <label for="name"> Ratings </label>
                        <p class="view_detail">
                            Rating star Here
                        </p>
                    </div>
                    <div class="col-md-6">
                        <label for="name"> Review </label>
                        <p class="view_detail">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio minima deserunt autem,
                            recusandae aliquam laboriosam tenetur.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
