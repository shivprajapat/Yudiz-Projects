@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('age-groups_update', $ageGroup->id) !!}
@endpush

@section('content')
    <div class="container">
        <div class="card card-custom">
            <div class="card-header">
                <div class="card-title">
                    <span class="card-icon">
                        <i class="fas fa-user-edit text-primary"></i>
                    </span>
                    <h3 class="card-label text-uppercase">Edit {{ $custom_title }}</h3>
                </div>
            </div>

            <!--begin::Form-->
            <form id="editAgeGroup" method="POST" action="{{ route('admin.age-groups.update', $ageGroup->id) }}"
                enctype="multipart/form-data">
                @csrf
                @method('put')
                <div class="card-body">

                    {{-- Age group name --}}
                    <div class="form-group">
                        <label for="age_name">{!! $mend_sign !!}Age Group Name:</label>
                        <input type="text" class="form-control @error('age_name') is-invalid @enderror" id="age_name"
                            name="age_name" value="{{ old('age_name') != null ? old('age_name') : $ageGroup->age_name }}"
                            placeholder="Enter first name" autocomplete="age_name" spellcheck="false"
                            autocapitalize="sentences" tabindex="0" autofocus />
                        @if ($errors->has('age_name'))
                            <span class="text-danger">
                                <strong class="form-text">{{ $errors->first('age_name') }}</strong>
                            </span>
                        @endif
                    </div>

                    {{-- Minimum_age Age --}}
                    <div class="form-group">
                        <label for="minimum_age">{!! $mend_sign !!}Minimum Age:</label>
                        <input type="text" class="form-control @error('minimum_age') is-invalid @enderror"
                            id="minimum_age" name="minimum_age"
                            value="{{ old('minimum_age') != null ? old('minimum_age') : $ageGroup->minimum_age }}"
                            placeholder="Enter minimum age" autocomplete="minimum_age" spellcheck="false"
                            autocapitalize="sentences" tabindex="0" autofocus />
                        @if ($errors->has('minimum_age'))
                            <span class="text-danger">
                                <strong class="form-text">{{ $errors->first('minimum_age') }}</strong>
                            </span>
                        @endif
                    </div>

                    {{-- Maximum_age Age --}}
                    <div class="form-group">
                        <label for="maximum_age">{!! $mend_sign !!}Maximum Age:</label>
                        <input type="text" class="form-control @error('maximum_age') is-invalid @enderror"
                            id="maximum_age" name="maximum_age"
                            value="{{ old('maximum_age') != null ? old('maximum_age') : $ageGroup->maximum_age }}"
                            placeholder="Enter maximum age" autocomplete="maximum_age" spellcheck="false"
                            autocapitalize="sentences" tabindex="0" autofocus />
                        @if ($errors->has('maximum_age'))
                            <span class="text-danger">
                                <strong class="form-text">{{ $errors->first('maximum_age') }}</strong>
                            </span>
                        @endif
                    </div>
                </div>
                <div class="card-footer">
                    <button type="submit" class="btn btn-primary mr-2">Update {{ $custom_title }}</button>
                    <a href="{{ route('admin.age-groups.index') }}" class="btn btn-secondary">Cancel</a>
                </div>
            </form>
            <!--end::Form-->
        </div>
    </div>
@endsection

@push('extra-js')
    <script>
        $(document).ready(function() {
            $.validator.addMethod(
                "greaterThan",
                function(value, element, param) {
                    var minimum_age = parseFloat($("#minimum_age").val()); // Convert to a numeric value
                    var maximum_age = parseFloat(value); // Convert to a numeric value
                    return maximum_age >= minimum_age;
                },
                "Maximum age must be greater than or equal to the minimum age."
            );

            $("#editAgeGroup").validate({
                rules: {
                    age_name: {
                        required: true,
                        not_empty: true,
                        alphaonly: false,
                        minlength: 3,
                        maxlength: 50,
                    },
                    minimum_age: {
                        required: true,
                        number: true,
                        min: 0,
                        max: 100,
                    },
                    maximum_age: {
                        required: true,
                        number: true,
                        min: 0,
                        max: 100,
                        greaterThan: "#minimum_age",
                    },
                },
                messages: {
                    age_name: {
                        required: "@lang('validation.required', ['attribute' => 'Age Group name'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'Age Group name'])",
                        alphaonly: "@lang('validation.alphaonly', ['attribute' => 'Age Group name'])",
                        minlength: "@lang('validation.min.string', ['attribute' => 'Age Group name', 'min' => 3])",
                        maxlength: "@lang('validation.max.string', ['attribute' => 'Age Group name', 'min' => 50])",
                    },
                    minimum_age: {
                        required: "@lang('validation.required', ['attribute' => ' Minimum age'])",
                        number: "@lang('validation.number', ['attribute' => ' Minimum age'])",
                        min: "The minimum age must be greater than 0",

                    },
                    maximum_age: {
                        required: "@lang('validation.required', ['attribute' => ' Maximum age'])",
                        number: "@lang('validation.number', ['attribute' => ' Maximum age'])",
                        min: "The minimum age must be greater than 0",

                    },

                },
                errorClass: 'invalid-feedback',
                errorElement: 'span',
                highlight: function(element) {
                    $(element).addClass('is-invalid');
                    $(element).siblings('label').addClass('text-danger'); // For Label
                },
                unhighlight: function(element) {
                    $(element).removeClass('is-invalid');
                    $(element).siblings('label').removeClass('text-danger'); // For Label
                },
                errorPlacement: function(error, element) {
                    if (element.attr("data-error-container")) {
                        error.appendTo(element.attr("data-error-container"));
                    } else {
                        error.insertAfter(element);
                    }
                }
            });
            $('#editAgeGroup').submit(function() {
                if ($(this).valid()) {
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
