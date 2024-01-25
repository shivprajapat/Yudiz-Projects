@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('push-notifications_create') !!}
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
            <form id="frmAddNotification" method="POST" action="{{ route('admin.push-notifications.store') }}"
                enctype="multipart/form-data">
                @csrf
                <div class="card-body">

                    {{-- Faq Type --}}
                    <div class="form-group">
                        <label for="user_type">{!! $mend_sign !!} User Type</label>
                        <select class="form-control selectpicker" id="user_type" name="user_type" title="Select User Type"
                            value="{{ old('user_type') }}" autocomplete="user_type" spellcheck="false"
                            autocapitalize="sentences" tabindex="0" autofocus />
                        @php
                            use App\Enums\FaqTypeEnums;
                        @endphp
                        <option value="{{ FaqTypeEnums::END_USER }}">User</option>
                        <option value="{{ FaqTypeEnums::COACHING_CENTRE }}">Coaching Centre</option>
                        </select>
                        @if ($errors->has('user_type'))
                            <span class="text-danger">
                                <strong class="form-text">{{ $errors->first('user_type') }}</strong>
                            </span>
                        @endif
                    </div>

                    {{-- subject --}}
                    <div class="form-group">
                        <label for="subject">{!! $mend_sign !!}subject:</label>
                        <input type="text" class="form-control @error('subject') is-invalid @enderror" id="subject"
                            name="subject" value="{{ old('subject') }}" placeholder="Enter subject" autocomplete="subject"
                            spellcheck="false" autocapitalize="sentences" tabindex="0" autofocus />
                        @if ($errors->has('subject'))
                            <span class="text-danger">
                                <strong class="form-text">{{ $errors->first('subject') }}</strong>
                            </span>
                        @endif
                    </div>

                    {{-- message --}}
                    <div class="form-group">
                        <label for="message">{!! $mend_sign !!}message:</label>
                        <textarea class="form-control @error('message') is-invalid @enderror" id="message" rows="5" name="message"
                            placeholder="Enter message" autocomplete="message" spellcheck="false" autocapitalize="sentences" tabindex="0"
                            autofocus>{{ old('message') }}</textarea>
                        @if ($errors->has('message'))
                            <span class="text-danger">
                                <strong class="form-text">{{ $errors->first('message') }}</strong>
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
            $("#frmAddNotification").validate({
                rules: {
                    user_type: {
                        required: true,
                        not_empty: true,
                    },
                    title: {
                        required: true,
                        not_empty: true,
                        minlength: 3,
                    },
                    message: {
                        required: true,
                        not_empty: true,
                        minlength: 3,
                    },
                },
                messages: {
                    user_type: {
                        required: "@lang('validation.required', ['attribute' => 'User Type'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'User Type'])",
                    },
                    title: {
                        required: "@lang('validation.required', ['attribute' => 'title'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'title'])",
                        minlength: "@lang('validation.min.string', ['attribute' => 'title', 'min' => 3])",
                    },
                    message: {
                        required: "@lang('validation.required', ['attribute' => 'message'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'message'])",
                        minlength: "@lang('validation.min.string', ['attribute' => 'message', 'min' => 3])",
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
            $('#frmAddNotification').submit(function() {
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
