@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('roles_create') !!}
@endpush

@section('content')
    <div class="container">
        <div class="card card-custom gutter-b example example-compact">
            <div class="card-header">
                <div class="card-title">
                    <span class="card-icon">
                        <i class="fab fa-black-tie text-primary"></i>
                    </span>
                    <h3 class="card-label text-uppercase">ADD New Role</h3>
                </div>
            </div>

            @if ($errors->any())
                <div class="alert alert-danger">
                    <ul>
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form id="frmAddRoles" class="form-horizontal" role="form" method="POST"
                action="{{ route('admin.roles.store') }}" enctype="multipart/form-data">
                @csrf
                <div class="card-body">

                    {{-- First Name --}}
                    <div class="form-group{{ $errors->has('first_name') ? ' has-error' : '' }}">
                        <label for="first_name" class="control-label">{!! $mend_sign !!}First Name:</label>
                        <input type="text" name="first_name" class="form-control" placeholder="Enter your First Name"
                            value="{{ old('first_name') }}" />
                        @if ($errors->has('first_name'))
                            <span class="invalid-feedback">
                                <strong class="form-text text-danger">{{ $errors->first('first_name') }}</strong>
                            </span>
                        @endif
                    </div>

                    {{-- Last Name --}}
                    <div class="form-group{{ $errors->has('last_name') ? ' has-error' : '' }}">
                        <label for="last_name" class="control-label">{!! $mend_sign !!}Last Name:</label>
                        <input type="text" name="last_name" class="form-control" placeholder="Enter your Last Name"
                            value="{{ old('last_name') }}" />
                        @if ($errors->has('last_name'))
                            <span class="invalid-feedback">
                                <strong class="form-text text-danger">{{ $errors->first('last_name') }}</strong>
                            </span>
                        @endif
                    </div>

                    {{-- Email --}}
                    <div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">
                        <label for="email" class="control-label">{!! $mend_sign !!}Email:</label>
                        <input type="email" name="email" class="form-control" placeholder="Enter your Email"
                            value="{{ old('email') }}">
                        @if ($errors->has('email'))
                            <span class="invalid-feedback">
                                <strong>{{ $errors->first('email') }}</strong>
                            </span>
                        @endif
                    </div>

                    {{-- Contact --}}
                    <div class="form-group{{ $errors->has('contact_number') ? ' has-error' : '' }}">
                        <label for="contact_number">{!! $mend_sign !!}Contact No:</label>
                        <input type="text" name="contact_number" class="form-control" placeholder="Enter your Contact"
                            value="{{ old('contact_number') }}">
                        @if ($errors->has('contact_number'))
                            <span class="invalid-feedback">
                                <strong>{{ $errors->first('contact_number') }}</strong>
                            </span>
                        @endif
                    </div>

                    {{-- Permission --}}
                    <div class="form-group{{ $errors->has('roles') ? ' has-error' : '' }}">
                        <label for="roles" class="col-md-4">{!! $mend_sign !!}User Permissions:</label>
                        <table class="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Pages</th>
                                    <th>Access</th>
                                    <th>Add</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                    <th>View</th>
                                    <th>
                                        <input type="checkbox" class="checkall" name="checkall">
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                @php
                                    $total_count = 0;
                                @endphp
                                @foreach ($roles as $key => $role)
                                    @php $index = $key + 1; @endphp
                                    @if ($role->id != 1)
                                        <tr class="role_row_{{ $role->id }}">
                                            <td>{{ $role->title }}</td>
                                            @php $allowed_permissions = explode(',', $role->allowed_permissions); @endphp
                                            <td>
                                                @if (in_array('access', $allowed_permissions))
                                                    <input class="premision_check access_{{ $role->id }} role_{{ $role->id }}"
                                                        data-id="{{ $role->id }}"
                                                        data-error-container='#permission_error'
                                                        name="roles[{{ strtolower($role->id) }}][permissions][]"
                                                        type="checkbox" value="access"
                                                        {{ $role->id == 1 ? 'checked disabled' : '' }}>
                                                    @php $total_count++ @endphp
                                                @else
                                                    N / A
                                                @endif
                                            </td>
                                            <td>
                                                @if (in_array('add', $allowed_permissions))
                                                    <input class="premision_check role_{{ $role->id }}"
                                                        data-id="{{ $role->id }}"
                                                        data-error-container='#permission_error'
                                                        name="roles[{{ strtolower($role->id) }}][permissions][]"
                                                        type="checkbox" value="add">
                                                    @php $total_count++ @endphp
                                                @else
                                                    N / A
                                                @endif
                                            </td>
                                            <td>
                                                @if (in_array('edit', $allowed_permissions))
                                                    <input class="premision_check role_{{ $role->id }}"
                                                        data-id="{{ $role->id }}"
                                                        data-error-container='#permission_error'
                                                        name="roles[{{ strtolower($role->id) }}][permissions][]"
                                                        type="checkbox" value="edit">
                                                    @php $total_count++ @endphp
                                                @else
                                                    N / A
                                                @endif
                                            </td>
                                            <td>
                                                @if (in_array('delete', $allowed_permissions))
                                                    <input class="premision_check role_{{ $role->id }}"
                                                        data-id="{{ $role->id }}"
                                                        data-error-container='#permission_error'
                                                        name="roles[{{ strtolower($role->id) }}][permissions][]"
                                                        type="checkbox" value="delete">
                                                    @php $total_count++ @endphp
                                                @else
                                                    N / A
                                                @endif
                                            </td>
                                            <td>
                                                @if (in_array('view', $allowed_permissions))
                                                    <input class="premision_check role_{{ $role->id }}"
                                                        data-id="{{ $role->id }}"
                                                        data-error-container='#permission_error'
                                                        name="roles[{{ strtolower($role->id) }}][permissions][]"
                                                        type="checkbox" value="view">
                                                    @php $total_count++ @endphp
                                                @else
                                                    N / A
                                                @endif
                                            </td>
                                            <td>
                                                <input type="checkbox" class="checkrow all_rolechecked_{{ $role->id }}"
                                                    name="checkrow" data-roleid='{{ $role->id }}'>
                                            </td>
                                        </tr>
                                    @endif
                                @endforeach
                            </tbody>
                        </table>
                        <label class="col-md-8 col-md-offset-4"
                            style="font-size: 12px; vertical-align: top; color: #a9a9a9">*Dashboard has default access
                            permission!</label>
                        <div id="permission_error"></div>
                        @if ($errors->has('roles'))
                            <span class="invalid-feedback">
                                <strong>{{ $errors->first('roles') }}</strong>
                            </span>
                        @endif
                    </div>
                </div>
                {{-- button --}}
                <div class="card-footer">
                    <button type="submit" class="btn btn-primary mr-2 text-uppercase">Save</button>
                    <a href="{{ route('admin.roles.index') }}" class="btn btn-secondary text-uppercase">Cancel</a>
                </div>
            </form>
        </div>
    </div>
@endsection
@push('extra-js')
    <script type="text/javascript">
        $(document).ready(function() {
            jQuery.validator.addMethod("permission", function(value, element) {
                return $("[name^=roles]:checked").length > 0;
            }, "Select at least one permission.");

            $("#frmAddRoles").validate({
                rules: {
                    ignore: [
                        ':hidden',
                    ],
                    "roles[]": {
                        permission: true,
                    },
                    first_name: {
                        required: true,
                        maxlength: 150,
                        not_empty: true,
                    },
                    last_name: {
                        required: true,
                        maxlength: 150,
                        not_empty: true,
                    },
                    email: {
                        required: true,
                        email: true,
                        maxlength: 80,
                        pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        remote: {
                            url: "{{ route('admin.check.email') }}",
                            type: "post",
                            data: {
                                _token: function() {
                                    return "{{ csrf_token() }}"
                                },
                                email: function() {
                                    return $("input[name=email]").val();
                                },
                                type: 'admin',
                            }
                        },
                    },
                    contact_number: {
                        required: true,
                        minlength: 6,
                        maxlength: 15,
                        pattern: /^[0-9]+$/,
                        remote: {
                            url: "{{ route('admin.check.contact') }}",
                            type: "post",
                            async: false,
                            cache: false,
                            data: {
                                _token: function() {
                                    return "{{ csrf_token() }}"
                                },
                                mobile: function() {
                                    return $("input[name=contact_number]").val();
                                },
                                type: 'admin',
                            }
                        },
                    },
                    type: {
                        required: true,
                    },
                    roles: {
                        required: true,
                    },
                },
                messages: {
                    first_name: {
                        required: "@lang('validation.required', ['attribute' => 'first name'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'first name'])",
                        maxlength: "@lang('validation.max.string', ['attribute' => 'first name', 'max' => 150])",
                    },
                    last_name: {
                        required: "@lang('validation.required', ['attribute' => 'last name'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'last name'])",
                        maxlength: "@lang('validation.max.string', ['attribute' => 'last name', 'max' => 150])",
                    },
                    email: {
                        required: "@lang('validation.required', ['attribute' => 'email address'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'email address'])",
                        maxlength: "@lang('validation.max.string', ['attribute' => 'email address', 'max' => 80])",
                        remote: "@lang('validation.unique', ['attribute' => 'email address'])",
                        valid_email: "@lang('validation.email', ['attribute' => 'email address'])",
                        pattern: "@lang('validation.email', ['attribute' => 'email address'])",
                        email: "@lang('validation.email', ['attribute' => 'email address'])",
                    },
                    contact_number: {
                        required: "@lang('validation.required', ['attribute' => 'contact number'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'contact number'])",
                        maxlength: "@lang('validation.max.numeric', ['attribute' => 'contact number', 'max' => 15])",
                        minlength: "@lang('validation.min.numeric', ['attribute' => 'contact number', 'min' => 6])",
                        remote: "@lang('validation.unique', ['attribute' => 'contact number'])",
                        pattern: "@lang('validation.digits', ['attribute' => 'contact number'])",
                    },
                },
                errorClass: 'invalid-feedback',
                errorElement: 'span',
                highlight: function(element) {
                    $(element).addClass('is-invalid');
                    $(element).siblings('label').addClass('text-danger');
                },
                unhighlight: function(element) {
                    $(element).removeClass('is-invalid');
                    $(element).siblings('label').removeClass('text-danger');
                },
                errorPlacement: function(error, element) {
                    if (element.attr("type") == "radio") {
                        error.appendTo('.a');
                    } else {
                        if (element.attr("data-error-container")) {
                            error.appendTo(element.attr("data-error-container"));
                        } else {
                            error.insertAfter(element);
                        }
                    }
                }
            });

            $(' input[name^="roles"] ').rules("add", {
                permission: true,
            });

            $(document).on('submit', '#frmAddRoles', function() {
                if ($("#frmAddRoles").valid()) {
                    addOverlay();
                    $("input[type=submit], input[type=button], button[type=submit]").prop("disabled",
                        "disabled");
                    return true;
                } else {
                    return false;
                }
            });
        });
    </script>
@endpush

@push('extra-js')
    <script>
        $(document).ready(function() {
            var total_checkbox = "<?php echo $total_count; ?>";
            $('.role_detail').on('change', function() {
                var class_name = this.classList[1];
                $('.' + class_name).each(function(key, element) {
                    $(element).closest('span').addClass('checked');
                    $(element).attr('checked', 'checked');
                });
            });
            $(document).on('click', '.checkall', function() {
                if ($(this).is(":checked")) {
                    $('.checkrow').prop('checked', true);
                    $('.checkrow').parent('span').addClass('checked');
                    // all permission checked
                    $('.premision_check').prop('checked', true);
                    $('.premision_check').parent('span').addClass('checked');
                } else {
                    $('.checkrow').prop('checked', false);
                    $('.checkrow').parent('span').removeClass('checked');
                    // all permission unchecked
                    $('.premision_check').prop('checked', false);
                    $('.premision_check').parent('span').removeClass('checked');
                }
            });
            $(document).on('click', '.checkrow', function() {
                var rid = $(this).data("roleid");
                if ($(this).is(":checked")) {
                    $(".role_row_" + rid + "").prop('checked', true);
                    $(".role_row_" + rid + "").addClass('checked');
                    $(".role_" + rid).prop('checked', true);
                    $(".role_" + rid).addClass('checked');
                } else {
                    $(".role_row_" + rid + "").removeClass('checked');
                    $(".role_row_" + rid + "").prop('checked', false);
                    $(".role_" + rid).prop('checked', false);
                    $(".role_" + rid).removeClass('checked');
                }
                var checked_box = document.querySelectorAll('input[class*=premision_check]:checked').length;
                //console.log(total_checkbox+' => '+checked_box);
                if (total_checkbox > checked_box) {
                    $('.checkall').prop('checked', false);
                    $('.checkall').parent('span').removeClass('checked');
                } else {
                    $('.checkall').prop('checked', true);
                    $('.checkall').parent('span').addClass('checked');
                }
            });
            $(document).on('click', '.premision_check', function() {
                var id = $(this).data('id');
                var total_role_checkbox = document.querySelectorAll('input[class*=role_' + id + ']').length;
                var total_role_checked = document.querySelectorAll('input[class*=role_' + id + ']:checked')
                    .length;
                var checked_box = document.querySelectorAll('input[class*=premision_check]:checked').length;
                //console.log(total_checkbox+' => '+checked_box);
                if (total_checkbox > checked_box) {
                    $('.checkall').prop('checked', false);
                    $('.checkall').parent('span').removeClass('checked');
                } else {
                    $('.checkall').prop('checked', true);
                    $('.checkall').parent('span').addClass('checked');
                }
                //console.log(total_role_checkbox+' => '+total_role_checked);
                if (total_role_checkbox > total_role_checked) {
                    $('.all_rolechecked_' + id).prop('checked', false);
                    $('.all_rolechecked_' + id).parent('span').removeClass('checked');
                } else {
                    $('.all_rolechecked_' + id).prop('checked', true);
                    $('.all_rolechecked_' + id).parent('span').addClass('checked');
                }
            });
            $(document).on('click', '.premision_check', function() {
                var data_id = $(this).data('id');
                if ($(this).is(":checked")) {
                    $('.access_' + data_id).prop('checked', true);
                    $('.access_' + data_id).parent('span').addClass('checked');
                } else {
                    var checked_box_count = $('.role_' + data_id + ':checked').length;
                    if (checked_box_count < 2) {
                        $('.access_' + data_id).prop('checked', false);
                        $('.access_' + data_id).parent('span').addClass('checked');
                    }
                }
            });
        });
    </script>
@endpush
