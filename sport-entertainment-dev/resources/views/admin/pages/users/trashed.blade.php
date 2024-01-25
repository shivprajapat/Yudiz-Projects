@extends('admin.layouts.app')

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
            </div>
        </div>
        <div class="card-body">
            <!--begin: Datatable-->
            <table class="table table-bordered table-hover table-checkable" id="users_table" style="margin-top: 13px !important">
            </table>
            <!--end: Datatable-->
        </div>
    </div>
</div>
@endsection

@push('extra-js')
<script src="{{ asset('assets/plugins/custom/datatables/datatables.bundle.js') }}"></script>
<script>
    $(document).ready(function () {
        // datatable
        $('#users_table').DataTable({
            responsive: true,
            searchDelay: 500,
            processing: true,
            serverSide: true,
            ajax: {
                url: "{{ route('admin.users.trasheddata') }}",
                data: {
                    columnsDef: ['first_name', 'last_name', 'email', 'contact_number'],
                },
            },
            columns: [
                { data: 'first_name' },
                { data: 'last_name' },
                { data: 'email' },
                { data: 'contact_number' },
            ],
            columnDefs: [
                // Specify columns titles here...
                { targets: 0, title: 'First Name', orderable: true },
                { targets: 1, title: 'Last Name', orderable: true },
                { targets: 2, title: 'Email', orderable: true },
                { targets: 3, title: 'Contact Number', orderable: true }
            ],
            order: [
                [0, 'asc']
            ],
            lengthMenu: [
                [10, 20, 50, 100],
                [10, 20, 50, 100]
            ],
            pageLength: 10,
        });
    });
</script>
@endpush
