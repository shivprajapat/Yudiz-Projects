@extends('coaching.layouts.app')
@push('breadcrumb')
    {!! Breadcrumbs::render('dashboard_coaching') !!}
@endpush
@push('extra-css')
@endpush
@section('content')
    <div class="container">
        <div class="card">
            <div class="card-body">
                <h4 class="m-3"> {{ __('BOOKING_DETAIL') }} </h4>
                <div class="d-flex flex-wrap">
                    <div class="col-xl-3 col-lg-4 col-md-4 col-sm-6">
                        <a href="">
                            <div class="card card-custom rounded-xl gutter-b bg-dark  card-stretch">
                                <div class="align-items-center mr-2">
                                    <div class="align-items-center px-6 pt-7">
                                        <div class=" symbol-label text-center">
                                            <div class="display-4 text-muted font-weight-bolder">{{ $total_booking ?? 0 }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="symbol-label px-6 py-6 rounded-xl text-center">
                                        <div class="font-size-h3 text-white font-weight-bolder">
                                            {{ __('BOOKING_RECIEVED') }} </div>
                                        <span class="font-size-lg text-muted  ">{{ __('TOTAL_NO_BOOKING_RECIEVED') }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>

                    <div class="col-xl-3 col-lg-4 col-md-4 col-sm-6">
                        <a href="">
                            <div class="card card-custom rounded-xl gutter-b bg-dark  card-stretch">
                                <div class="align-items-center mr-2">
                                    <div class="align-items-center px-6 pt-7">
                                        <div class=" symbol-label text-center">
                                            <div class="display-4 text-muted font-weight-bolder">
                                                {{ $current_month_booking ?? 0 }}</div>
                                        </div>
                                    </div>
                                    <div class="symbol-label px-6 py-6 rounded-xl text-center">
                                        <div class="font-size-h3 text-white font-weight-bolder">
                                            {{ __('BOOKING_RECIEVE_CURRENT_MONTH') }}
                                        </div>
                                        <span class="font-size-lg text-muted  ">
                                            {{ __('TOTAL_BOOKING_RECIEVED_CURRENT_MONTH') }} </span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>

                    <div class="col-xl-3 col-lg-4 col-md-4 col-sm-6">
                        <a href="">
                            <div class="card card-custom rounded-xl gutter-b bg-dark  card-stretch">
                                <div class="align-items-center mr-2">
                                    <div class="align-items-center px-6 pt-7">
                                        <div class=" symbol-label text-center">
                                            <div class="display-4 text-muted font-weight-bolder">{{ $today_booking ?? 0 }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="symbol-label px-6 py-6 rounded-xl text-center">
                                        <div class="font-size-h3 text-white font-weight-bolder">
                                            {{ __('BOOKING_RECIEVED_TODAY') }} </div>
                                        <span class="font-size-lg text-muted  ">{{ __('TOTAL_NO_BOOKING_TODAY') }} </span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>

                </div>

                <div class="d-flex flex-wrap">
                    <div class="col-xl-3 col-lg-4 col-md-4 col-sm-6">
                        <h4> {{ __('ACTIVE_BATCHES') }} </h4>
                        <a href="">
                            <div class="card card-custom rounded-xl gutter-b bg-dark  card-stretch">
                                <div class="align-items-center mr-2">
                                    <div class="align-items-center px-6 pt-7">
                                        <div class=" symbol-label text-center">
                                            <div class="display-4 text-muted font-weight-bolder">{{ $active_batches ?? 0 }}</div>
                                        </div>
                                    </div>
                                    <div class="symbol-label px-6 py-6 rounded-xl text-center">
                                        <div class="font-size-h3 text-white font-weight-bolder"> {{ __('ACTIVE_BATCHES') }}
                                        </div>
                                        <span class="font-size-lg text-muted  "> {{ __('NO_OF_ACTIVE_BATCHES') }} </span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div class="col-xl-3 col-lg-4 col-md-4 col-sm-6">
                        <h4>{{ __('RATING_REVIEW') }}</h4>
                        <a href="">
                            <div class="card card-custom rounded-xl gutter-b bg-dark  card-stretch">
                                <div class="align-items-center mr-2">
                                    <div class="align-items-center px-6 pt-7">
                                        <div class=" symbol-label text-center">
                                            <div class="display-4 text-muted font-weight-bolder">{{ $archived ?? 0 }}</div>
                                        </div>
                                    </div>
                                    <div class="symbol-label px-6 py-6 rounded-xl text-center">
                                        <div class="font-size-h3 text-white font-weight-bolder">
                                            {{ __('REVIEWS_RATINGS') }}
                                        </div>
                                        <span class="font-size-lg text-muted  "> {{ __('AVG_RATING_TOTAL_REVIEW') }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>

                <h4 class="m-3"> {{ __('EARNING') }} </h4>
                <div class="d-flex flex-wrap">
                    <div class="col-xl-3 col-lg-4 col-md-4 col-sm-6">
                        <a href="">
                            <div class="card card-custom rounded-xl gutter-b bg-dark  card-stretch">
                                <div class="align-items-center mr-2">
                                    <div class="align-items-center px-6 pt-7">
                                        <div class=" symbol-label text-center">
                                            <div class="display-4 text-muted font-weight-bolder">{{ $archived ?? 0 }}</div>
                                        </div>
                                    </div>
                                    <div class="symbol-label px-6 py-6 rounded-xl text-center">
                                        <div class="font-size-h3 text-white font-weight-bolder"> {{ __('EARNING') }} </div>
                                        <span class="font-size-lg text-muted"> {{ __('TOTAL_EARNING') }} </span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div class="col-xl-3 col-lg-4 col-md-4 col-sm-6">
                        <a href="">
                            <div class="card card-custom rounded-xl gutter-b bg-dark  card-stretch">
                                <div class="align-items-center mr-2">
                                    <div class="align-items-center px-6 pt-7">
                                        <div class=" symbol-label text-center">
                                            <div class="display-4 text-muted font-weight-bolder">{{ $archived ?? 0 }}</div>
                                        </div>
                                    </div>
                                    <div class="symbol-label px-6 py-6 rounded-xl text-center">
                                        <div class="font-size-h3 text-white font-weight-bolder">
                                            {{ __('EARNING_OF_CURRENT_MONTH') }}
                                        </div>
                                        <span class="font-size-lg text-muted  "> {{ __('TOTAL_EARNING_CURRENT_MONTH') }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
@push('extra-js')
@endpush
