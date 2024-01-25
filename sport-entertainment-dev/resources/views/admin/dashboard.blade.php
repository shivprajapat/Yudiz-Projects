@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('dashboard') !!}
@endpush

@push('extra-css')
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/plugins/custom/datatables/datatables.bundle.css') }}" />
@endpush

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-lg-6">
                <h2>Users Detail</h2>
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-6 mb-lg-0 mb-4">
                        <div class="card card-custom rounded-xl gutter-b bg-dark h-100 px-6 py-8">
                            <div class="symbol-wrapper d-flex align-items-center justify-content-between">
                                <h2 class="font-size-h1 text-white font-weight-bolder mb-0">{{ $data['totalUsers'] ?? 0 }}</h2>
                                <i class="fas fa-users" style="font-size: 39px;margin-top: 7px;"></i>
                            </div>
                            <span class="font-size-h6 text-muted font-weight-bold">Registered Users</span>
                            <span class="font-size-h7 text-muted font-weight-light">Total number of Registered Users</span>
                        </div>
                    </div>
                    <div class="col-lg-6 ">
                        <div class="card card-custom rounded-xl gutter-b bg-dark card-stretch" style="height:100%">
                            <div class="d-flex align-items-center mr-2">
                                <div class="symbol-label px-6 py-8 rounded-xl mr-7">
                                    <span class="svg-icon svg-icon-4x svg-icon-white d-block my-2">
                                        {{-- <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                            width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                <polygon points="0 0 24 0 24 24 0 24"></polygon>
                                                <path
                                                    d="M18,14 C16.3431458,14 15,12.6568542 15,11 C15,9.34314575 16.3431458,8 18,8 C19.6568542,8 21,9.34314575 21,11 C21,12.6568542 19.6568542,14 18,14 Z M9,11 C6.790861,11 5,9.209139 5,7 C5,4.790861 6.790861,3 9,3 C11.209139,3 13,4.790861 13,7 C13,9.209139 11.209139,11 9,11 Z"
                                                    fill="#000000" fill-rule="nonzero" opacity="0.3"></path>
                                                <path
                                                    d="M17.6011961,15.0006174 C21.0077043,15.0378534 23.7891749,16.7601418 23.9984937,20.4 C24.0069246,20.5466056 23.9984937,21 23.4559499,21 L19.6,21 C19.6,18.7490654 18.8562935,16.6718327 17.6011961,15.0006174 Z M0.00065168429,20.1992055 C0.388258525,15.4265159 4.26191235,13 8.98334134,13 C13.7712164,13 17.7048837,15.2931929 17.9979143,20.2 C18.0095879,20.3954741 17.9979143,21 17.2466999,21 C13.541124,21 8.03472472,21 0.727502227,21 C0.476712155,21 -0.0204617505,20.45918 0.00065168429,20.1992055 Z"
                                                    fill="#000000" fill-rule="nonzero"></path>
                                            </g>
                                        </svg> --}}
                                        <i class="fas fa-users" style="font-size: 39px;margin-top: 7px;"></i>
                                    </span>
                                    <span class="font-size-h6 text-muted font-weight-bold">New Registered Users</span>
                                    <div>
                                        <span class="font-size-h7 text-muted font-weight-light">Total number of Registered Users in current Month</span>
                                    </div>
                                </div>
                                <div>
                                    <div class="font-size-h1 text-white font-weight-bolder">{{ $data['currentMonthUsers'] ?? 0 }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <h2>Coaching Details</h2>
                <div class="row">
                    <div class="col-lg-6">
                        <div class="card card-custom rounded-xl gutter-b bg-dark card-stretch">
                            <div class="d-flex align-items-center mr-2">
                                <div class="symbol-label px-6 py-8 rounded-xl mr-7">
                                    <span class="svg-icon svg-icon-4x svg-icon-white d-block my-2">
                                        <i class="fas fa-medal" style="font-size: 39px;margin-top: 7px;"></i>
                                    </span>
                                    <span class="font-size-h6 text-muted font-weight-bold">Registered Coaching Centres</span>
                                    <div>
                                        <span class="font-size-h7 text-muted font-weight-light">Total number of Registered Coaching Centres</span>
                                    </div>
                                </div>
                                <div>
                                    <div class="font-size-h1 text-white font-weight-bolder">{{ $data['totalRegisteredCentres'] ?? 0 }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="card card-custom rounded-xl gutter-b bg-dark card-stretch">
                            <div class="d-flex align-items-center mr-2">
                                <div class="symbol-label px-6 py-8 rounded-xl mr-7">
                                    <span class="svg-icon svg-icon-4x svg-icon-white d-block my-2">
                                        <i class="fas fa-medal" style="font-size: 39px;margin-top: 7px;"></i>
                                    </span>
                                    <span class="font-size-h6 text-muted font-weight-bold">New Registered Coaching Centres</span>
                                    <div>
                                        <span class="font-size-h7 text-muted font-weight-light">Total number of Coaching Centres in current Month</span>
                                    </div>
                                </div>
                                <div>
                                    <div class="font-size-h1 text-white font-weight-bolder">{{ $data['currentMonthRegisteredCentres'] ?? 0 }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3">
                <h2>Active Batches</h2>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="card card-custom rounded-xl gutter-b bg-dark card-stretch" style="height:110%">
                            <div class="d-flex align-items-center mr-2">
                                <div class="symbol-label px-6 py-8 rounded-xl mr-7">
                                    <span class="svg-icon svg-icon-4x svg-icon-white d-block my-2">
                                        <i class="fa fa-tasks" style="font-size: 39px;margin-top: 7px;"></i>
                                    </span>
                                    <span class="font-size-h6 text-muted font-weight-bold">Active Batches</span>
                                    <div>
                                        <span class="font-size-h7 text-muted font-weight-light">Total number of Active Batches</span>
                                    </div>
                                </div>
                                <div>
                                    <div class="font-size-h1 text-white font-weight-bolder">{{ $data['totalActiveBatches'] ?? 0 }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-9">
                <h2>Booking Details</h2>
                <div class="row">
                      <div class="col-lg-4">
                        <div class="card card-custom rounded-xl gutter-b bg-dark card-stretch">
                            <div class="d-flex align-items-center mr-2">
                                <div class="symbol-label px-6 py-8 rounded-xl mr-7">
                                    <span class="svg-icon svg-icon-4x svg-icon-white d-block my-2">
                                        <i class="fas fa-calendar-alt" style="font-size: 39px;margin-top: 7px;"></i>
                                    </span>
                                    <span class="font-size-h6 text-muted font-weight-bold">Bookings Received</span>
                                    <div>
                                        <span class="font-size-h7 text-muted font-weight-light">Total number of Bookings Received</span>
                                    </div>
                                </div>
                                <div>
                                    <div class="font-size-h1 text-white font-weight-bolder">{{ $data['totalBooking'] ?? 0 }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="card card-custom rounded-xl gutter-b bg-dark card-stretch">
                            <div class="d-flex align-items-center mr-2">
                                <div class="symbol-label px-6 py-8 rounded-xl mr-7">
                                    <span class="svg-icon svg-icon-4x svg-icon-white d-block my-2">
                                        <i class="fas fa-calendar-alt" style="font-size: 39px;margin-top: 7px;"></i>
                                    </span>
                                    <span class="font-size-h6 text-muted font-weight-bold">Bookings Received in Current Month
                                    </span>
                                    <div>
                                        <span class="font-size-h7 text-muted font-weight-light">Total number of Bookings Received in current Month</span>
                                    </div>
                                </div>
                                <div>
                                    <div class="font-size-h1 text-white font-weight-bolder">{{ $data['currentMonthBooking'] ?? 0 }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <div class="card card-custom rounded-xl gutter-b bg-dark card-stretch">
                            <div class="d-flex align-items-center mr-2">
                                <div class="symbol-label px-6 py-8 rounded-xl mr-7">
                                    <span class="svg-icon svg-icon-4x svg-icon-white d-block my-2">
                                        <i class="fas fa-calendar-alt" style="font-size: 39px;margin-top: 7px;"></i>
                                    </span>
                                    <span class="font-size-h6 text-muted font-weight-bold">Booking Received Today</span>
                                    <div>
                                        <span class="font-size-h7 text-muted font-weight-light">Total number of Bookings Received Today</span>
                                    </div>
                                </div>
                                <div>
                                    <div class="font-size-h1 text-white font-weight-bolder">{{ $data['todayBooking'] ?? 0 }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <h2>Earnings</h2>
                <div class="row">
                    <div class="col-lg-6">
                        <div class="card card-custom rounded-xl gutter-b bg-dark card-stretch">
                            <div class="d-flex align-items-center mr-2">
                                <div class="symbol-label px-6 py-8 rounded-xl mr-7">
                                    <span class="svg-icon svg-icon-4x svg-icon-white d-block my-2">
                                        <i class="fas fa-rupee-sign" style="font-size: 39px;margin-top: 7px;"></i>
                                    </span>
                                    <span class="font-size-h6 text-muted font-weight-bold">Earnings</span>
                                    <div>
                                        <span class="font-size-h7 text-muted font-weight-light">Total Earning</span>
                                    </div>
                                </div>
                                <div>
                                    <div class="font-size-h1 text-white font-weight-bolder">{{ $data['totalEarnings'] ?? 0 }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="card card-custom rounded-xl gutter-b bg-dark card-stretch">
                            <div class="d-flex align-items-center mr-2">
                                <div class="symbol-label px-6 py-8 rounded-xl mr-7">
                                    <span class="svg-icon svg-icon-4x svg-icon-white d-block my-2">
                                        <i class="fas fa-rupee-sign" style="font-size: 39px;margin-top: 7px;"></i>
                                    </span>
                                    <span class="font-size-h6 text-muted font-weight-bold">Earnings of the Current Month</span>
                                    <div>
                                        <span class="font-size-h7 text-muted font-weight-light">Total Earnings of the current Month</span>
                                    </div>
                                </div>
                                <div>
                                    <div class="font-size-h1 text-white font-weight-bolder">{{ $data['currentMonthEarnings'] ?? 0 }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-8">
                <div class="card card-custom gutter-b card-stretch">
                    <div class="card-header h-auto border-0">
                        <div class="card-title col-md-3 py-5">
                            <h3 class="card-label text-nowrap">Register Users<br>
                                <small>Horizontal</small>
                            </h3>
                            <span class="switch switch-outline switch-icon switch-primary">
                                <label>
                                    <input type="checkbox" id="horizontalSwitch" name="horizontal" />
                                    <span></span>
                                </label>
                            </span>
                        </div>
                        <div class="card-title col-md-4 pr-2 register-user-date" style="display:none;">
                            <input type="text" class="form-control pr-2" name="registercustomdates">
                        </div>
                        <div class="card-toolbar">
                            <select class="form-control" id="registerUserChart">
                                <option value="week" selected>This Week</option>
                                <option value="month">This Month</option>
                                <option value="3 month">3 Months</option>
                                <option value="6 month">6 Months</option>
                                <option value="year">This Year</option>
                                <option value="overall">Overall</option>
                                <option value="custom">Custom Range</option>
                            </select>
                        </div>
                    </div>

                    <div class="card-body position-relative">
                        <div id="register-user-chart"></div>
                    </div>
                </div>
            </div>

            <div class="col-lg-4">
                <div class="card card-custom gutter-b card-stretch">
                    <div class="card-header h-auto border-0">
                        <div class="card-title py-5">
                            <div class="card-label">Active - Deactive Users</div>
                        </div>
                    </div>
                    <div class="card-body d-flex flex-column position-relative">
                        <div id="user-active-pie-chart"></div>
                        <div class="mt-5">
                            <div class="row row-paddingless mt-5">
                                <div class="col">
                                    <div class="d-flex align-items-center mr-2">
                                        <div class="symbol symbol-45 symbol-light-success mr-4 flex-shrink-0">
                                            <div class="symbol-label">
                                                <span class="svg-icon svg-icon-lg svg-icon-success">
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                                                        height="24px" viewBox="0 0 24 24" version="1.1">
                                                        <g stroke="none" stroke-width="1" fill="none"
                                                            fill-rule="evenodd">
                                                            <polygon points="0 0 24 0 24 24 0 24"></polygon>
                                                            <path
                                                                d="M18,14 C16.3431458,14 15,12.6568542 15,11 C15,9.34314575 16.3431458,8 18,8 C19.6568542,8 21,9.34314575 21,11 C21,12.6568542 19.6568542,14 18,14 Z M9,11 C6.790861,11 5,9.209139 5,7 C5,4.790861 6.790861,3 9,3 C11.209139,3 13,4.790861 13,7 C13,9.209139 11.209139,11 9,11 Z"
                                                                fill="#000000" fill-rule="nonzero" opacity="0.3"></path>
                                                            <path
                                                                d="M17.6011961,15.0006174 C21.0077043,15.0378534 23.7891749,16.7601418 23.9984937,20.4 C24.0069246,20.5466056 23.9984937,21 23.4559499,21 L19.6,21 C19.6,18.7490654 18.8562935,16.6718327 17.6011961,15.0006174 Z M0.00065168429,20.1992055 C0.388258525,15.4265159 4.26191235,13 8.98334134,13 C13.7712164,13 17.7048837,15.2931929 17.9979143,20.2 C18.0095879,20.3954741 17.9979143,21 17.2466999,21 C13.541124,21 8.03472472,21 0.727502227,21 C0.476712155,21 -0.0204617505,20.45918 0.00065168429,20.1992055 Z"
                                                                fill="#000000" fill-rule="nonzero"></path>
                                                        </g>
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="font-size-h4 text-dark-75 font-weight-bolder"
                                                id="active_user_count">0</div>
                                            <div class="font-size-sm text-muted font-weight-bold mt-1">Active Users</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row row-paddingless mt-5">
                                <div class="col">
                                    <div class="d-flex align-items-center mr-2">
                                        <div class="symbol symbol-45 symbol-light-danger mr-4 flex-shrink-0">
                                            <div class="symbol-label">
                                                <span class="svg-icon svg-icon-lg svg-icon-danger">
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                                                        height="24px" viewBox="0 0 24 24" version="1.1">
                                                        <g stroke="none" stroke-width="1" fill="none"
                                                            fill-rule="evenodd">
                                                            <polygon points="0 0 24 0 24 24 0 24"></polygon>
                                                            <path
                                                                d="M18,14 C16.3431458,14 15,12.6568542 15,11 C15,9.34314575 16.3431458,8 18,8 C19.6568542,8 21,9.34314575 21,11 C21,12.6568542 19.6568542,14 18,14 Z M9,11 C6.790861,11 5,9.209139 5,7 C5,4.790861 6.790861,3 9,3 C11.209139,3 13,4.790861 13,7 C13,9.209139 11.209139,11 9,11 Z"
                                                                fill="#000000" fill-rule="nonzero" opacity="0.3"></path>
                                                            <path
                                                                d="M17.6011961,15.0006174 C21.0077043,15.0378534 23.7891749,16.7601418 23.9984937,20.4 C24.0069246,20.5466056 23.9984937,21 23.4559499,21 L19.6,21 C19.6,18.7490654 18.8562935,16.6718327 17.6011961,15.0006174 Z M0.00065168429,20.1992055 C0.388258525,15.4265159 4.26191235,13 8.98334134,13 C13.7712164,13 17.7048837,15.2931929 17.9979143,20.2 C18.0095879,20.3954741 17.9979143,21 17.2466999,21 C13.541124,21 8.03472472,21 0.727502227,21 C0.476712155,21 -0.0204617505,20.45918 0.00065168429,20.1992055 Z"
                                                                fill="#000000" fill-rule="nonzero"></path>
                                                        </g>
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="font-size-h4 text-dark-75 font-weight-bolder"
                                                id="deactive_user_count">0</div>
                                            <div class="font-size-sm text-muted font-weight-bold mt-1">Deactive Users</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {{-- local --}}

        @if (!env('APP_ENV') == 'local')
            <div class="row">
                <div class="col-lg-12">
                    <div class="card card-custom gutter-b">
                        <div class="card-header flex-wrap border-0 py-5">
                            <div class="card-title">
                                <h3 class="card-label">User Exceptions</h3>
                            </div>
                        </div>

                        <div class="card-body">
                            <div class="row">
                                <div class="col-sm-12">
                                    <table
                                        class="table table-separate table-head-custom table-checkable dataTable no-footer dtr-inline"
                                        id="error_DT"></table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        @endif
    </div>
@endsection

@push('extra-js')
    <script src="{{ asset('assets/admin/plugins/chart/userchart.js') }}"></script>
    <script type="text/javascript">
        $(function() {
            $('#registerUserChart').select2();

            var table = $('#error_DT');
            oTable = table.dataTable({
                "processing": true,
                "serverSide": true,
                "language": {
                    "lengthMenu": "_MENU_ entries",
                    "paginate": {
                        "previous": '<i class="fa fa-angle-left" ></i>',
                        "next": '<i class="fa fa-angle-right" ></i>'
                    }
                },
                "columns": [{
                    "title": "Id",
                    "data": "id",
                    "visible": false
                }, {
                    "title": "User Name",
                    "data": "first_name",
                    "render": $.fn.dataTable.render.text(),
                }, {
                    "title": "Email",
                    "data": "email",
                    "visible": true
                }, {
                    "title": "Last Request On",
                    "data": "updated_at",
                }, {
                    "title": "Url",
                    "data": "url",
                }, {
                    "title": "Request count",
                    "data": "count",
                }, {
                    "title": "Message",
                    "data": "exception",
                }, {
                    "title": "IP Address",
                    "data": "ip_address",
                }, {
                    "title": "Guard",
                    "data": "guard",
                }],
                "responsive": true,
                "lengthMenu": [
                    [10, 20, 50, 100],
                    [10, 20, 50, 100]
                ],
                "pageLength": 10,
                "ajax": {
                    "data": {},
                    "url": "{{ route('admin.error.listing') }}", // ajax source
                },
                drawCallback: function(oSettings) {
                    $('.status-switch').bootstrapSwitch();
                    $('.status-switch').bootstrapSwitch('onColor', 'success');
                    $('.status-switch').bootstrapSwitch('offColor', 'danger');
                },
                // "dom": "lrtip",
                "dom": "<'row' <'col-md-12'>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
            });
        });
    </script>
@endpush
