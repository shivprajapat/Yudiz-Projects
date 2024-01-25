@extends('admin.layouts.app')
@push('breadcrumb')
    {!! Breadcrumbs::render('transactions_list') !!}
@endpush

@push('extra-css')
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/plugins/custom/datatables/datatables.bundle.css') }}" />
    <style>
        .card-record .row {
            height: 100px;
            padding-top: 20px;
        }

        ,
        .card-record .row .col-lg-3 h2 {
            text-align: center;
        }
    </style>
@endpush

@section('content')
    <div class="container">

        <div class="card card-custom">
            <div class="card-record">
                <div class="row mb-10 mt-10 ml-5 mr-5" style="background-color: #91b5d91c;">
                    <div class="col-lg-3">
                        <label>
                            <h5>Total Earnings</h5>
                        </label>
                        <h2>{{ $earnings['total'] }} INR</h2>
                    </div>
                    <div class="col-lg-3">
                        <label>
                            <h5>Total Earnings This Month</h5>
                        </label>
                        <h2>{{ $earnings['current_month'] }} INR</h2>
                    </div>
                    <div class="col-lg-3">
                        <label>
                            <h5>Total Earnings This Year</h5>
                        </label>
                        <h2>{{ $earnings['current_year'] }} INR</h2>
                    </div>
                    <div class="col-lg-3">
                        <label>
                            <h5>Total Earnings Previous Year</h5>
                        </label>
                        <h2>{{ $earnings['previous_year'] }} INR</h2>
                    </div>
                </div>
            </div>
            <div class="card-header">
                <div class="card-title">
                    <span class="card-icon">
                        <i class="{{ $icon }} text-primary"></i>
                    </span>
                    <h3 class="card-label">{{ $custom_title }}</h3>
                </div>


                <div class="card-toolbar">
                    @if (in_array('delete', $permissions))
                        <a href="{{ route('admin.transactions.destroy', 0) }}" name="del_select" id="del_select"
                            class="btn btn-sm btn-light-danger font-weight-bolder text-uppercase mr-2 delete_all_link"
                            data-module="{{ strtolower($custom_title) }}" data-route-name="{{ $routeName }}">
                            <i class="far fa-trash-alt"></i> Delete Selected
                        </a>
                    @endif
                    @if (in_array('add', $permissions))
                        <a href="{{ route('admin.transactions.create') }}"
                            class="btn btn-sm btn-primary font-weight-bolder text-uppercase">
                            <i class="fas fa-plus"></i>
                            Add {{ str_singular($custom_title) }}
                        </a>
                    @endif
                </div>

            </div>
            <div class="card-body">
                <div class="row mb-10 ">
                    <div class="col-lg-2">
                        <a href="{{ route('admin.transactions.update', 0) }}" name="process_select" id="process_select"
                            class="btn btn-primary processed_all_select" data-module="{{ strtolower($custom_title) }}"
                            data-route-name="{{ $routeName }}">
                            Mark as processed
                        </a>
                        {{-- <button type="submit" data-target-href="{{ route('admin.transactions.destroy', 0) }}" class="btn btn-primary mark_as_processed">Mark as processed</button> --}}
                    </div>
                    <div class="col-lg-2">
                        <div class="input-group">
                            <input type="text" class="form-control" id="select_date" name="select_date" value=""
                                placeholder="Date" />
                            <div class="input-group-append">
                                <span class="input-group-text">
                                    <i class="la la-calendar"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <select class="form-control selectpicker" id="payment_status_end_user" title="Transaction Status">
                            <option value="success">Success</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                    <div class="col-lg-3">
                        <select class="form-control selectpicker" id="payment_transfer_status" title="Payment Transfer">
                            <option value="processed">Processed</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>
                {{-- Datatable Start  --}}
                <table class="table table-bordered table-hover table-checkable" id="payment_table"
                    style="margin-top: 13px !important"></table>
                {{-- Datatable End  --}}
            </div>
        </div>
    </div>
@endsection

@push('extra-js')
    <script src="{{ asset('assets/plugins/custom/datatables/datatables.bundle.js') }}"></script>
    <script>
        var table = $('#payment_table');
        $(document).ready(function() {
            var selectedOption ;
            var selectedColumn ;
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
                        "data": "checkbox",
                        "title": "<center><input type='checkbox' class='all_select'></center>",
                        orderable: false
                    },
                    {
                        "data": "transaction_id",
                        "title": "Trn. Id"
                    },
                    {
                        "data": "transaction_date",
                        "title": "Date | Time",
                    },
                    {
                        "data": "user_name",
                        "title": "User Name"
                    },
                    {
                        "data": "coaching_name",
                        "title": "Coaching Centre",
                    },
                    {
                        "data": "batch_name",
                        "title": "Batch Name"
                    },
                    {
                        "data": "total_amount",
                        "title": "Total Amount",
                    },
                    {
                        "data": "commission",
                        "title": "% of Commission"
                    },
                    {
                        "data": "amount_paid_to_owner",
                        "title": "Amount paid to Owner",
                    },
                    {
                        "data": "payment_status_end_user",
                        "title": "Trn. Status"
                    },
                    {
                        "data": "payment_transfer_status",
                        "title": "Payment transfer status",
                    },
                    @if (in_array('edit', $permissions))
                        {
                            "data": "active",
                            "title": "Active",
                            sortable: false,
                            visible: false,
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
                        selected_column: function() {
                            return selectedColumn;
                        },
                        selected_option: function() {
                            return selectedOption;
                        },
                    },
                    "url": "{{ route('admin.transactions.listing') }}", // ajax source
                },
                drawCallback: function(oSettings) {
                    $('.status-switch').bootstrapSwitch();
                    $('.status-switch').bootstrapSwitch('onColor', 'success');
                    $('.status-switch').bootstrapSwitch('offColor', 'danger');
                    removeOverlay();
                },
                "dom": "lfrtip"
            });

            $('.selectpicker').on('changed.bs.select', function(e, clickedIndex, isSelected, previousValue) {
                 selectedOption = $(this).find('option').eq(clickedIndex).val();
                 selectedColumn = $(this).attr('id');
                oTable.fnDraw();
            });

            $(document).on("click", ".processed_all_select", function(e) {
                $(".processed_all_select").attr("disabled", "disabled");
                e.preventDefault();
                var url = $(this).attr("href");
                console.log(url);
                var searchIDs = [];
                $(".dataTable tbody input[class='small-chk']:checked").each(
                    function() {
                        searchIDs.push($(this).val());
                    }
                );
                if (searchIDs.length > 0) {
                    console.log(searchIDs);
                    // var ids = searchIDs.join();
                    Swal.fire({
                        title: "Are you sure?",
                        text: "You won't to processed this records!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes, process it!",
                    }).then(function(result) {
                        if (result.value) {
                            $.ajax({
                                url: url,
                                type: "PUT",
                                dataType: "json",
                                data: {
                                    action: "processed_all",
                                    ids: searchIDs,
                                    _token: $('meta[name="csrf_token"]').attr(
                                        "content"
                                    ),
                                },
                                success: function(success) {
                                    $(".all_select").prop("indeterminate", false);
                                    $(".all_select").prop("checked", false);
                                    if ($(".all_select").hasClass("allChecked")) {
                                        $(".all_select").removeClass("allChecked");
                                    }
                                    $(".all_select").prop("indeterminate", false);
                                    $(".processed_all_select").removeAttr("disabled");
                                    // oTable.ajax.reload();
                                    oTable.api().ajax.reload();
                                },
                            });

                            Swal.fire({
                                title: "Processed!",
                                icon: "success",
                                text: "Records were processed.",
                                showConfirmButton: false,
                                timer: 1500,
                            });
                        }
                    });
                } else {
                    $(".all_select").prop("indeterminate", false);
                    $(".processed_all_select").removeAttr("disabled");
                }
            });
            //date picker
            $('#select_date').datepicker({
                todayBtn: "linked",
                clearBtn: true,
                todayHighlight: false,
                templates: arrows,
                format: 'dd/mm/yyyy',
                autoclose: true,
                orientation: "bottom left",
            }).on('change', function(e) {
                selectedOption = $(this).val();
                selectedColumn = 'transaction_date';
                oTable.fnDraw();
            });

            var arrows;
            if (KTUtil.isRTL()) {
                arrows = {
                    leftArrow: '&lt;i class="la la-angle-right"&gt;&lt;/i&gt;',
                    rightArrow: '&lt;i class="la la-angle-left"&gt;&lt;/i&gt;'
                }
            } else {
                arrows = {
                    leftArrow: '&lt;i class="la la-angle-left"&gt;&lt;/i&gt;',
                    rightArrow: '&lt;i class="la la-angle-right"&gt;&lt;/i&gt;'
                }
            }
        });
    </script>
@endpush
