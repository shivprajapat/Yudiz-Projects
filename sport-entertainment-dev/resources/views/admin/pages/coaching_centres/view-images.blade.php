@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('coaching-centres-images_view', $coaching_centre->id) !!}
@endpush


@section('content')
    <div class="container">
        <div class="card card-custom">
            <div class="card-header">
                <div class="card-title">
                    <span class="card-icon">
                        <i class="{{ $icon }} text-primary"></i>
                    </span>
                    <h3 class="card-label text-uppercase">{{ $custom_title }} Details</h3>
                </div>
            </div>
            <div class="card-header">
                <div class="card-body col-md-12" style="padding-left:50px; padding-bottom:0px;">
                    <div class="row">
                        <div class="col-md-12">
                            <div>
                                <label>
                                    <h3><b><u>Banner Images</u>
                                        </b>
                                        <h3>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body col-md-12" style="padding-left:50px; padding-bottom:0px;">
                    <div class="row">
                        <div class="col-md-12">
                            <ol class="dd-list sortable_list1" id="sortable_list1"
                            style="overflow:hidden; padding: 0px;">
                            @foreach ($coaching_centre->coachingCentreImages as $image)
                                @if ($image->image_path && $image->is_banner == 1)
                                    <li class="dd-item dd3-item" style="display:inline-block; margin: 10px; ">
                                        <div class="symbol symbol-120 mb-10">
                                            <a href="{{ Storage::url($image->image_path) }}" target="_blank"><img
                                                    style="height:150px; width:150px"
                                                    src="{{ Storage::url($image->image_path) }}"></a>
                                        </div>
                                    </li>
                                @endif
                            @endforeach
                        </ol>
                        </div>
                    </div>
                </div>
                <div class="card-body col-md-12" style="padding-left:50px; padding-bottom:0px;">
                    <div class="row">
                        <div class="col-md-12">
                            <div>
                                <label>
                                    <h3><b><u>Coaching Centre's Images</u>
                                        </b>
                                        <h3>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body col-md-12" style="padding-left:50px; padding-bottom:0px;">
                    <div class="row">
                        <div class="col-md-12">
                            <ol class="dd-list" id="sortable_list" style="overflow:hidden; padding: 0px;">
                                @foreach ($coaching_centre->coachingCentreImages as $image)
                                    @if ($image->image_path && $image->is_banner == 0)
                                        <li class="dd-item dd3-item" style="display:inline-block; margin: 10px; ">
                                            <div class="symbol symbol-120 mb-10">
                                                <a href="{{ Storage::url($image->image_path) }}" target="_blank"><img
                                                        style="height:100px; width:100px"
                                                        src="{{ Storage::url($image->image_path) }}"></a>
                                            </div>
                                        </li>
                                    @endif
                                @endforeach
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
@endsection
