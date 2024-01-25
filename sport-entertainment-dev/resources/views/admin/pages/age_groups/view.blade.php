@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('age-groups_view', $ageGroup->id) !!}
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
                        <a data-target-href="{{ route('admin.age-groups.destroy', $ageGroup->id) }}" name="del_select" id="top_delete"
                            class="btn btn-md btn-light-danger font-weight-bolder text-uppercase mr-2" style="width:100px">
                            Delete
                        </a>
                    @endif
                    @if (in_array('edit', $permissions))
                        <a href="{{ route('admin.age-groups.edit',$ageGroup->id) }}"
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
                                <label>Age Group Name</label>
                            </div>
                            <div>
                                <label>
                                    <h4>
                                        @if ($ageGroup->age_name)
                                            {{ $ageGroup->age_name }}
                                        @else
                                            --
                                        @endif
                                    </h4>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div>
                                <label>Is Active</label>
                            </div>
                            <div>
                                <label>
                                    <h4>
                                        @if ($ageGroup->is_active)
                                            {{ $ageGroup->is_active == 1 ? 'Yes' : 'No' }}
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
                                <label>Minimum Age</label>
                            </div>
                            <div>
                                <label>
                                    <h4>
                                        @if ($ageGroup->minimum_age)
                                            {{ $ageGroup->minimum_age }}
                                        @else
                                            --
                                        @endif
                                    </h4>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div>
                                <label>Maximum Age</label>
                            </div>
                            <div>
                                <label>
                                    <h4>
                                        @if ($ageGroup->maximum_age)
                                            {{ $ageGroup->maximum_age }}
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
    var userIndexRoute = "{{ route('admin.age-groups.index') }}";
</script>
@endpush
