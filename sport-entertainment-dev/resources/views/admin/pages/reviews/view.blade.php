@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('reviews_view', $review->id) !!}
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
                    @php
                        use App\Enums\StatusEnums;
                    @endphp
                    @if($review->is_approved == StatusEnums::INACTIVE->value)
                    <form method="POST" action="{{  route('admin.reviews.update',$review->id) }}">
                        @csrf
                        @method('PUT')
                        <button type="submit" name="action" value = "{{StatusEnums::REJECT}}" class="btn btn-danger">Reject</button>
                        <button type="submit" name="action"  value = "{{StatusEnums::ACTIVE}}" class="btn btn-success">Approve</button>
                    </form>
                    @else
                    @if (in_array('delete', $permissions))
                    <a data-target-href="{{ route('admin.reviews.destroy', $review->id) }}"
                        name="del_select" id="top_delete"
                        class="btn btn-md btn-light-danger font-weight-bolder text-uppercase mr-2"
                        style="width:100px">
                        Delete
                    </a>
                @endif
                    @endif

                </div>
            </div>
            <div class="card-header">
                <div class="card-body col-md-12" style="padding-left:50px; padding-bottom:0px;">
                    <div class="row">
                        <div class="col-md-3">
                            <div>
                                <label>
                                    <h5>
                                        <img src="{{ generate_url($review->user->profile_photo) }}" alt="sports logo"
                                            width="200" height="170">
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div>
                                <label>User Name</label>
                            </div>
                            <div>
                                <label>
                                    <h4>
                                        @if ($review->user->first_name || $review->user->last_name)
                                            {{ $review->user->first_name . ' ' . $review->user->last_name }}
                                        @else
                                            --
                                        @endif
                                    </h4>
                                </label>
                            </div>
                            <div class="mt-10">
                                <label>Ratings</label>
                            </div>
                            <div>
                                @foreach (range(1, 5) as $i)
                                    <span class="fa-stack" style="width:1em">
                                        <i class="far fa-star fa-stack-1x"></i>

                                        @if ($review->rating > 0)
                                            @if ($review->rating > 0.5)
                                                <i class="fas fa-star fa-stack-1x text-warning"></i>
                                            @else
                                                <i class="fas fa-star-half fa-stack-1x text-warning"></i>
                                            @endif
                                        @endif
                                        @php $review->rating--; @endphp
                                    </span>
                                @endforeach
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div>
                                <label>Batch Name</label>
                            </div>
                            <div>
                                <label>
                                    <h4>
                                        @if ($review->batch)
                                            {{ $review->batch->name }}
                                        @else
                                            --
                                        @endif
                                    </h4>
                                </label>
                            </div>
                               <div class="mt-10">
                                <label>Reviews</label>
                            </div>
                            <div style="width: 500px">
                                <label>
                                    <h4>
                                        @if ($review->review)
                                            {{ $review->review }}
                                        @else
                                            --
                                        @endif
                                    </h4>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div>
                                <label>Review Posted Date | Time</label>
                            </div>
                            <div>
                                <label>
                                    <h4>
                                        @if ($review->review_post_date || $review->review_post_time)
                                            {{ $review->review_post_date . ' | ' . $review->review_post_time }}
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
                        <div class="col-md-3">
                            <div>
                                <label>Coaching Centre Name</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($review->coachingCentre)
                                            {{ $review->coachingCentre->coaching_name }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div>
                                <label>Coaching Centre logo</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($review->coachingCentre)
                                        <img src="{{ generate_url($review->coachingCentre->logo) }}"
                                            alt="sports logo" width="150" height="120">
                                    @else
                                        --
                                    @endif
                                    </h5>
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
    var userIndexRoute = "{{ route('admin.reviews.index') }}";
</script>
@endpush
