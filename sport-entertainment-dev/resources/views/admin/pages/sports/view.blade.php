@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('sports_view', $sport->id) !!}
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
                        <a data-target-href="{{ route('admin.sports.destroy', $sport->id) }}" name="del_select" id="top_delete"
                            class="btn btn-md btn-light-danger font-weight-bolder text-uppercase mr-2" style="width:100px">
                            Delete
                        </a>
                    @endif
                    @if (in_array('edit', $permissions))
                        <a href="{{ route('admin.sports.edit',$sport->id) }}"
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
                                <label>Sports Name</label>
                            </div>
                            <div>
                                <label>
                                    <h4>
                                        @if ($sport->name)
                                            {{ $sport->name }}
                                        @else
                                            --
                                        @endif
                                    </h4>
                                </label>
                            </div><br>
                            <div>
                                <label>Is Popular?</label>
                            </div>
                            <div>
                                <label>
                                    <h4>

                                            {{ $sport->is_popular == 1 ? 'Yes' : 'No'}}

                                    </h4>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div>
                                <label>Logo</label>
                            </div>
                            <div>
                                <label>
                                    <h4>
                                        @if ($sport->logo)
                                           <img src="{{ Storage::url($sport->logo) }}" alt="sports logo" width="150" height="150" >
                                        @else
                                            --
                                        @endif
                                    </h4>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <br>
            </div>
            <br><br>

        </div>
    </div>
@endsection
@push('extra-js')
<script>
    var userIndexRoute = "{{ route('admin.sports.index') }}";
</script>
@endpush
