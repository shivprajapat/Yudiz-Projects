@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('sports_update', $sport->id) !!}
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
            <form id="frmEditUser" method="POST" action="{{ route('admin.sports.update', $sport->id) }}"
                enctype="multipart/form-data">
                @csrf
                @method('put')
                <div class="card-body">

                    @if ($errors->has('error'))
                        <div class="alert alert-danger">
                            {{ $errors->first('error') }}
                        </div>
                    @endif

                    {{-- Sports Name --}}
                    <div class="form-group">
                        <label for="name">{!! $mend_sign !!}Sports Name:</label>
                        <input type="text" class="form-control @error('name') is-invalid @enderror" id="name"
                            name="name" value="{{ old('name') != null ? old('name') : $sport->name }}"
                            placeholder="Enter sports name" autocomplete="name" spellcheck="false"
                            autocapitalize="sentences" tabindex="0" autofocus />
                        @if ($errors->has('name'))
                            <span class="text-danger">
                                <strong class="form-text">{{ $errors->first('name') }}</strong>
                            </span>
                        @endif
                    </div>

                    {{-- Logo --}}
                    <div class="form-group">
                        <label for="logo">{!! $mend_sign !!}Logo</label>
                        <div class="custom-file">
                            <input type="file" class="custom-file-input" id="logo" name="logo" tabindex="0"
                                accept="image/*" />
                            <label class="custom-file-label @error('logo') is-invalid @enderror" for="customFile">Choose
                                file</label>
                            @if ($errors->has('logo'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('logo') }}</strong>
                                </span>
                            @endif
                        </div>
                    </div>
                    @if ($sport->logo)
                        <div class="symbol symbol-120 mr-5">
                            <div class="symbol-label" style="background-image:url({{ asset('storage/' . $sport->logo) }})">
                                {{-- Custom css added .symbol div a --}}
                                <a href="#" class="btn btn-icon btn-light btn-hover-danger remove-img"
                                    id="kt_quick_user_close" style="width: 18px; height: 18px;">
                                    <i class="ki ki-close icon-xs text-muted"></i>
                                </a>
                            </div>
                        </div>
                    @endif
                    @php
                        use App\Enums\SportsPopularityEnums;
                    @endphp
                    {{-- is Popular --}}
                    <div class="form-group row mt-2">
                        <div class="col-9 col-form-label">
                            <div class="checkbox-inline">
                                <label class="checkbox checkbox-primary">
                                    <input type="checkbox" name="is_popular"
                                        {{ $sport->is_popular == SportsPopularityEnums::POPULAR->value ? 'checked' : '' }} />
                                    <span></span>
                                    Is it popular?
                                </label>
                            </div>
                            <span class="form-text text-muted">Please check the box if the game is popular.</span>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button type="submit" class="btn btn-primary mr-2">Update {{ $custom_title }}</button>
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
            $("#frmEditUser").validate({
                rules: {
                    name: {
                        required: true,
                        not_empty: true,
                        alphaonly: true,
                        minlength: 3,
                        maxlength: 50,
                    },
                    logo: {
                        required: function(element) {
                            return $('#remove_image').val() == 'removed';
                        },
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
                        extension: "@lang('validation.mimetypes', ['attribute' => 'logo', 'value' => 'jpg|png|jpeg'])",
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
                    $(element).siblings('label').removeClass('text-danger');
                },
                errorPlacement: function(error, element) {
                    if (element.attr("data-error-container")) {
                        error.appendTo(element.attr("data-error-container"));
                    } else {
                        error.insertAfter(element);
                    }
                }
            });
            $('#frmEditUser').submit(function() {
                if ($(this).valid()) {
                    addOverlay();
                    $("input[type=submit], input[type=button], button[type=submit]").prop("disabled",
                        "disabled");
                    return true;
                } else {
                    return false;
                }
            });

            //remove the imaegs
            $(".remove-img").on('click', function(e) {
                e.preventDefault();
                $(this).parents(".symbol").remove();
                $('#frmEditUser').append(
                    '<input type="hidden" name="remove_logo" id="remove_image" value="removed">'
                );
            });
        });
    </script>
@endpush
