@extends('admin.layouts.app')

@push('breadcrumb')
    {!! Breadcrumbs::render('users_view', $user->id) !!}
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
                        <a data-target-href="{{ route('admin.users.destroy', $user->custom_id) }}" name="del_select"
                            id="top_delete" class="btn btn-md btn-light-danger font-weight-bolder text-uppercase mr-2"
                            style="width:100px">
                            Delete
                        </a>
                    @endif
                    @if (in_array('edit', $permissions))
                        <a href="{{ route('admin.users.edit', $user->custom_id) }}"
                            class="btn btn-md btn-primary font-weight-bolder text-uppercase" style="width:100px">
                            Edit
                        </a>
                    @endif
                </div>
            </div>
            <div class="card-header">
                <div class="card-body col-md-12 pl-2">
                    <div>
                        <h3><u>User's Details</u>
                            <h3>
                    </div>
                </div>
                <div class="card-body col-md-12 participant_border" style="padding-left:50px; padding-bottom:0px;">
                    <div class="row">
                        <div class="col-md-2">
                            <div>
                                <label>
                                    <h5>
                                        <img src="{{ generate_url($user->profile_photo) }}" alt="sports logo" width="150"
                                            height="120">
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div>
                                <label>Firts Name</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($user->first_name)
                                            {{ $user->first_name }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                            <div class="mt-2">
                                <label>Last Name</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($user->last_name)
                                            {{ $user->last_name }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div>
                                <label>Email</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($user->email)
                                            {{ $user->email }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                            <div class="mt-2">
                                <label>Gender</label>
                            </div>
                            <div>
                                <label>
                                    @php
                                        use App\Enums\GenderEnum;
                                    @endphp
                                    <h5>

                                        {{ $user->gender == GenderEnum::MALE ? 'Male' : 'Female' }}

                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div>
                                <label>Date Of Birth</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($user->dob)
                                            {{ $user->dob }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                            <div class="mt-2">
                                <label>Mobile Number</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($user->mobile_number)
                                            {{ $user->mobile_number }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div>
                                <label>Sign Up Date and Time</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($user->created_at)
                                            {{ $user->created_at }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                            <div>
                                <label>Address</label>
                            </div>
                            <div>
                                <label>
                                    <h5>
                                        @if ($user->address_line_1 || $user->address_line_2)
                                            {{ $user->address_line_1 . ' , ' . $user->address_line_2 . ' , ' . $user->city->name . ' , ' . $user->state->name . '  ' . $user->pin_code }}
                                        @else
                                            --
                                        @endif
                                    </h5>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body col-md-12 pl-0">
                    <div class="col-md-12">
                        <h3><u>Other Participants Details</u>
                            <h3>
                    </div>
                </div>
                @forelse ($user->participants as $participant)
                    <div class="card-body col-md-12 participant_border">
                        <div class="row">
                            <div class="col-md-2">
                                <div>
                                    <label>
                                        <h5>
                                            <img src="{{ generate_url($participant->profile_photo) }}" alt="sports logo"
                                                width="75" height="60">
                                        </h5>
                                    </label>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div>
                                    <label>Firts Name</label>
                                </div>
                                <div>
                                    <label>
                                        <h5>
                                            @if ($participant->first_name)
                                                {{ $participant->first_name }}
                                            @else
                                                --
                                            @endif
                                        </h5>
                                    </label>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div>
                                    <label>Last Name</label>
                                </div>
                                <div>
                                    <label>
                                        <h5>
                                            @if ($participant->last_name)
                                                {{ $participant->last_name }}
                                            @else
                                                --
                                            @endif
                                        </h5>
                                    </label>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div>
                                    <label>Gender</label>
                                </div>
                                <div>
                                    <label>
                                        <h5>
                                            {{ $participant->gender == GenderEnum::MALE ? 'Male' : 'Female' }}
                                        </h5>
                                    </label>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div>
                                    <label>DOB</label>
                                </div>
                                <div>
                                    <label>
                                        <h5>
                                            @if ($participant->dob)
                                                {{ $participant->dob }}
                                            @else
                                                --
                                            @endif
                                        </h5>
                                    </label>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div>
                                    <label>School Name</label>
                                </div>
                                <div>
                                    <label>
                                        <h5>
                                            @if ($participant->school_name)
                                                {{ $participant->school_name }}
                                            @else
                                                --
                                            @endif
                                        </h5>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                @empty
                    <p>No Participants</p>
                @endforelse
                <br>
            </div>
            <br><br>
        </div>
    </div>
@endsection
@push('extra-js')
    <script>
        var userIndexRoute = "{{ route('admin.users.index') }}";
    </script>
@endpush
