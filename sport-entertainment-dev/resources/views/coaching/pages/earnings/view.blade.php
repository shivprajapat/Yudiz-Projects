@extends('coaching.layouts.app')
@push('breadcrumb')
    {!! Breadcrumbs::render('coaching_earning_view') !!}
@endpush

@push('extra-css')
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/plugins/custom/datatables/datatables.bundle.css') }}" />
@endpush

@section('content')
    <div class="container">
        <div class="card card-custom">
            <div class="card-body">
                <h4 class="m-3">Earning Details</h4>
                <div class="d-flex flex-wrap">

                    <div class="col-lg-3 col-md-4">
                        <a>
                            <div class="card card-custom rounded-xl gutter-b bg-dark  card-stretch">
                                <div class="align-items-center mr-2">
                                    <div class="align-items-center px-6 pt-7">
                                        <div class=" symbol-label text-center">

                                            <div class="font-size-h3 fas fa-hand-holding-usd text-muted font-weight-bolder">
                                                Pending amount </div>
                                        </div>
                                    </div>
                                    <div class="symbol-label px-6 py-6 rounded-xl text-center">
                                        <div class="display-4  text-white font-weight-bolder">2000 INR</div>
                                        <span class="font-size-lg text-muted">Amount to be collected from an Admin</span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>

                    <div class="col-lg-3 col-md-4">
                        <a>
                            <div class="card card-custom rounded-xl gutter-b bg-dark  card-stretch">
                                <div class="align-items-center mr-2">
                                    <div class="align-items-center px-6 pt-7">
                                        <div class=" symbol-label text-center">
                                            <div class="font-size-h3 fas fa-hand-holding-usd text-muted font-weight-bolder">
                                                Total Earnings</div>
                                        </div>
                                    </div>
                                    <div class="symbol-label px-6 py-6 rounded-xl text-center">
                                        <div class="display-4 text-white font-weight-bolder">3000 INR
                                        </div>
                                        <span class="font-size-lg text-muted">Total amount earned</span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="" style="margin-bottom: 20px">
                    <h2>Trasaction Overview</h2>

                    <div class="row">
                        <div class="col-md-4">
                            <select name="earning_filter" id="earning_filter" class="form-control ">
                                <option value="today">Today </option>
                                <option value="this_month">This Month </option>
                                <option value="last_6_month">Last 6 months </option>
                                <option value="this_year">This Year </option>
                                <option value="custom_date">Custom Date </option>
                            </select>
                        </div>

                        <div style="display:noneds" id="custom_date_range" class="col-md-3">
                            <input type="text" name="start_date" class="form-control">
                            <input type="text" name="end_date" class="form-control ">
                        </div>
                    </div>

                </div>
                <table class="table table-bordered table-hover table-checkable" id="earning_tbl"
                    style="margin-top: 13px !important"></table>
            </div>
        </div>
    </div>
@endsection
@push('extra-js')
    <script src="{{ asset('assets/plugins/custom/datatables/datatables.bundle.js') }}"></script>
    <script>
        var table = $('#earning_tbl');
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
                    "data": "transaction_id",
                    "title": "Transaction Id",
                },
                {
                    "data": "transaction_date",
                    "title": "Date"
                },
                {
                    "data": "payment_transfer_status",
                    "title": "Status",
                },
                {
                    "data": "total_amount",
                    "title": "Total Amount"
                },
            ],
            responsive: true,
            "order": [
                [1, 'desc']
            ],
            "lengthMenu": [
                [10, 20, 50, 100],
                [10, 20, 50, 100]
            ],
            "searching": true,
            "pageLength": 10,
            "ajax": {
                "url": "{{ route('coaching.earning') }}",
            },
            drawCallback: function(oSettings) {
                $('.status-switch').bootstrapSwitch();
                $('.status-switch').bootstrapSwitch('onColor', 'success');
                $('.status-switch').bootstrapSwitch('offColor', 'danger');
                removeOverlay();
            },
            "dom": "lfrtip"
        });
    </script>
@endpush
