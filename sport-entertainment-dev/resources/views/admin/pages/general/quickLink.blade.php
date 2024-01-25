@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('quick_link') !!}
@endpush

@section('content')

<div class="container">
    <div class="card card-custom">
        <div class="card-header">
            <div class="card-title">
                <span class="card-icon">
                    <i class="fas fa-link text-primary"></i>
                </span>
                <h3 class="card-label">{{ $custom_title }}</h3>
            </div>
        </div>

        <form action="{{ route('admin.update-quickLink') }}" role="form" id="formAddQuickLinks" name="formAddQuickLinks" method="POST" enctype="multipart/form-data">
            @csrf
            <div class="card-body">
                <div class="table-responsive form-group {{ $errors->has('permissions') ? 'has-error' : '' }}">
                <table class="table table-bordered table-hover table-checkable" id="users_table" style="margin-top: 13px !important">
                    <thead>
                        <tr>
                            <th>Pages</th>
                            <th>List</th>
                            <th>Add</th>
                            <th><input type="checkbox" class="checkall" name="checkall"></th>
                        </tr>
                    </thead>
                    <tbody>
                        @php $allowed_permissions = unserialize(auth()->user()->permissions); $total_count = 0; $roleId = 1;@endphp

                        @foreach($roles as $role)
                        @if ($role->id != 1)
                            <tr class="role_row_{{ $roleId }}">
                            <td>{{ $role->title }}</td>

                            @php $permissions = explode(',',$allowed_permissions[$role->id]['permissions']);@endphp

                            <td>
                                @if ( in_array('access',$permissions) )
                                    <input data-id="{{ $roleId }}" class="premision_check role_{{ $roleId }}" data-error-container='#permission_error' name="roles[{{ strtolower($role->id) }}][permissions][]" data-per="access" type="checkbox" value="index"
                                    {{ ($role->quickLinks != null) && in_array('index', explode(',', $role->quickLinks->link_type)) ?"checked" : ""}}
                                    >
                                @php $total_count++ @endphp
                                @else N / A @endif
                            </td>
                            <td>
                                @if ( in_array('add', $permissions) )
                                    <input data-id="{{ $roleId }}" class="premision_check role_{{ $roleId }}" data-error-container='#permission_error' name="roles[{{ strtolower($role->id) }}][permissions][]"  data-per="add"  type="checkbox" value="create"
                                    {{ ($role->quickLinks != null) && in_array('create', explode(',', $role->quickLinks->link_type)) ?"checked" : ""}}>
                                @php $total_count++ @endphp
                                @else N / A @endif
                            </td>
                            <td><input type="checkbox" class="checkrow all_rolechecked_{{ $roleId }}"  name="checkrow" data-roleid='{{ $roleId }}'></td>

                            </tr>
                        @endif
                        @php $roleId++ @endphp
                        @endforeach
                    </tbody>

                </table>
                <div id="permission_error"></div>

                @if($errors->has('permissions'))
                    <span class="help-block">
                        {{ $errors->first('permissions') }}
                    </span>
                @endif
                </div>
                <!--end: Datatable-->
            </div>
            <div class="card-footer">
                <input type="submit" value="Save Changes" class="btn btn-primary mr-2 text-uppercase">
                <a href="{{ route('admin.dashboard.index') }}" class="btn btn-secondary text-uppercase">Cancel</a>
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


        $("#frmAddNewRole").validate({
            ignore: [':hidden', ],
            rules: {
                "roles[]": {
                    permission: true,
                },
            },
            errorClass: 'help-block',
            errorElement: 'span',
            highlight: function (element) {
               $(element).closest('.form-group').addClass('has-error');
            },
            unhighlight: function (element) {
               $(element).closest('.form-group').removeClass('has-error');
            },
            errorPlacement: function (error, element) {
                if (element.attr("data-error-container")) {
                    error.appendTo(element.attr("data-error-container"));
                } else {
                    error.insertAfter(element);
                }
            }
        });

        $(' input[name^="roles"] ').rules("add", {
            permission: true,
        });

        $('#frmAddNewRole').submit(function(){
            if( $(this).valid() ){
                addOverlay();
                $("input[type=submit], input[type=button], button[type=submit]").prop("disabled", "disabled");
                return true;
            }
            else{
                return false;
            }
        });
    });
</script>

 <script type="text/javascript">
        $('.role_detail').on('change', function() {
            var class_name = this.classList[1];

            $('.'+class_name).each(function(key, element) {
                $(element).closest('span').addClass('checked');
                $(element).attr('checked', 'checked');
            })
        })

        $(document).ready(function() {
            var total_checkbox = "<?php echo $total_count; ?>";
            var checked_box = document.querySelectorAll('input[class*=premision_check]:checked').length;
            console.log(total_checkbox+' => '+checked_box);
            if(total_checkbox == checked_box){
                $('.checkall').prop('checked', true);
                $('.checkrow').prop('checked', true);
                $('.checkall').parent('span').addClass('checked');
            }
            var total_rows = "<?php echo count($roles) ?>";
            for(var i = 2; i <= total_rows; i++ ){
                var total_role_checkbox = document.querySelectorAll('input[class*=role_'+i+']').length;
                var total_role_checked = document.querySelectorAll('input[class*=role_'+i+']:checked').length;
                var checked_box = document.querySelectorAll('input[class*=premision_check]:checked').length;

                if(total_role_checkbox > total_role_checked){
                    $('.all_rolechecked_'+i).prop('checked', false);
                    $('.all_rolechecked_'+i).parent('span').removeClass('checked');
                }else{
                    $('.all_rolechecked_'+i).prop('checked', true);
                    $('.all_rolechecked_'+i).parent('span').addClass('checked');
                }
            }

            $(document).on('click', '.checkall', function () {
                if($(this).is(":checked")) {
                     $('.checkrow').prop('checked', true);
                     $('.checkrow').parent('span').addClass('checked');

                     // all permission checked
                     $('.premision_check').prop('checked', true);
                     $('.premision_check').parent('span').addClass('checked');

                }else{
                     $('.checkrow').prop('checked', false);
                     $('.checkrow').parent('span').removeClass('checked');

                     // all permission unchecked
                     $('.premision_check').prop('checked', false);
                     $('.premision_check').parent('span').removeClass('checked');
                }
            });

            $(document).on('click', '.checkrow', function () {console.log("checkrow");
                var rid = $(this).data("roleid")  ;console.log(rid);
                if($(this).is(":checked")) { console.log('checked');
                console.log($(".role_row_"+rid+" input[type='checkbox']" ).prop('checked', true));
                    $(".role_row_"+rid+" span input[type='checkbox']" ).prop('checked', true);
                    $(".role_row_"+rid+" span" ).addClass('checked');
                }else{ console.log('unchecked');
                    $(".role_row_"+rid+" span" ).removeClass('checked');
                    $(".role_row_"+rid+" input[type='checkbox']" ).prop('checked', false);
                }
                var checked_box = document.querySelectorAll('input[class*=premision_check]:checked').length;
                //console.log(total_checkbox+' => '+checked_box);
                if(total_checkbox > checked_box){
                    $('.checkall').prop('checked', false);
                    $('.checkall').parent('span').removeClass('checked');
                }else{
                    $('.checkall').prop('checked', true);
                    $('.checkall').parent('span').addClass('checked');
                }

            });

            $(document).on('click', '.premision_check', function () {
                var id = $(this).data('id');
                var total_role_checkbox = document.querySelectorAll('input[class*=role_'+id+']').length;
                var total_role_checked = document.querySelectorAll('input[class*=role_'+id+']:checked').length;
                var checked_box = document.querySelectorAll('input[class*=premision_check]:checked').length;
                //console.log(total_checkbox+' => '+checked_box);
                if(total_checkbox > checked_box){
                    $('.checkall').prop('checked', false);
                    $('.checkall').parent('span').removeClass('checked');
                }else{
                    $('.checkall').prop('checked', true);
                    $('.checkall').parent('span').addClass('checked');
                }
                //console.log(total_role_checkbox+' => '+total_role_checked);
                if(total_role_checkbox > total_role_checked){
                    $('.all_rolechecked_'+id).prop('checked', false);
                    $('.all_rolechecked_'+id).parent('span').removeClass('checked');
                }else{
                    $('.all_rolechecked_'+id).prop('checked', true);
                    $('.all_rolechecked_'+id).parent('span').addClass('checked');
                }
            })

        });
</script>
@endpush
