@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('faqs_list') !!}
@endpush

@push('extra-css')
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/plugins/custom/datatables/datatables.bundle.css') }}" />
    <style>
        .custom-width {
            width: 160px;
            /* Specify the desired width */
        }
    </style>
@endpush

@section('content')
    <div class="container">
        <div class="card card-custom">
            <div class="card-header">
                <div class="card-title">
                    <span class="card-icon">
                        <i class="fas fa-question-circle text-primary"></i>
                    </span>
                    <h3 class="card-label">{{ $custom_title }}</h3>
                </div>

                <div class="card-toolbar">
                    @if (in_array('add', $permissions))
                        <a href="{{ route('admin.faqs.create') }}"
                            class="btn btn-sm btn-primary font-weight-bolder text-uppercase">
                            <i class="fas fa-plus"></i>
                            Add {{ $custom_title }}
                        </a>
                    @endif
                </div>
            </div>
            <div class="card-body">
                <div class="row mb-10 ">
                    <div class="col-lg-4">
                        {{-- <label class="">Project Name</label> --}}
                        <select class="form-control selectpicker" id="dropdownMenuButton" name="project" title="User Type">
                            <option value="end_user">End User</option>
                            <option value="coaching_centre">Coaching Centre</option>
                        </select>

                    </div>
                </div>

                {{--  Datatable Start  --}}
                <table class="table table-bordered table-hover table-checkable" id="faqs_table"
                    style="margin-top: 13px !important"></table>
                {{--  Datatable End  --}}
            </div>
        </div>
    </div>
@endsection

@push('extra-js')
    <script src="{{ asset('assets/plugins/custom/datatables/datatables.bundle.js') }}"></script>
    <script>
        var table = $('#faqs_table');
        $(document).ready(function() {
            var selectedText;
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
                    {
                        "data": "sr_no",
                        "title": "Sr.No.",
                        sortable: false
                    },
                    {
                        "data": "title",
                        "title": "Questions"
                    },
                    {
                        "data": "faq_type",
                        "title": "User"
                    },
                    @if (in_array('edit', $permissions))
                        {
                            "data": "active",
                            "title": "Active",
                            sortable: false
                        },
                    @endif
                    @if (in_array('delete', $permissions) || in_array('edit', $permissions))
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
                    "data": {
                        tasklist: "{{ Auth::user()->type }}",
                        user_type: function() {
                            return selectedText;
                        },
                    },
                    "url": "{{ route('admin.faqs.listing') }}", // ajax source
                },
                drawCallback: function(oSettings) {
                    $('.status-switch').bootstrapSwitch();
                    $('.status-switch').bootstrapSwitch('onColor', 'success');
                    $('.status-switch').bootstrapSwitch('offColor', 'danger');
                    removeOverlay();
                },
                "dom": "lfrtip"
            });
            $(document).on('click', '.dropdown-item', (function() {
            selectedText = $('#dropdownMenuButton').val();
            oTable.fnDraw();
        }));
        });
    </script>
@endpush
