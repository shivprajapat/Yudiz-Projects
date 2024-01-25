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
        <div class="form-group">
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
                    <img src="{{ asset($setting->value) }}" alt="{{ $setting->hint }}" class="img-responsive" style="max-width: 60%"/>
                @endif
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