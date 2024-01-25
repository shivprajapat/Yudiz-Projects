@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('cms_view', $page->id) !!}
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
                        <a data-target-href="{{ route('admin.pages.destroy', $page->id) }}" name="del_select" id="top_delete"
                            class="btn btn-md btn-light-danger font-weight-bolder text-uppercase mr-2" style="width:100px">
                            Delete
                        </a>
                    @endif
                    @if (in_array('edit', $permissions))
                        <a href="{{ route('admin.pages.edit',$page->id) }}"
                            class="btn btn-md btn-primary font-weight-bolder text-uppercase" style="width:100px">
                           Edit
                        </a>
                    @endif
                </div>
            </div>
            <div class="card-header">
                <div class="card-body col-md-12" style="padding-left:50px; padding-bottom:0px;">
                    <div class="row">
                        <div class="col-md-12">
                            <div>
                                <label>Title</label>
                            </div>
                            <div>
                                <label>
                                    <h4>
                                        @if ($page->title)
                                            {{ $page->title }}
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
                        <div class="col-md-12">
                            <div>
                                <label>Description</label>
                            </div>
                            <div>
                                <label>
                                    <h4>
                                        @if ($page->description)
                                            {{ $page->description }}
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
                        <div class="col-md-12">
                            <div>
                                <label>Image</label>
                            </div>
                            <div>
                                <label>
                                    <h4>
                                        @if ($page->file)
                                            <img src="{{ generate_url($page->file) }}" alt="sports logo"
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
            </div>
            <br><br>
        </div>
    </div>
@endsection
@push('extra-js')
<script>
    var userIndexRoute = "{{ route('admin.pages.index') }}";
</script>
@endpush
