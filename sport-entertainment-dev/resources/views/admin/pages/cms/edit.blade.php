@extends('admin.layouts.app')
@push('breadcrumb')
    {!! Breadcrumbs::render('cms_update', $page->id) !!}
@endpush

@section('content')
    <div class="container">
        <div class="card card-custom">
            <div class="card-header">
                <div class="card-title">
                    <span class="card-icon">
                        <i class="{{ $icon }} text-primary"></i>
                    </span>
                    <h3 class="card-label text-uppercase">Edit {{ $custom_title }}</h3>
                </div>
            </div>

            <!--begin::Form-->
            <form id="frmEditcms" method="POST" action="{{ route('admin.pages.update', $page->id) }}"
                enctype="multipart/form-data">
                @csrf
                @method('put')
                <div class="card-body">

                    {{--  Name --}}
                    <div class="form-group">
                        <label for="title">Title{!! $mend_sign !!}</label>
                        <input type="text" class="form-control @error('title') is-invalid @enderror" id="title"
                            name="title" value="{{ old('title') != null ? old('title') : $page->title }}"
                            placeholder="Enter title" autocomplete="title" spellcheck="false" autocapitalize="sentences"
                            tabindex="0" autofocus />
                        @if ($errors->has('title'))
                            <span class="help-block">
                                <strong class="form-text">{{ $errors->first('title') }}</strong>
                            </span>
                        @endif
                    </div>

                    {{-- Description --}}
                    <div class="form-group">
                        <label for="description">Description{!! $mend_sign !!}</label>
                        <textarea class="form-control @error('description') is-invalid @enderror" id="description" name="description"
                            placeholder="Enter description" autocomplete="description" spellcheck="true">{{ old('description') != null ? old('description') : $page->description }}</textarea>
                        @if ($errors->has('description'))
                            <span class="text-danger">
                                <strong class="form-text">{{ $errors->first('description') }}</strong>
                            </span>
                        @endif
                    </div>

                    {{-- Image --}}
                    <div class="form-group">
                        <label for="image">Image</label>
                        <div class="custom-file">
                            <input type="file" class="custom-file-input" id="image" name="image" tabindex="0" />
                            <label class="custom-file-label @error('image') is-invalid @enderror" for="customFile">Choose
                                file</label>
                            @if ($errors->has('image'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('image') }}</strong>
                                </span>
                            @endif
                        </div>
                    </div>
                    @if ($page->file)
                        <div class="symbol symbol-120 mr-5">
                            <div class="symbol-label" style="background-image:url({{ generate_url($page->file) }})">
                                {{-- Custom css added .symbol div a --}}
                                <a href="#" class="btn btn-icon btn-light btn-hover-danger remove-img"
                                    id="kt_quick_user_close" style="width: 18px; height: 18px;">
                                    <i class="ki ki-close icon-xs text-muted"></i>
                                </a>
                            </div><br>
                        </div>
                    @endif

                </div>
                <div class="card-footer">
                    <button type="submit" class="btn btn-primary mr-2">Update {{ $custom_title }}</button>
                    <a href="{{ route('admin.pages.index') }}" class="btn btn-secondary">Cancel</a>
                </div>
            </form>
            <!--end::Form-->
        </div>
    </div>
@endsection

@push('extra-js')
    <script type="text/javascript">
        var summernoteImageUpload = '{{ route('admin.summernote.imageUpload') }}';
        var summernoteMediaDelete = '{{ route('admin.summernote.mediaDelete') }}';
    </script>
    <script src="{{ asset('assets/admin/plugins/summernote/summernotecustom.js') }}"></script>
    <script>
        $(document).ready(function() {
            var summernoteElement = $('#description');
            var imagePath = 'summernote/cms/image';
            summernoteElement.summernote({
                height: 300,
                callbacks: {
                    onImageUpload: function(files, editor, welEditable) {
                        for (var i = files.length - 1; i >= 0; i--) {
                            sendFile(files[i], this, imagePath);
                        }
                    },
                    onMediaDelete: function(target) {
                        deleteFile(target[0].src);
                    },
                }
            });
            $("#frmEditcms").validate({
                rules: {
                    title: {
                        required: true,
                        not_empty: true,
                        minlength: 3,
                        // remote: {
                        //     url: "{{ route('admin.check.title') }}",
                        //     type: "post",
                        //     data: {
                        //         _token: "{{ csrf_token() }}",
                        //         id: "{{ $page->id }}",
                        //         type: "cms",
                        //     }
                        // },
                    },
                    url: {
                        required: true,
                        not_empty: true,
                        isurl: true,
                    },
                    image: {
                        required: false,
                        extension: "jpg|jpeg|png",
                    },
                },
                messages: {
                    title: {
                        required: "@lang('validation.required', ['attribute' => 'title'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'title'])",
                        minlength: "@lang('validation.min.string', ['attribute' => 'title', 'min' => 3])",
                        remote: "@lang('validation.unique', ['attribute' => 'title'])",
                    },
                    url: {
                        required: "@lang('validation.required', ['attribute' => 'url'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'url'])",
                    },
                    image: {
                        required: "@lang('validation.required', ['attribute' => 'image'])",
                        extension: "@lang('validation.mimetypes', ['attribute' => 'image', 'value' => 'jpg|png|jpeg'])",
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
            $('#frmEditcms').submit(function(e) {
                if (summernoteElement.summernote('isEmpty')) {
                    $('#description-error').remove();
                    $('<span class="text-danger" id="description-error"><strong class="form-text">The description field is required.</strong></span>')
                        .insertAfter('.note-editor');
                    e.preventDefault();
                    return false;
                } else {
                    if ($(this).valid()) {
                        addOverlay();
                        $("input[type=submit], input[type=button], button[type=submit]").prop("disabled",
                            "disabled");
                        return true;
                    } else {
                        return false;
                    }
                }
            });

            //tell the validator to ignore Summernote elements
            $('form').each(function() {
                if ($(this).data('validator'))
                    $(this).data('validator').settings.ignore = ".note-editor *";
            });
            //remove the imaegs
            $(".remove-img").on('click', function(e) {
                e.preventDefault();
                $(this).parents(".symbol").remove();
                $('#frmEditcms').append(
                    '<input type="hidden" name="remove_image" id="remove_image" value="removed">'
                );
            });
        });
    </script>
@endpush
