@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('coaching-centres_list') !!}
@endpush

@push('extra-css')
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/plugins/custom/datatables/datatables.bundle.css') }}" />
    <style>
        .badge {
            top: 0;
            right: 0;
            border-radius: 50px;
            transform: translate(115%, -90%);
            background-color: #7e8299;
        }

        .custom-border {
            border: 0.1px solid #eeeef3;
            border-bottom: 0px;
            border-radius: 5px;
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
                        <a href="{{ route('admin.coaching-centres.destroy', 0) }}" name="del_select" id="del_select"
                            class="btn btn-sm btn-light-danger font-weight-bolder text-uppercase mr-2 delete_all_link">
                            <i class="far fa-trash-alt"></i> Delete Selected
                        </a>
                    @endif
                    @if (in_array('add', $permissions))
                        <a href="{{ route('admin.coaching-centres.create') }}"
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
                        <a class="nav-link tab-change active" data-toggle="tab" id="all_data" data-type="all_data">All
                            Coaching Centres</a>
                    </li>
                    <li class="nav-item custom-border">
                        <a class="nav-link tab-change" data-toggle="tab" id="requested_data"
                            data-type="requested_data">Coaching
                            Centres Requests<span class="badge badge-danger">{{ $count }}</span></a>
                    </li>
                </ul>
                {{--  Datatable Start  --}}
                <table class="table table-bordered table-hover table-checkable" id="coaching_centre_table"
                    style="margin-top: 13px !important"></table>
                {{--  Datatable End  --}}
            </div>
        </div>
        <!-- Modal-->
        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalSizeSm"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header text-center">
                        <h5 class="modal-title w-100"><b>Rejection Reason</b></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <i aria-hidden="true" class="ki ki-close"></i>
                        </button>
                    </div>

                    <form action="" id="addRejectionReason">
                        @csrf
                        <input type="hidden" name="id" value="">
                        <div class="modal-body ">
                            <div class="form-group">
                                <textarea type="text" class="form-control @error('rejection_reason') is-invalid @enderror" id="rejection_reason"
                                    name="rejection_reason" value="{{ old('rejection_reason') }}" placeholder="Please enter a reason for Rejection"
                                    style="height: 100px;"></textarea>
                                @if ($errors->has('rejection_reason'))
                                    <span class="help-block">
                                        <strong class="form-text">{{ $errors->first('rejection_reason') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>
                        <div class="card-footer" style="padding:15px;padding-left:180px">
                            <button type="submit" class="btn btn-primary mr-2">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        {{-- end Modal --}}
    </div>
@endsection

@push('extra-js')
    <script src="{{ asset('assets/plugins/custom/datatables/datatables.bundle.js') }}"></script>
    <script>
        var table = $('#coaching_centre_table');
        var activeColumnIndex = 8; // Replace with the actual column index for 'active'
        var actionColumnIndex = 9; // Replace with the actual column index for 'action'
        var requestedActionColumnIndex = 10; // Replace with the actual column index for 'requested_action'

        $(document).ready(function() {
            var type = 'all_data';
            // tableData(type);

            $(document).on("click", "#approve_id", function(e) {
                var url = $(this).data("url");
                var id = $(this).data("id");
                var action_data = $(this).data("type");
                var customAct =
                    typeof $(this).data("getaction") != "undefined" ?
                    $(this).data("getaction") :
                    "";
                var action = customAct != "" ? customAct : action_data;
                var badge = $(".badge");
                var badgeValue = badge.text(); // Using .text() method
                var newValue;

                if (action_data == "admin_approved") {
                    $.ajax({
                        url: url,
                        type: "PUT",
                        dataType: "json",
                        data: {
                            _token: $("meta[name='csrf-token']").attr("content"),
                            id: id,
                            action: action,
                        },
                        success: function(success) {
                            table.DataTable().destroy();
                            tableData("requested_data");
                            toastr.success("Approved Successfully!");
                            newValue = badgeValue - 1;
                            badge.text(newValue);
                        },
                    });
                } else {

                    $('#addRejectionReason').submit(function(e) {
                        e.preventDefault();
                        var reason = $("#rejection_reason").val();
                        $("#exampleModalCenter").modal("hide");;

                        //make ajax call
                        $.ajax({
                            url: url,
                            type: "PUT",
                            dataType: "json",
                            data: {
                                _token: $("meta[name='csrf-token']").attr("content"),
                                id: id,
                                action: action,
                                rejection_reason: reason,
                            },
                            success: function(success) {
                                table.DataTable().destroy();
                                tableData("requested_data");
                                toastr.success("Rejected Successfully!");
                                newValue = badgeValue - 1;
                                badge.text(newValue);
                            },
                        });
                    });
                }
            });

            // function tableData(type) {
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
                        "title": "Sr. No.",
                        sortable: false
                    },
                    {
                        "data": "first_name",
                        "title": "First Name"
                    },
                    {
                        "data": "last_name",
                        "title": "Last Name"
                    },
                    {
                        "data": "email",
                        "title": "Email Id"
                    },
                    {
                        "data": "coaching_name",
                        "title": "Coaching Centre Name",
                    },
                    {
                        "data": "mobile_number",
                        "title": "Contact Number",
                    },
                    @if (in_array('edit', $permissions))
                        {
                            "data": "active",
                            "title": "Status",
                            sortable: false,
                            visible: (type == 'requested_data' ? false : true)
                        },
                    @endif
                    @if (in_array('delete', $permissions) || in_array('edit', $permissions))
                        {
                            "data": "action",
                            "title": "Action",
                            searchble: false,
                            sortable: false,
                            visible: (type == 'requested_data' ? false : true)
                        },
                    @endif {
                        "data": "requested_action",
                        "title": "Action",
                        sortable: false,
                        visible: (type == 'requested_data' ? true : false)
                    },
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
                    "url": "{{ route('admin.coaching-centres.listing') }}", // ajax source
                },
                drawCallback: function(oSettings) {
                    $('.status-switch').bootstrapSwitch();
                    $('.status-switch').bootstrapSwitch('onColor', 'success');
                    $('.status-switch').bootstrapSwitch('offColor', 'danger');
                    removeOverlay();
                },
                "dom": "lfrtip"
            });
            // }
            $('.tab-change').click(function() {
                type = $(this).data('type');
                oTable.fnDraw();
                // Show/hide columns based on the condition
                table.fnSetColumnVis(activeColumnIndex,type !== 'requested_data');
                table.fnSetColumnVis(actionColumnIndex,type !== 'requested_data');
                table.fnSetColumnVis(requestedActionColumnIndex,type === 'requested_data');
                // oTable.fnSetColumnVis(columnIndex, isVisible);

            });

        });
    </script>
@endpush
