@extends('admin.layouts.app')
@push('breadcrumb')
    {!! Breadcrumbs::render('sports_create') !!}
@endpush
@section('content')
    <div class="container">
        <div class="card card-custom">
            <div class="card-header">
                <div class="card-title">
                    <span class="card-icon">
                        <i class="{{ $icon }} text-primary"></i>
                    </span>
                    <h3 class="card-label text-uppercase">ADD {{ $custom_title }}</h3>
                </div>
            </div>

            <!--begin::Form-->
            <form id="frmAddSport" method="POST" action="{{ route('admin.sports.store') }}" enctype="multipart/form-data">
                @csrf
                <div class="card-body">
                    {{-- Name --}}
                    <div class="form-group">
                        <label for="name"> Sports Name </label>
                        <input type="text" class="form-control @error('name') is-invalid @enderror" id="name"
                            name="name" value="{{ old('name') }}" placeholder="Enter Sports name" autocomplete="name"
                            spellcheck="false" autocapitalize="sentences" tabindex="0" autofocus />
                        @if ($errors->has('name'))
                            <span class="text-danger">
                                <strong class="form-text">{{ $errors->first('name') }}</strong>
                            </span>
                        @endif
                    </div>

                    {{-- Logo --}}
                    <div class="form-group">
                        <label for="logo">Logo</label>
                        <div class="custom-file">
                            <input type="file" class="custom-file-input" id="logo" name="logo" accept="image/*"
                                tabindex="0" />
                            <label class="custom-file-label @error('logo') is-invalid @enderror" for="customFile">Choose
                                file</label>
                            @if ($errors->has('logo'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('logo') }}</strong>
                                </span>
                            @endif
                        </div>
                    </div>

                    {{-- is Popular --}}
                    <div class="form-group row">
                        <div class="col-9 col-form-label">
                            <div class="checkbox-inline">
                                <label class="checkbox checkbox-primary">
                                    <input type="checkbox" name="is_popular"/>
                                    <span></span>
                                    Is it popular?
                                </label>
                            </div>
                            <span class="form-text text-muted">Please check the box if the game is popular.</span>
                    </div>
                </div>
                <div class="card-footer">
                    <button type="submit" class="btn btn-primary mr-2"> Add {{ $custom_title }}</button>
                    <a href="{{ route('admin.sports.index') }}" class="btn btn-secondary">Cancel</a>
                </div>
            </form>
            <!--end::Form-->
        </div>
    </div>
@endsection

@push('extra-js')
    <script>
        $(document).ready(function() {
            $("#frmAddSport").validate({
                rules: {
                    name: {
                        required: true,
                        not_empty: true,
                        alphaonly: true,
                        minlength: 3,
                        maxlength: 50,
                    },
                    logo: {
                        required: true,
                        extension: "jpg|jpeg|png",
                    },
                },
                messages: {
                    name: {
                        required: "@lang('validation.required', ['attribute' => 'sports name'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'sports name'])",
                        alphaonly: "@lang('validation.alphaonly', ['attribute' => 'sports name'])",
                        minlength: "@lang('validation.min.string', ['attribute' => 'sports name', 'min' => 3])",
                        maxlength: "@lang('validation.min.string', ['attribute' => 'sports name', 'min' => 50])",
                    },
                    logo: {
                        required: "@lang('validation.required', ['attribute' => 'logo'])",
                        extension: "@lang('validation.mimetypes', ['attribute' => 'sports logo', 'value' => 'jpg|png|jpeg'])",
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
            $('#frmAddSport').submit(function() {
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
