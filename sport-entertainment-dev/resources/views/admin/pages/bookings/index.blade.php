@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('batches_list') !!}
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
                    @if (in_array('delete', $permissions))
                        <a href="{{ route('admin.batches.destroy', 0) }}" name="del_select" id="del_select"
                            class="btn btn-sm btn-light-danger font-weight-bolder text-uppercase mr-2 delete_all_link">
                            <i class="far fa-trash-alt"></i> Delete Selected
                        </a>
                    @endif
                    @if (in_array('add', $permissions))
                        <a href="{{ route('admin.batches.create') }}"
                            class="btn btn-sm btn-primary font-weight-bolder text-uppercase">
                            <i class="fas fa-plus"></i>
                            Add {{ $custom_title }}
                        </a>
                    @endif
                </div>
            </div>
            <div class="card-body">
                {{--  Datatable Start  --}}
                <table class="table table-bordered table-hover table-checkable" id="coaching_centre_table"
                    style="margin-top: 13px !important"></table>
                {{--  Datatable End  --}}
            </div>
        </div>
    </div>
@endsection

@push('extra-js')
    <script src="{{ asset('assets/plugins/custom/datatables/datatables.bundle.js') }}"></script>
    <script>
        var table = $('#coaching_centre_table');
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
                    "data": "updated_at",
                    "title": "Updated At",
                    visible: false
                },
                @if (in_array('delete', $permissions))
                    {
                        "data": "checkbox",
                        "title": "<center><input type='checkbox' class='all_select'></center>",
                        orderable: false
                    },
                @endif
                {
                    "data": "sr_no",
                    "title": "Sr.No."
                },
                 {
                    "data": "booking_id",
                    "title": "Booking ID"
                },
                {
                    "data": "booking_date",
                    "title": "Booking Date & Time"
                },
                {
                    "data": "end_user_name",
                    "title": "End User Name"
                },
                {
                    "data": "no_of_participants",
                    "title": "No. of Other Participants",
                },
                {
                    "data": "coaching_name",
                    "title": "Coaching Centre Name",
                },
                {
                    "data": "batch_name",
                    "title": "Batch Name",
                },
                {
                    "data": "total_price",
                    "title": "Total Price",
                },
                @if (in_array('edit', $permissions))
                    {
                        "data": "active",
                        "title": "Active",
                        sortable: false
                    },
                @endif
                @if (in_array('delete', $permissions) || in_array('view', $permissions))
                    {
                        "data": "action",
                        "title": "Action",
                        searchble: false,
                        sortable: false
                    }
                @endif
            ],
            responsive: true,
            "order": [
                [0, 'desc']
            ],
            "lengthMenu": [
                [10, 20, 50, 100],
                [10, 20, 50, 100]
            ],
            "searching": true,
            "pageLength": 10,
            "ajax": {
                "url": "{{ route('admin.bookings.listing') }}", // ajax source
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
