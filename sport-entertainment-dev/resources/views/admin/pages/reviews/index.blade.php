@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('reviews_list') !!}
@endpush

@push('extra-css')
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/plugins/custom/datatables/datatables.bundle.css') }}" />
    <style>
        .custom-border {
            cursor: pointer;
        }
    </style>
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
                <ul class="nav nav-tabs mb-5" role="tablist">
                    <li class="nav-item custom-border">
                        <a class="nav-link tab-change active" data-toggle="tab" id="all_data"
                            data-type="approved">Approved</a>
                    </li>
                    <li class="nav-item custom-border">
                        <a class="nav-link tab-change" data-toggle="tab" id="pending" data-type="pending">Pending</a>
                    </li>
                </ul>
                {{--  Datatable Start  --}}
                <table class="table table-bordered table-hover table-checkable" id="reviews_table"
                    style="margin-top: 13px !important"></table>
                {{--  Datatable End  --}}
            </div>
        </div>
    </div>
@endsection

@push('extra-js')
    <script src="{{ asset('assets/plugins/custom/datatables/datatables.bundle.js') }}"></script>
    <script>
        var table = $('#reviews_table');
        $(document).ready(function() {
            var type = 'approved';
            var oTable = table.dataTable({
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
                    @endif {
                        "data": "sr_no",
                        "title": "Sr.No.",
                        orderable: false
                    },
                    {
                        "data": "user_name",
                        "title": "User Name",
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
                        "data": "review_post_date",
                        "title": "Posted Date | Time"
                    },
                    {
                        "data": "rating",
                        "title": "Ratings",
                    },
                    @if (in_array('edit', $permissions))
                        {
                            "data": "active",
                            "title": "Active",
                            sortable: false,
                            visible: false
                        },
                    @endif
                    @if (in_array('delete', $permissions) || in_array('edit', $permissions))
                        {
                            "data": "requested_action",
                            "title": "Action",
                            searchble: false,
                            sortable: false,
                            visible: (type == 'approved' ? true : false)
                        },
                    @endif
                    @if (in_array('view', $permissions))
                        {
                            "data": "requested_action",
                            "title": "Action",
                            searchble: false,
                            sortable: false,
                            visible: (type == 'approved' ? false : true)
                        },
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
                    "data": {
                        requested_type: function() {
                            return type;
                        },
                    },
                    "url": "{{ route('admin.reviews.listing') }}", // ajax source
                },
                drawCallback: function(oSettings) {
                    $('.status-switch').bootstrapSwitch();
                    $('.status-switch').bootstrapSwitch('onColor', 'success');
                    $('.status-switch').bootstrapSwitch('offColor', 'danger');
                    removeOverlay();
                },
                "dom": "lfrtip"
            });

            $('.tab-change').click(function() {
                type = $(this).data('type');
                oTable.fnDraw();
            });


        });
    </script>
@endpush
