@extends('admin.layouts.app')
@push('breadcrumb')
{!! Breadcrumbs::render('site_setting') !!}
@endpush
@section('content')
<div class="container">
	<form  id="form_settings" role="form" method="POST" action="{{ route('admin.settings.change-setting') }}" enctype="multipart/form-data">
		@csrf
		<div class="card card-custom card-stretch">
            <div class="card-header">
                <div class="card-title">
                    <span class="card-icon">
                        <i class="{{$icon}} text-primary"></i>
                    </span>
                    <h3 class="card-label text-uppercase">{{ $custom_title }}</h3>
                </div>
            </div>
			<div class="card-body">
				<div class="row">
				@foreach ($settings as $setting)
				<div class="col-lg-6">
                    @include('admin.layouts.includes.setting',compact('setting'))
                   </div>
                @endforeach
            	</div>
			</div>
            <div class="card-footer">
                <button type="submit" class="btn btn-primary mr-2">Submit</button>
                <a href="{{ route('admin.dashboard.index') }}" type="button" class="btn btn-secondary">Cancel</a>
            </div>
		</div>


	</form>
</div>
@endsection
