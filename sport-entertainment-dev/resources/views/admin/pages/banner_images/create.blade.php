@extends('admin.layouts.app')
@push('breadcrumb')
    {!! Breadcrumbs::render('banner-images_create') !!}
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
            <form id="frmAddBannerImage" method="POST" action="{{ route('admin.banner-images.store') }}"
                enctype="multipart/form-data">
                @csrf
                <div class="card-body">
                    {{-- Banner Image  --}}
                    <div class="form-group">
                        <label for="banner_image">{!! $mend_sign !!}Image</label>
                        <div class="custom-file">
                            <input type="file" class="custom-file-input" id="banner_image" name="banner_image"
                                tabindex="0" accept="image/*" />
                            <label class="custom-file-label @error('banner_image') is-invalid @enderror"
                                for="customFile">Choose
                                file</label>
                            @if ($errors->has('banner_image'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('banner_image') }}</strong>
                                </span>
                            @endif
                        </div>
                    </div>

                    {{-- Banner Type --}}
                    <div class="form-group">
                        <label for="banner_type">{!! $mend_sign !!}Select Banner With</label>
                        <select class="form-control selectpicker" id="banner_type" name="banner_type"
                            value="{{ old('banner_type') }}" autocomplete="banner_type" spellcheck="false"
                            autocapitalize="sentences" tabindex="0" autofocus />
                        <option value="">Select Option</option>
                        <option value="url" {{ in_array('url', explode(',', old('banner_type', '')))  ? 'selected' : '' }}>Redirection URL</option>
                        <option value="id" {{ in_array('id', explode(',', old('banner_type', '')))  ? 'selected' : '' }}>Redirection ID</option>
                        </select>
                        @if ($errors->has('banner_type'))
                            <span class="text-danger">
                                <strong class="form-text">{{ $errors->first('banner_type') }}</strong>
                            </span>
                        @endif
                    </div>

                    {{-- Redirection Url --}}
                    <div class="form-group div_hide" id="redirect_url" style="display:none">
                        <label for="redirect_url"> {!! $mend_sign !!}Redirection URL</label>
                        <input type="text" class="form-control @error('redirect_url') is-invalid @enderror type_disabled"
                            id="input_redirect_url" name="redirect_url" value="{{ old('redirect_url') }}"
                            placeholder="Enter rediorection url " autocomplete="redirect_url" spellcheck="false"
                            autocapitalize="sentences" tabindex="0" autofocus />
                        @if ($errors->has('redirect_url'))
                            <span class="text-danger">
                                <strong class="form-text">{{ $errors->first('redirect_url') }}</strong>
                            </span>
                        @endif
                    </div>

                    {{-- Redirection ID --}}
                    <div class="form-group div_hide" id="redirect_id" style="display:none">
                        <label for="coaching_centre_id"> {!! $mend_sign !!}Redirection Id</label>
                        <select class="form-control selectpicker type_disabled" id="input_redirect_id" title="Select Option"
                            name="coaching_centre_id" value="{{ old('coaching_centre_id') }}"
                            autocomplete="coaching_centre_id" spellcheck="false" autocapitalize="sentences" tabindex="0"
                            autofocus />
                        @foreach ($coaching_centres as $coaching_centre)
                            <option value="{{ $coaching_centre->id }}">{{ $coaching_centre->coaching_name }}</option>
                        @endforeach

                        </select>
                        @if ($errors->has('coaching_centre_id'))
                            <span class="text-danger">
                                <strong class="form-text">{{ $errors->first('coaching_centre_id') }}</strong>
                            </span>
                        @endif
                    </div>

                    {{-- Notes --}}
                    <div class="form-group">
                        <label for="banner_note">Note</label>
                        <input type="text" class="form-control @error('banner_note') is-invalid @enderror"
                            id="banner_note" name="banner_note" value="{{ old('banner_note') }}"
                            placeholder="Enter banner note" autocomplete="banner_note" spellcheck="false"
                            autocapitalize="sentences" tabindex="0" autofocus />
                        @if ($errors->has('banner_note'))
                            <span class="text-danger">
                                <strong class="form-text">{{ $errors->first('banner_note') }}</strong>
                            </span>
                        @endif
                    </div>
                </div>
                <div class="card-footer">
                    <button type="submit" class="btn btn-primary mr-2"> Add {{ $custom_title }}</button>
                    <a href="{{ route('admin.banner-images.index') }}" class="btn btn-secondary">Cancel</a>
                </div>
            </form>
            <!--end::Form-->
        </div>
    </div>
@endsection

@push('extra-js')
    <script>
        $(document).ready(function() {
          var test =   $('select#banner_type').val();
            $('#redirect_' + test).show();
            $("#frmAddBannerImage").validate({
                rules: {
                    banner_image: {
                        required: true,
                        extension: "jpg|jpeg|png",
                    },
                    banner_type: {
                        required: true,
                    },
                    redirect_url: {
                        required: true,
                        // regex: '/^(http|https)?:\/\/[a-zA-Z0-9-\.]+\.[a-z]{2,4}/',
                    },
                    coaching_centre_id: {
                        required: true,
                    },
                    banner_note: {
                        required: false,
                        minlength: 3,
                        maxlength: 255,
                    }
                },
                messages: {
                    banner_image: {
                        required: "@lang('validation.required', ['attribute' => 'Banner image'])",
                        extension: "@lang('validation.mimetypes', ['attribute' => 'banner image', 'value' => 'jpg|png|jpeg'])",
                    },
                    banner_type: {
                        required: "@lang('validation.required', ['attribute' => 'Banner with'])",
                    },
                    redirect_url: {
                        required: "@lang('validation.required', ['attribute' => 'Redirection Url'])",
                        // regex: "@lang('validation.regex', ['attribute' => 'Redirection Url'])",
                    },
                    coaching_centre_id: {
                        required: "@lang('validation.required', ['attribute' => 'Redirection ID'])",
                    },
                    banner_note: {
                        minlength: "@lang('validation.min.string', ['attribute' => 'Banner notes', 'min' => 3])",
                        maxlength: "@lang('validation.min.string', ['attribute' => 'Banner notes', 'min' => 255])",
                    }
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
                    if (element.is('select')) {
                        error.insertAfter(element.next());

                    } else if (element.attr("data-error-container")) {
                        error.appendTo(element.attr("data-error-container"));
                    } else {
                        error.insertAfter(element);
                    }
                }
            });
            $('#frmAddBannerImage').submit(function() {
                if ($(this).valid()) {
                    addOverlay();
                    $("input[type=submit], input[type=button], button[type=submit]").prop("disabled",
                        "disabled");
                    return true;
                } else {
                    return false;
                }
            });
            $(document).on('change','select#banner_type', function() {
                var demovalue = $(this).val();
                $('div.div_hide').hide();
                $('.type_disabled').prop('disabled', true);

                $('#redirect_' + demovalue).show();
                $('#input_redirect_' + demovalue).prop('disabled', false);
            });

        });
    </script>
@endpush
