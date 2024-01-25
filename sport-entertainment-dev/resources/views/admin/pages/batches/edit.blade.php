@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('batches_update', $batch->id) !!}
@endpush
@push('extra-css')
    <style>
        #myDiv {
            border: 1px solid rgb(90, 189, 227);
            padding: 10px;
            margin-left: 10px;
        }

        .datepicker {
            top: 460px;
        }

        element.style {
            z-index: 10;
        }
    </style>
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
            <form id="frmBatchEdit" method="POST" action="{{ route('admin.batches.update', $batch->id) }}"
                enctype="multipart/form-data">
                @csrf
                @method('put')
                <div class="card-body">
                    <div class="form-group row">
                        <div class="col-lg-12">
                            <h3><b><u>Batch Details</u></b>
                                <h3>
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-md-4" id="myDiv">
                            <h5>Coaching Centre Name<h5>
                                    <h4><b>{{ $batch->CoachingCentre->coaching_name }}</b>
                                        <h4>
                        </div>
                    </div>

                    <div class="form-group row">
                        <div class="col-md-4">
                            <label for="name">{!! $mend_sign !!} Batch Name: </label>
                            <input type="text" class="form-control @error('name') is-invalid @enderror" id="name"
                                name="name" value="{{ old('name') ?? $batch->name }}" placeholder="Batch Name"
                                autocomplete="name" spellcheck="false" autocapitalize="sentences" tabindex="0"
                                autofocus />
                            @if ($errors->has('name'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('name') }}</strong>
                                </span>
                            @endif
                        </div>

                        <div class="col-md-4">
                            <label for="start_date">{!! $mend_sign !!}Start Date:</label>
                            <div class="input-group">
                                <input type="text" class="form-control @error('start_date') is-invalid @enderror"
                                    id="start_date" name="start_date" value="{{ $batch->start_date }}"
                                    placeholder="Start Date" />
                                <div class="input-group-append">
                                    <span class="input-group-text">
                                        <i class="la la-calendar"></i>
                                    </span>
                                </div>
                            </div>
                            @if ($errors->has('start_date'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('start_date') }}</strong>
                                </span>
                            @endif
                        </div>
                        <div class="col-md-4">
                            <label for="end_date">{!! $mend_sign !!}End Date:</label>
                            <div class="input-group">
                                <input type="text" class="form-control @error('end_date') is-invalid @enderror"
                                    autocomplete="off" id="end_date" name="end_date"
                                    value="{{ old('end_date') ?? $batch->end_date }}" placeholder="End Date"
                                    tabindex="0" />
                                <div class="input-group-append">
                                    <span class="input-group-text">
                                        <i class="la la-calendar"></i>
                                    </span>
                                </div>

                            </div>
                            @if ($errors->has('end_date'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('end_date') }}</strong>
                                </span>
                            @endif
                        </div>

                    </div>
                    <div class="form-group row">
                        <div class="col-md-4">
                            <label for="sport_id"> {!! $mend_sign !!}Sport Name: </label>
                            <div class="input-group">
                                <select name="sport_id" class="select2_sports form-control" id="sport_id">
                                    <option value="">Select Sport</option>
                                    @foreach ($sports as $sport)
                                        @if ($sport->sport)
                                            <option data-img_sport="{{ generate_url($sport->sport->logo) }}"
                                                value="{{ $sport->sport->id }}"
                                                {{ $sport->sport->id == $batch->sport_id ? 'selected' : '' }}>
                                                {{ $sport->sport->name }} </option>
                                        @endif
                                    @endforeach
                                </select>
                            </div>
                            @if ($errors->has('sport_id'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('sport_id') }}</strong>
                                </span>
                            @endif
                        </div>
                        <div class="col-md-4">
                            <label for="age_id"> {!! $mend_sign !!}Age Groups: </label>
                            <div class="input-group">
                                <select name="age_id" class="select2_age_group form-control">
                                    <option value=""> select age-group </option>
                                    @foreach ($ageGroups as $age_group)
                                        <option value=" {{ $age_group->id }} "
                                            {{ $age_group->id == $batch->age_id ? 'selected' : '' }}>
                                            {{ $age_group->age_name }} </option>
                                    @endforeach
                                </select>
                            </div>
                            @if ($errors->has('age_id'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('age_id') }}</strong>
                                </span>
                            @endif
                        </div>
                        <div class="col-md-4">
                            <label for="batch_size">{!! $mend_sign !!}Batch Size:</label>
                            <div class="">
                                <input type="text" class="form-control @error('batch_size') is-invalid @enderror"
                                    id="batch_size" name="batch_size" value="{{ old('batch_size') ?? $batch->batch_size }}"
                                    placeholder="Batch Size" tabindex="0" />
                                @if ($errors->has('batch_size'))
                                    <span class="text-danger">
                                        <strong class="form-text">{{ $errors->first('batch_size') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-md-4">
                            <label for="session_days">{!! $mend_sign !!}Session Days:</label>
                            <div class="input-group">
                                <select name="session_days[]" class="form-control select2_session_days" id="session_days"
                                    multiple='multiple'>
                                    @foreach (App\Enums\WeekDays::cases() as $weekDay)
                                        <option value="{{ $weekDay }}"
                                            {{ strpos($batch->session_days, $weekDay->value) !== false ? 'selected' : '' }}>
                                            {{ $weekDay }} </option>
                                    @endforeach
                                </select>
                            </div>
                            @if ($errors->has('session_days'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('session_days') }}</strong>
                                </span>
                            @endif

                        </div>
                        <div class="col-md-4">
                            <label for="start_time">{!! $mend_sign !!}Session Timing:</label>
                            <div class="row">
                                <div class="col-md-5">
                                    <input type="text" class="form-control @error('start_time') is-invalid @enderror"
                                        id="start_time" name="start_time"
                                        value="{{ old('start_time') ?? $batch->start_time }}"
                                        placeholder="Session Start Time" tabindex="0" />
                                    @if ($errors->has('start_time'))
                                        <span class="text-danger">
                                            <strong class="form-text">{{ $errors->first('start_time') }}</strong>
                                        </span>
                                    @endif
                                </div>
                                <div class="col-md-2 mt-2" style="text-align: center">
                                    <b>To</b>
                                </div>
                                <div class="col-md-5">
                                    <input type="text" class="form-control @error('end_time') is-invalid @enderror"
                                        id="end_time" name="end_time" value="{{ old('end_time')?? $batch->end_time  }}"
                                        placeholder="Session End Time" tabindex="0" />
                                    @if ($errors->has('end_time'))
                                        <span class="text-danger">
                                            <strong class="form-text">{{ $errors->first('end_time') }}</strong>
                                        </span>
                                    @endif
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label for="number_of_session">{!! $mend_sign !!}No Of Sessions:</label>
                            <input type="text" class="form-control @error('number_of_session') is-invalid @enderror"
                                id="number_of_session" name="number_of_session"
                                value="{{ old('number_of_session') ?? $batch->number_of_session }}"
                                placeholder="No Of Sessions" tabindex="0" />
                            @if ($errors->has('number_of_session'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('number_of_session') }}</strong>
                                </span>
                            @endif
                        </div>
                    </div>

                    <div class="form-group row">
                        <div class="col-md-4">
                            <label for="price">{!! $mend_sign !!}Price:</label>
                            <input type="text" class="form-control @error('price') is-invalid @enderror"
                                id="price" name="price" value="{{ old('price') ?? $batch->price }}"
                                placeholder="Price" tabindex="0" />
                            @if ($errors->has('price'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('price') }}</strong>
                                </span>
                            @endif
                        </div>
                        <div class="col-md-4">
                            <label for="brief_details">{!! $mend_sign !!}Session Brief:</label>
                            <textarea type="textarea" class="form-control @error('brief_details') is-invalid @enderror" id="brief_details"
                                name="brief_details" tabindex="0" placeholder="Session Brief"> {{ old('brief_details') ?? $batch->brief_details }}  </textarea>
                            @if ($errors->has('brief_details'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('brief_details') }}</strong>
                                </span>
                            @endif
                        </div>

                    </div>

                    @php
                        use App\Enums\BatchStatus;
                    @endphp
                    <div class="form-group row">
                        <div class="col-md-4">
                            <label for="live_status">Live Status:</label>
                            <div class="d-flex align-item-center w-60px">
                                <span class="switch switch-outline switch-icon switch-success switch-sm">
                                    <label>
                                        <input type="hidden" name="live_status"
                                            value="{{ BatchStatus::INACTIVE->value }}"
                                            {{ $batch->completion_status == 0 ? 'disabled' : '' }}>
                                        <input type="checkbox"
                                            {{ $batch->live_status == BatchStatus::LIVE->value ? 'checked' : '' }}
                                            name="live_status" value="{{ BatchStatus::LIVE->value }}"
                                            {{ $batch->completion_status == 0 ? 'disabled' : '' }}>
                                        <span></span>
                                    </label>
                                </span>
                            </div>
                            <span class="text-muted"> By making it ON, You won’t be able to edit or delete any details and
                                won’t able to off it.</span>
                            @if ($errors->has('live_status'))
                                <span class="text-danger">
                                    <strong class="form-text">{{ $errors->first('live_status') }}</strong>
                                </span>
                            @endif
                        </div>

                    </div>
                    <div class="card-footer">
                        <button type="submit" class="btn btn-primary mr-2">Update {{ $custom_title }} </button>
                        <a href="{{ route('admin.batches.index') }}" class="btn btn-secondary"> Cancel </a>
                    </div>
            </form>
            <!--end::Form-->
        </div>
    </div>
@endsection

@push('extra-js')
    <script>
        $(document).ready(function() {
            $(".select2_sports").select2({
                templateResult: formatOption,
                templateSelection: formatOption,
                placeholder: "Please select sports"
            });

            $(".select2_age_group").select2({
                placeholder: "Please select age group"
            });
            $(".select2_session_days").select2({
                closeOnSelect: false,
                allowHtml: true,
                allowClear: true,
                tags: true,
                placeholder: "Please select the session days"
            });

            // time picker
            $('#start_time, #end_time').timepicker({
                autoclose: true
            });

            //date picker
            $('#start_date,#end_date').datepicker({
                todayBtn: "linked",
                clearBtn: true,
                startDate: '+0d',
                todayHighlight: true,
                templates: arrows,
                format: 'dd/mm/yyyy',
                autoclose: true,
            });

            var arrows;
            if (KTUtil.isRTL()) {
                arrows = {
                    leftArrow: '&lt;i class="la la-angle-right"&gt;&lt;/i&gt;',
                    rightArrow: '&lt;i class="la la-angle-left"&gt;&lt;/i&gt;'
                }
            } else {
                arrows = {
                    leftArrow: '&lt;i class="la la-angle-left"&gt;&lt;/i&gt;',
                    rightArrow: '&lt;i class="la la-angle-right"&gt;&lt;/i&gt;'
                }
            }

            function formatOption(option) {
                let sportImg = $(option.element).data('img_sport');
                if (!option.id) {
                    return option.text;
                }
                var $option = $(
                    '<span>' + ' <img style="width:20px; height=20px"  src="' + sportImg +
                    '" class="select2-option-image" />' + option.text + '</span>'
                );

                return $option;
            }
            $.validator.addMethod(
                "greaterThan",
                function(value, element, param) {
                    var startDate = $("#start_date").datepicker("getDate");
                    var endDate = $("#end_date").datepicker("getDate");
                    return endDate >= startDate;
                },
                "End date must be greater than the start date."
            );

            $("#frmBatchEdit").validate({
                rules: {
                    name: {
                        required: true,
                        not_empty: true,
                        alpha_space: false,
                        minlength: 3,
                        maxlength: 50,
                    },
                    start_date: {
                        required: true,
                    },
                    end_date: {
                        required: true,
                        greaterThan: true,
                    },
                    sport_id: {
                        required: true,
                    },
                    age_id: {
                        required: true,
                    },
                    batch_size: {
                        required: true,
                        digits: true,
                    },
                    'session_days[]': {
                        required: true,
                    },
                    start_time: {
                        required: true,
                    },
                    end_time: {
                        required: true,
                    },
                    number_of_session: {
                        required: true,
                        digits: true,
                    },
                    brief_details: {
                        required: true,
                        minlength: 5,
                        maxlength: 255,
                    },
                    price: {
                        required: true,
                        number: true,
                    },
                    actual_price: {
                        required: true,
                        number: true,
                    },
                },
                messages: {
                    name: {
                        required: "@lang('validation.required', ['attribute' => 'Batch name'])",
                        not_empty: "@lang('validation.not_empty', ['attribute' => 'Batch name'])",
                        minlength: "@lang('validation.min.string', ['attribute' => 'Batch name', 'min' => 3])",
                        maxlength: "@lang('validation.min.string', ['attribute' => 'Batch name', 'min' => 50])",
                        alpha_space: "Please enter proper batch name."
                    },
                    start_date: {
                        required: "@lang('validation.required', ['attribute' => 'Start date'])",
                    },
                    end_date: {
                        required: "@lang('validation.required', ['attribute' => 'End date'])",
                    },
                    sport_id: {
                        required: "@lang('validation.required', ['attribute' => 'Sports is'])",
                    },
                    age_id: {
                        required: "@lang('validation.required', ['attribute' => 'Age is'])",
                    },
                    batch_size: {
                        required: "@lang('validation.required', ['attribute' => 'Batch size'])",
                        digits: "Please enter only number."
                    },
                    session_days: {
                        required: "@lang('validation.required', ['attribute' => 'Session days'])",
                    },
                    start_time: {
                        required: "@lang('validation.required', ['attribute' => 'Start time'])",
                    },
                    end_time: {
                        required: "@lang('validation.required', ['attribute' => 'End time'])",
                    },
                    number_of_session: {
                        required: "@lang('validation.required', ['attribute' => 'Number of sessions'])",
                        digits: "Please enter only number."
                    },
                    brief_details: {
                        required: "@lang('validation.required', ['attribute' => 'Brief deails'])",
                        minlength: "@lang('validation.min.string', ['attribute' => 'Brief deails', 'min' => 5])",
                        maxlength: "@lang('validation.min.string', ['attribute' => 'Brief deails', 'min' => 255])",
                    },
                    price: {
                        required: "@lang('validation.required', ['attribute' => 'Price'])",
                        number: "@lang('validation.number', ['attribute' => 'Price'])",
                    },
                    actual_price: {
                        required: "@lang('validation.required', ['attribute' => 'Actual price'])",
                    },
                },
                errorClass: 'invalid-feedback',
                errorElement: 'span',
                highlight: function(element) {
                    $(element).addClass('is-invalid');
                    $(element).siblings('label').addClass('text-danger');
                },
                unhighlight: function(element) {
                    $(element).removeClass('is-invalid');
                    $(element).siblings('label').removeClass('text-danger');
                },
                errorPlacement: function(error, element) {
                    if (element.attr("id") == "start_date" || element.attr("id") == "end_date" ||
                        element.is("select")) {
                        error.insertAfter(element.next());
                    } else if (element.attr("data-error-container")) {
                        error.appendTo(element.attr("data-error-container"));
                    } else {
                        error.insertAfter(element);
                    }
                }
            });
            $('#frmBatchEdit').submit(function() {
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
