@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('banner-images_view', $bannerImage->id) !!}
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
                <div class="card-toolbar">
                    @if (in_array('delete', $permissions))
                        <a data-target-href="{{ route('admin.banner-images.destroy', $bannerImage->id) }}" name="del_select" id="top_delete"
                            class="btn btn-md btn-light-danger font-weight-bolder text-uppercase mr-2" style="width:100px">
                            Delete
                        </a>
                    @endif
                    @if (in_array('edit', $permissions))
                        <a href="{{ route('admin.banner-images.edit',$bannerImage->id) }}"
                            class="btn btn-md btn-primary font-weight-bolder text-uppercase" style="width:100px">
                           Edit
                        </a>
                    @endif
                </div>
            </div>
            <div class="card-header">
                <div class="card-body col-md-12" style="padding-left:50px; padding-bottom:0px;">
                    <div class="row">
                        <div class="col-md-6">
                            <div>
                                <label>Banner Type</label>
                            </div>
                            <div>
                                <label>
                                    <h4>
                                        @if ($bannerImage->banner_type)
                                            {{ $bannerImage->banner_type }}
                                        @else
                                            --
                                        @endif
                                    </h4>
                                </label>
                            </div><br><br>
                            <div>
                                <label>Is Active ?</label>
                            </div>
                            <div>
                                <label>
                                    <h4>
                                            {{ $bannerImage->is_active == '1' ? 'yes' : 'no' }}
                                    </h4>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div>
                                <label>Image</label>
                            </div>
                            <div>
                                <label>
                                    <h4>
                                        @if ($bannerImage->banner_image)
                                            <img src="{{ generate_url($bannerImage->banner_image) }}" alt="sports logo"
                                                width="150" height="120">
                                        @else
                                            --
                                        @endif
                                    </h4>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body col-md-12" style="padding-left:50px; padding-bottom:0px;">
                    <div class="row">
                        <div class="col-md-6">
                            <div>
                                <label>Banner redirect to : </label>
                            </div>
                            <div>
                                <label>
                                    <h4>
                                         @if($bannerImage->banner_type == 'url')
                                            <a href="{{ $bannerImage->redirect_url }}"> {{ $bannerImage->redirect_url }}</a>
                                         @elseif($bannerImage->banner_type == 'id')
                                            <a href="#"> {{ $bannerImage->coachingCentre->coaching_name }}</a>
                                        @else
                                            --
                                        @endif
                                    </h4>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card-body col-md-12" style="padding-left:50px; padding-bottom:0px;">
                    <div class="row">
                        <div class="col-md-6">
                            <div>
                                <label>Note: </label>
                            </div>
                            <div>
                                <label>
                                    <h4>
                                        @if ($bannerImage->banner_note)
                                            {{ $bannerImage->banner_note }}
                                        @else
                                            --
                                        @endif
                                    </h4>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br><br>

        </div>
    </div>
@endsection
@push('extra-js')
<script>
    var userIndexRoute = "{{ route('admin.banner-images.index') }}";
</script>
@endpush
