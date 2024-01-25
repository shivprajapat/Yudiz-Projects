@extends('admin.layouts.app')
@push('breadcrumb')
    {!! Breadcrumbs::render('cities_update', $city->id) !!}
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
        <form id="frmEditCountry" method="POST" action="{{ route('admin.cities.update', $city->id) }}" enctype="multipart/form-data">
            @csrf
            @method('put')
            <div class="card-body">

                {{--  Name --}}
                <div class="form-group">
                    <label for="name">Name{!!$mend_sign!!}</label>
                    <input type="text" class="form-control @error('name') is-invalid @enderror" id="name" name="name" value="{{ old('name') != null ? old('name') : $city->name }}" placeholder="Enter name" autocomplete="name" spellcheck="false" autocapitalize="sentences" tabindex="0" autofocus />
                    @if ($errors->has('name'))
                        <span class="help-block">
                            <strong class="form-text">{{ $errors->first('name') }}</strong>
                        </span>
                    @endif
                </div>

                {{-- Country --}}
                <div class="form-group">
                    <label for="state_id">State Name{!!$mend_sign!!}</label>
                    <select id="state_id" class="form-control" name="state_id">
                        <option></option>
                        @foreach($states as $state)
                        <option value="{{ $state->id }}" {{ $state->id == $city->state->id ? 'selected' : '' }}> {{ $state->name }} {{ $state->country->name }}</option>
                        @endforeach
                    </select>
                    @if ($errors->has('state_id'))
                        <span class="help-block">
                            <strong class="form-text">{{ $errors->first('state_id') }}</strong>
                        </span>
                    @endif
                </div>


            </div>
            <div class="card-footer">
                <button type="submit" class="btn btn-primary mr-2">Update {{ $custom_title }}</button>
                <a href="{{ route('admin.cities.index') }}" class="btn btn-secondary">Cancel</a>
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
           state_id: {
                required: true,
                not_empty: true,
            },
        },
        messages: {
            name: {
                required: "@lang('validation.required',['attribute'=>'name'])",
                not_empty: "@lang('validation.not_empty',['attribute'=>'name'])",
                minlength:"@lang('validation.min.string',['attribute'=>'name','min'=>3])",
            },
            state_id: {
                required: "@lang('validation.required',['attribute'=>'state name'])",
                not_empty: "@lang('validation.not_empty',['attribute'=>'state name'])",
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
