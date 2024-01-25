<?php $required = ($setting->required == 'y' ? ' required ' : '');?>
@switch($setting->type)
    @case('textarea')
        <div class="form-group">
            <label  for="{{$setting->id}}">{{ $setting->label}} <span class="text-danger">*</span></label>
            <div class="input-icon">
                <textarea type="text" class="form-control" placeholder="{{ $setting->hint }}" name="{{$setting->id}}" id="{{$setting->id}}" {{$required}}>{{$setting->value}}</textarea>
                    <span>
                        <i class="{{$setting->icon}}"></i>
                    </span>
            </div>
        </div>
        @break
    @case('radio')
        <?php $options = explode(',', $setting->options);?>
        <div class="form-group form-md-line-input">
            <label class="col-lg-2 col-form-label text-right" for="form_control_1">{{$setting->label}}</label>
            <div class="col-lg-3">
                <div class="radio-inline">
                    @foreach($options as $key=>$value)
                    <label class="radio radio-solid">
                    <input type="radio" <?php echo $value == $setting->value ? 'checked' : '' ?> id="radio53_{{$key}}" data-error-container="#privacy_error_{{$setting->id}}"  value="{{$value}}" name="{{$setting->id}}" {{$required}}>
                    <span></span>{{ $value }}</label>
                    @endforeach
                </div>
            </div>
        </div>
        @break
    @case('file')
        {{-- <div class="form-group">
            <label for="{{$setting->id}}">{{$setting->label}} <span class="text-danger">*</span></label>
            <div class="input-icon">
                <input type="{{$setting->type}}" class="custom-file-input" name="{{$setting->id}}" placeholder="{{$setting->label}}" {{$required}}/>
                <label class="custom-file-label @error($setting->label) is-invalid @enderror" for="customFile">Choose file</label>
                <span class="input-group-prepend">
                    <i class="{{$setting->icon}}"></i>
                </span>
            </div>
             @if(!empty($setting->value))
                   <div class="clearfix mt-10"></div>
                    <img src="{{ asset($setting->value) }}" alt="{{ $setting->hint }}" class="img-responsive" style="max-height: 120px"/>
                @endif
        </div> --}}
        <div class="form-group">
            <label for="{{$setting->id}}">{{$setting->label}} <span class="text-danger">*</span></label>
            <div class="col-lg-9 col-xl-6">

                {{-- @dd($setting->value) --}}
                <div class="image-input image-input-outline" id="kt_profile_avatar" style="background-image: url({{ $setting->value ? generate_url($setting->value) : asset('frontend/images/logo.png') }})">
                    <div class="image-input-wrapper" style="background-image:url({{ $setting->value ? generate_url($setting->value) : asset('frontend/images/logo.png') }})"></div>
                    <label class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow" data-action="change" data-toggle="tooltip" title="" data-original-title="Change avatar">
                        <i class="fa fa-pen icon-sm text-muted"></i>
                        <input type="file" name="{{$setting->id}}" accept=".png, .jpg, .jpeg" />
                        {{-- <input type="hidden" name="profile_avatar_remove" /> --}}
                    </label>
                    <span class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow" data-action="cancel" data-toggle="tooltip" title="Cancel avatar">
                        <i class="ki ki-bold-close icon-xs text-muted"></i>
                    </span>
                    {{-- <span class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow" data-action="remove" data-toggle="tooltip" title="Remove avatar">
                        <i class="ki ki-bold-close icon-xs text-muted"></i>
                    </span> --}}
                </div>
                <span class="form-text text-muted">Allowed file types: png, jpg, jpeg.</span>
            </div>
        </div>
        @break
    @default
        <div class="form-group">
            <label for="{{$setting->id}}"> {{$setting->label}}<span class="text-danger">*</span></label>
            <div class="input-icon">
                <input type="{{$setting->type}}" class="form-control"  name="{{$setting->id}}" placeholder="{{$setting->hint}}" value="{{$setting->value}}" {{$required}}/>
                    <span>
                        <i class="{{$setting->icon}}"></i>
                    </span>
            </div>
        </div>
        @break
@endswitch
@push('extra-js')
    <script src="{{ asset('assets/js/pages/custom/profile/profile.js?v=7.0.5')}}"></script>
@endpush
