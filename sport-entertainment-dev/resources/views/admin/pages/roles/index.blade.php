@extends('admin.layouts.app')
@push('extra-css')
<link rel="stylesheet" type="text/css" href="{{ asset('assets/plugins/custom/datatables/datatables.bundle.css') }}" />
@endpush

@push('breadcrumb')
{!! Breadcrumbs::render('roles_list') !!}
@endpush

@section('content')
<div class="container">
    <div class="card card-custom">
        <div class="card-header">
            <div class="card-title">
                <span class="card-icon">
                    <i class="fab fa-black-tie text-primary"></i>
                </span>
                <h3 class="card-label">{{ $custom_title }}</h3>
            </div>

            <div class="card-toolbar">
                @if (in_array('delete', $permissions))
                <a href="{{ route('admin.roles.destroy',0) }}" name="del_select" id="del_select" class="btn btn-sm btn-light-danger font-weight-bolder text-uppercase mr-2 delete_all_link">
                    <i class="far fa-trash-alt"></i> {{ __('Delete Selected') }}
                </a>
              @endif
              @if (in_array('add', $permissions))
                <a href="{{ route('admin.roles.create') }}" class="btn btn-sm btn-primary font-weight-bolder text-uppercase">
                    <i class="fas fa-plus"></i>New Role
                </a>
              @endif
            </div>
        </div>

        <div class="card-body">
            <!--begin: Datatable-->
            <table class="table table-bordered table-hover table-checkable" id="RoleUser" style="margin-top: 13px !important">
            </table>
            <!--end: Datatable-->
        </div>
    </div>
</div>
@endsection

@push('extra-js')
<script src="{{ asset('assets/plugins/custom/datatables/datatables.bundle.js') }}"></script>
<script type="text/javascript">
    $(document).ready(function () {
        var table = $('#RoleUser');
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
            "columns": [
                { "data": "updated_at" ,"title": "Updated At", visible:false},
                @if (in_array('delete', $permissions)) { "data": "checkbox", "title":"<center><input type='checkbox' class='all_select'></center>", orderable: false }, @endif
                { "data": "first_name" ,"title": "First Name"},
                { "data": "last_name" ,"title": "Last Name"},
                { "data": "email." ,"title": "Email", sortable: false},
                { "data": "contact_number" ,"title": "Contact No",sortable:false},
                @if (in_array('edit', $permissions))
                    { "data": "active" ,"title": "Active",sortable:false},
                @endif
                @if (in_array('delete', $permissions) || in_array('edit', $permissions))
                    { "data": "action" ,"title": "Action", searchble: false, sortable:false }
                @endif
            ],
            responsive: false,
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
                    tasklist : "{{ Auth::user()->type }}",
                },
                "url": "{{ route('admin.roles.listing') }}", // ajax source
            },
            drawCallback: function( oSettings ) {
              $('.status-switch').bootstrapSwitch();
              $('.status-switch').bootstrapSwitch('onColor', 'success');
              $('.status-switch').bootstrapSwitch('offColor', 'danger');
              removeOverlay();
            },
            "dom": "lfrtip"
        });
    });
</script>
@endpush

