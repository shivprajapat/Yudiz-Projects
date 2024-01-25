@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('faqs_view', $faq->id) !!}
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
                        <a data-target-href="{{ route('admin.faqs.destroy', $faq->id) }}" name="del_select" id="top_delete"
                            class="btn btn-md btn-light-danger font-weight-bolder text-uppercase mr-2" style="width:100px">
                            Delete
                        </a>
                    @endif
                    @if (in_array('edit', $permissions))
                        <a href="{{ route('admin.faqs.edit',$faq->id) }}"
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
                            <div class="mt-5">
                                <label>User Type</label>
                            </div>
                            <div>
                                <label>
                                    <h4>
                                        @php
                                        use App\Enums\FaqTypeEnums;
                                        @endphp
                                        @if ($faq->faq_type)
                                            {{ $faq->faq_type == (FaqTypeEnums::END_USER)->value ? 'End User' : 'Coaching Centre' }}
                                        @else
                                            --
                                        @endif
                                    </h4>
                                </label>
                            </div>
                            <div class="mt-5">
                                <label>Question</label>
                            </div>
                            <div>
                                <label>
                                    <h4>
                                        @if ($faq->title)
                                            {{ $faq->title }}
                                        @else
                                            --
                                        @endif
                                    </h4>
                                </label>
                            </div>
                            <div class="mt-5">
                                <label>Description</label>
                            </div>
                            <div>
                                <label>
                                    <h4>
                                        @if ($faq->description)
                                            {{ $faq->description }}
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
    var userIndexRoute = "{{ route('admin.faqs.index') }}";
</script>
@endpush
