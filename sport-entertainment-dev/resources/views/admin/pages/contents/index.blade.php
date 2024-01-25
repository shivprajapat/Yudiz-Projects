@extends('admin.layouts.app')
@push('breadcrumb')
    {!! Breadcrumbs::render('contents') !!}
@endpush
@push('extra-css')
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/plugins/custom/datatables/datatables.bundle.css') }}" />
    <style>
        .custom-border {
            border: 0.1px solid #eeeef3;
            border-bottom: 0px;
            border-radius: 5px;
            cursor: pointer;
        }
    </style>
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
            <div class="card-body">
                <ul class="nav nav-tabs mb-5" role="tablist">
                    @foreach ($contents as $key => $content)
                    <li class="nav-item custom-border">
                        <a class="nav-link tab-change" data-toggle="tab" id="cahnge_tab{{$key}}" data-value="{{$key}}">
                           {{ $content->slug }}</a>
                    </li>
                    @endforeach
                </ul>
                <!--begin::Form-->
                @foreach ($contents as $key => $content)
                <form id="frmEditCountry" method="POST" action="{{route('admin.contents.update', $content->id) }}" type="multipart/form-data" class="change_form{{$key}}" data-id="{{$content->id}}" style="display:none">
                    @csrf
                    @method('put')
                    <div class="form-group mt-10">
                        @if($content->slug == "commission")
                        <label for="content">{!! $mend_sign !!} Admin Commission</label>
                        @else
                        <label for="content">{!! $mend_sign !!} Add Convenience Fees</label>
                        @endif
                        <input type="text" class="form-control @error('content') is-invalid @enderror" id="content"
                            name="content" value="{{ old('content') != null ? old('content') : $content->content }}" placeholder="Enter value"
                            autocomplete="content" spellcheck="false" autocapitalize="sentences" tabindex="0" autofocus />
                        @if ($errors->has('content'))
                            <span class="help-block">
                                <strong class="form-text">{{ $errors->first('content') }}</strong>
                            </span>
                        @endif
                    </div>
                    @if($content->slug == "commission")
                    <span class="text-muted"> % of commission will be same for all the coaching centres.</span>
                    @else
                    <span class="text-muted"> Conveninece fees will be displayed to the end user in the booking summary screen so the end user will see the batch price and
                         on top of it end user  can see % convenience fees.
                    </span>
                    @endif
                    <div class="card-footer mt-10">
                        <button type="submit" class="btn btn-primary mr-2">Save</button>
                        <a href="{{ route('admin.countries.index') }}" class="btn btn-secondary">Cancel</a>
                    </div>
                </form>
                @endforeach
            </div>

            <!--end::Form-->
        </div>
    </div>
@endsection

@push('extra-js')
    <script>
        $(document).ready(function() {
            $("#frmEditCountry").validate({
                rules: {
                    name: {
                        required: true,
                        not_empty: true,
                        minlength: 3,
                    },
                    code: {
                        required: true,
                        not_empty: true,
                        maxlength: 5,
                    },
                    phonecode: {
                        required: true,
                        not_empty: true,
                        maxlength: 5,
                    },
                },
                messages: {
                    name: {
                        required: "@lang('validation.required', ['attribute' => 'name'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'name'])",
                        minlength: "@lang('validation.min.string', ['attribute' => 'name', 'min' => 3])",
                    },
                    code: {
                        required: "@lang('validation.required', ['attribute' => 'code'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'code'])",
                        maxlength: "@lang('validation.max.string', ['attribute' => 'code', 'max' => 5])",
                    },
                    phonecode: {
                        required: "@lang('validation.required', ['attribute' => 'phonecode'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'phonecode'])",
                        maxlength: "@lang('validation.max.string', ['attribute' => 'phonecode', 'max' => 5])",
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
            $('#frmEditCountry').submit(function() {
                if ($(this).valid()) {
                    addOverlay();
                    $("input[type=submit], input[type=button], button[type=submit]").prop("disabled",
                        "disabled");
                    return true;
                } else {
                    return false;
                }
            });

            $('#cahnge_tab0').addClass('active');
            $('.change_form0').css("display","block");

            $('.tab-change').click(function() {
               var key = $(this).data('value');
               var element = $('.change_form'+ key);
               element.css("display","block");
               element.siblings().not('.nav-tabs').css("display", "none");
            });

        });
    </script>
@endpush
