@extends('admin.layouts.app')
@push('breadcrumb')
    {!! Breadcrumbs::render('countries_update', $country->id) !!}
@endpush

@section('content')
<div class="container">
    <div class="card card-custom">
        <div class="card-header">
            <div class="card-title">
                <span class="card-icon">
                    <i class="{{$icon}} text-primary"></i>
                </span>
                <h3 class="card-label text-uppercase">Edit {{ $custom_title }}</h3>
            </div>
        </div>

        <!--begin::Form-->
        <form id="frmEditCountry" method="POST" action="{{ route('admin.countries.update', $country->id) }}" enctype="multipart/form-data">
            @csrf
            @method('put')
            <div class="card-body">

                {{--  Name --}}
                <div class="form-group">
                    <label for="name">Name{!!$mend_sign!!}</label>
                    <input type="text" class="form-control @error('name') is-invalid @enderror" id="name" name="name" value="{{ old('name') != null ? old('name') : $country->name }}" placeholder="Enter name" autocomplete="name" spellcheck="false" autocapitalize="sentences" tabindex="0" autofocus />
                    @if ($errors->has('name'))
                        <span class="help-block">
                            <strong class="form-text">{{ $errors->first('name') }}</strong>
                        </span>
                    @endif
                </div>

                {{--Code --}}
                <div class="form-group">
                    <label for="code">Code {!!$mend_sign!!}</label>
                    <input type="text" class="form-control @error('code') is-invalid @enderror" id="code" name="code" value="{{ old('code') != null ? old('code') : $country->code }}" placeholder="Enter code" autocomplete="code" spellcheck="false" autocapitalize="sentences" tabindex="0" autofocus />
                    @if ($errors->has('code'))
                        <span class="help-block">
                            <strong class="form-text">{{ $errors->first('code') }}</strong>
                        </span>
                    @endif
                </div>

                {{--PhoneCode --}}
                <div class="form-group">
                    <label for="phonecode">Phonecode {!!$mend_sign!!}</label>
                    <input type="text" class="form-control @error('phonecode') is-invalid @enderror" id="phonecode" name="phonecode" value="{{ old('phonecode') != null ? old('phonecode') : $country->phonecode }}" placeholder="Enter phonecode" autocomplete="phonecode" spellcheck="false" autocapitalize="sentences" tabindex="0" autofocus />
                    @if ($errors->has('phonecode'))
                        <span class="help-block">
                            <strong class="form-text">{{ $errors->first('phonecode') }}</strong>
                        </span>
                    @endif
                </div>

            </div>
            <div class="card-footer">
                <button type="submit" class="btn btn-primary mr-2">Update {{ $custom_title }}</button>
                <a href="{{ route('admin.countries.index') }}" class="btn btn-secondary">Cancel</a>
            </div>
        </form>
        <!--end::Form-->
    </div>
</div>
@endsection

@push('extra-js')
<script>
$(document).ready(function () {
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
                maxlength:5,
            },
            phonecode: {
                required: true,
                not_empty: true,
                maxlength: 5,
            },
        },
        messages: {
            name: {
                required: "@lang('validation.required',['attribute'=>'name'])",
                not_empty: "@lang('validation.not_empty',['attribute'=>'name'])",
                minlength:"@lang('validation.min.string',['attribute'=>'name','min'=>3])",
            },
            code: {
                required: "@lang('validation.required',['attribute'=>'code'])",
                not_empty: "@lang('validation.not_empty',['attribute'=>'code'])",
                maxlength:"@lang('validation.max.string',['attribute'=>'code','max'=>5])",
            },
            phonecode: {
                required: "@lang('validation.required',['attribute'=>'phonecode'])",
                not_empty: "@lang('validation.not_empty',['attribute'=>'phonecode'])",
                maxlength:"@lang('validation.max.string',['attribute'=>'phonecode','max'=>5])",
            },
        },
        errorClass: 'invalid-feedback',
        errorElement: 'span',
        highlight: function (element) {
            $(element).addClass('is-invalid');
            $(element).siblings('label').addClass('text-danger'); // For Label
        },
        unhighlight: function (element) {
            $(element).removeClass('is-invalid');
            $(element).siblings('label').removeClass('text-danger');
        },
        errorPlacement: function (error, element) {
            if (element.attr("data-error-container")) {
                error.appendTo(element.attr("data-error-container"));
            } else {
                error.insertAfter(element);
            }
        }
    });
    $('#frmEditCountry').submit(function () {
        if ($(this).valid()) {
            addOverlay();
            $("input[type=submit], input[type=button], button[type=submit]").prop("disabled", "disabled");
            return true;
        } else {
            return false;
        }
    });
});
</script>
@endpush
