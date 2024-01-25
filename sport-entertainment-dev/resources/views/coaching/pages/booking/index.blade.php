@extends('coaching.layouts.app')
@push('breadcrumb')
    {!! Breadcrumbs::render('coaching_booking_list') !!}
@endpush

@push('extra-css')
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/plugins/custom/datatables/datatables.bundle.css') }}" />
@endpush

@section('content')
    <div class="container">

        <div class="card card-custom">
            <div class="card-header">
                <div class="card-title">
                    <span class="card-icon">
                        <i class="fas fa-users text-primary"></i>
                    </span>
                    <h3 class="card-label">{{ $custom_title }}</h3>
                </div>
                <div class="card-toolbar">
                    {{-- <a href="{{ route('coaching.batch.create') }}"
                        class="btn btn-sm btn-primary font-weight-bolder text-uppercase">
                        <i class="fas fa-plus"></i>
                        Add Batch
                    </a> --}}
                </div>
            </div>
            <div class="card-body">
                {{--  Datatable Start  --}}
                <table class="table table-bordered table-hover table-checkable" id="sports_table"
                    style="margin-top: 13px !important"></table>
                {{--  Datatable End  --}}
            </div>
        </div>
    </div>
@endsection
@push('extra-js')
    <script src="{{ asset('assets/plugins/custom/datatables/datatables.bundle.js') }}"></script>
    <script>
        var table = $('#sports_table');
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
                    "data": "no",
                    "title": "No",
                },
                {
                    "data": "id",
                    "title": "Booking Id"
                },
                {
                    "data": "booking_date_time",
                    "title": "Booking Date & Time",
                },
                {
                    "data": "end_user_name",
                    "title": "End user Name"
                },
                {
                    "data": "no_of_participants",
                    "title": "No. of Other Participants"
                },
                {
                    "data": "batch_name",
                    "title": "Batch Name"
                },
                {
                    "data": "sport_name",
                    "title": "Sport Name"
                },
                {
                    "data": "total_price",
                    "title": "Total Price"
                },
                {
                    "data": "action",
                    "title": "Action"
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
                "url": "{{ route('coaching.booking.index') }}",
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
