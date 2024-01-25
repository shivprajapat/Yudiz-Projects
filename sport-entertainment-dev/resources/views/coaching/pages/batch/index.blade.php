@extends('coaching.layouts.app')
@push('breadcrumb')
    {!! Breadcrumbs::render('coaching_batch_list') !!}
@endpush

@push('extra-css')
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/plugins/custom/datatables/datatables.bundle.css') }}" />
    <style>
        .isDisabled {
            color: currentColor;
            cursor: not-allowed;
            opacity: 0.5;
            text-decoration: none;
            pointer-events: none;
        }
    </style>
@endpush

@section('content')
    <div class="container">

        <div class="card card-custom">
            <div class="card-header">
                <div class="card-title">
                    <span class="card-icon">
                        <i class="fas fa-futbol text-primary"></i>
                    </span>
                    <h3 class="card-label">{{ $custom_title }}</h3>
                </div>
                <div class="card-toolbar">
                    <a href="{{ route('coaching.batch.create') }}"
                        class="btn btn-sm btn-primary font-weight-bolder text-uppercase">
                        <i class="fas fa-plus"></i>
                        Add Batch
                    </a>

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
                    "data": "name",
                    "title": "Batch Name"
                },
                {
                    "title": "Start Date | End Date",
                    "data": "start_date_end_date",
                },
                {
                    "data": "sport_name",
                    "title": "Sport Name"
                },
                {
                    "data": "age_group",
                    "title": "Age Group"
                },
                {
                    "data": "batch_size",
                    "title": "Batch Size"
                },
                {
                    "data": "price",
                    "title": "Price"
                },
                {
                    "data": "live_status",
                    "title": "Live Status"
                },
                {
                    "data": "action",
                    "title": "Action"
                },
            ],
            "columnDefs": [{
                    "targets": 2,
                    "orderable": false
                },
                {
                    "targets": 3,
                    "orderable": false
                },
                {
                    "targets": 4,
                    "orderable": false
                },
                {
                    "targets": -2,
                    "orderable": false
                },
                {
                    "targets": -1,
                    "orderable": false
                }
            ],
            responsive: true,
            "order": [
                [1, 'desc'],
            ],
            "lengthMenu": [
                [10, 20, 50, 100],
                [10, 20, 50, 100]
            ],
            "searching": true,
            "pageLength": 10,
            "ajax": {
                "url": "{{ route('coaching.batch.index') }}",
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
