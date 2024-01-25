@extends('coaching.layouts.app')
@push('breadcrumb')
    {!! Breadcrumbs::render('coaching_batch_view', $batch->id) !!}
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
                        Batch Details
                    </span>
                    <h3 class="card-label"></h3>
                </div>
                <div class="card-toolbar">
                    <a href="{{ route('coaching.batch.edit', ['batch' => $batch->id]) }}"
                        class="btn btn-sm btn-primary font-weight-bolder text-uppercase">
                        <i class="la la-edit"></i>
                        Edit Batch
                    </a>
                </div>
            </div>
            <div class="card-body">
                <div class="form-group row">
                    <div class="col-md-4">
                        <label for="name"> Batch Name: </label>
                        <p class="view_detail">
                            {{ $batch->name }}
                        </p>
                    </div>

                    <div class="col-md-4">
                        <label for="start_date">Start Date | End Date</label>
                        <p class="view_detail">
                            {{ $batch->start_date }} | {{ $batch->end_date }}
                        </p>
                    </div>
                </div>
                <div class="form-group row">
                    <div class="col-md-4">
                        <label for="name"> Sport Name: </label>
                        <p class="view_detail">
                            {{ $batch->sport ? $batch->sport->name : '' }}
                        </p>
                    </div>

                    <div class="col-md-4">
                        <label for="start_date">Age Group</label>
                        <p class="view_detail">
                            {{ $batch->ageGroup ? $batch->ageGroup->age_name : '' }}
                        </p>
                    </div>

                    <div class="col-md-4">
                        <label for="start_date">Batch Size</label>
                        <p class="view_detail">
                            {{ $batch->batch_size }}
                        </p>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="col-md-4">
                        <label for="name"> Session Days </label>
                        <p class="view_detail">
                            {{ $batch->session_days }}
                        </p>
                    </div>

                    <div class="col-md-4">
                        <label for="start_date">Session Timing</label>
                        <p class="view_detail">
                            {{ $batch->start_time . ' To ' . $batch->end_time }}
                        </p>
                    </div>

                    <div class="col-md-4">
                        <label for="start_date">No of Sessions</label>
                        <p class="view_detail">
                            {{ $batch->number_of_session }}
                        </p>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="col-md-4">
                        <label for="name"> Price </label>
                        <p class="view_detail">
                            {{ $batch->price }}
                        </p>
                    </div>

                    <div class="col-md-4">
                        <label for="start_date">Actual Price</label>
                        <p class="view_detail">
                            {{ $batch->actual_price }}
                        </p>
                    </div>

                    <div class="col-md-4">
                        <label for="start_date"> Sessions Brief</label>
                        <p class="view_detail">
                            {{ $batch->brief_details }}
                        </p>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="col-md-4">
                        <label for="name"> Live Status </label>
                        <p class="view_detail">
                            {{ $batch->live_status == '1' ? 'On' : 'Off' }}
                        </p>
                    </div>

                    <div class="col-md-4">
                        <label for=""> Completion status </label>
                        <p class="view_detail">
                            {{ $batch->completion_status == 1 ?  "Completed" : "On-Going" }}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </div>
@endsection
