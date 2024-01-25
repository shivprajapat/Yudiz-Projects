@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('faqs_create') !!}
@endpush

@section('content')
    <div class="container">
        <div class="card card-custom">
            <div class="card-header">
                <div class="card-title">
                    <span class="card-icon">
                        <i class="fas fa-question-circle text-primary"></i>
                    </span>
                    <h3 class="card-label text-uppercase">ADD {{ $custom_title }}</h3>
                </div>
            </div>

            <!--begin::Form-->
            <form id="frmAddFaq" method="POST" action="{{ route('admin.faqs.store') }}" enctype="multipart/form-data">
                @csrf
                <div class="card-body">

                    {{-- Faq Type --}}
                    <div class="form-group">
                        <label for="faq_type">{!! $mend_sign !!} User Type</label>
                        <select class="form-control selectpicker" id="faq_type" name="faq_type" title="Select User Type"
                            value="{{ old('faq_type') }}" autocomplete="faq_type" spellcheck="false"
                            autocapitalize="sentences" tabindex="0" autofocus />
                        @php
                            use App\Enums\FaqTypeEnums;
                        @endphp
                        <option value="{{ FaqTypeEnums::END_USER }}">User</option>
                        <option value="{{ FaqTypeEnums::COACHING_CENTRE }}">Coaching Centre</option>
                        </select>
                        @if ($errors->has('faq_type'))
                            <span class="text-danger">
                                <strong class="form-text">{{ $errors->first('faq_type') }}</strong>
                            </span>
                        @endif
                    </div>

                    {{-- Title --}}
                    <div class="form-group">
                        <label for="title">{!! $mend_sign !!}Title:</label>
                        <input type="text" class="form-control @error('title') is-invalid @enderror" id="title"
                            name="title" value="{{ old('title') }}" placeholder="Enter Title" autocomplete="title"
                            spellcheck="false" autocapitalize="sentences" tabindex="0" autofocus />
                        @if ($errors->has('title'))
                            <span class="text-danger">
                                <strong class="form-text">{{ $errors->first('title') }}</strong>
                            </span>
                        @endif
                    </div>

                    {{-- Description --}}
                    <div class="form-group">
                        <label for="title">{!! $mend_sign !!}Description:</label>
                        <textarea class="form-control @error('description') is-invalid @enderror" id="description" rows="5"
                            name="description" placeholder="Enter Description" autocomplete="description" spellcheck="false"
                            autocapitalize="sentences" tabindex="0" autofocus>{{ old('description') }}</textarea>
                        @if ($errors->has('description'))
                            <span class="text-danger">
                                <strong class="form-text">{{ $errors->first('description') }}</strong>
                            </span>
                        @endif
                    </div>
                </div>
                <div class="card-footer">
                    <button type="submit" class="btn btn-primary mr-2 text-uppercase"> Add {{ $custom_title }}</button>
                    <a href="{{ route('admin.faqs.index') }}" class="btn btn-secondary text-uppercase">Cancel</a>
                </div>
            </form>
            <!--end::Form-->
        </div>
    </div>
@endsection

@push('extra-js')
    <script>
        $(document).ready(function() {
            $("#frmAddFaq").validate({
                rules: {
                    faq_type: {
                        required: true,
                        not_empty: true,
                    },
                    title: {
                        required: true,
                        not_empty: true,
                        minlength: 3,
                    },
                    description: {
                        required: true,
                        not_empty: true,
                        minlength: 3,
                    },
                },
                messages: {
                    faq_type: {
                        required: "@lang('validation.required', ['attribute' => 'User Type'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'User Type'])",
                    },
                    title: {
                        required: "@lang('validation.required', ['attribute' => 'title'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'title'])",
                        minlength: "@lang('validation.min.string', ['attribute' => 'title', 'min' => 3])",
                    },
                    description: {
                        required: "@lang('validation.required', ['attribute' => 'description'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'description'])",
                        minlength: "@lang('validation.min.string', ['attribute' => 'description', 'min' => 3])",
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
                    if (element.is('select')) {
                        error.insertAfter(element.next());
                    } else if (element.attr("data-error-container")) {
                        error.appendTo(element.attr("data-error-container"));
                    } else {
                        error.insertAfter(element);
                    }
                }
            });
            $('#frmAddFaq').submit(function() {
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
