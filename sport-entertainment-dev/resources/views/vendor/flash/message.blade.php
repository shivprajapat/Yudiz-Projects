@if (Route::is('admin.*') || Route::is('coaching.*'))
    {{-- Toastr Message --}}

    @foreach (session('flash_notification', collect())->toArray() as $message)
        @if ($message['overlay'])
            @include('flash::modal', [
                'modalClass' => 'flash-modal',
                'title' => $message['title'],
                'body' => $message['message'],
            ])
        @else
            @push('extra-js')
                <script type="text/javascript">
                    $(function() {
                        showMessage("{{ $message['level'] }}", "{!! $message['message'] !!}");
                    });
                </script>
            @endpush
        @endif
    @endforeach
    {{ session()->forget('flash_notification') }}
@else
    @foreach (session('flash_notification', collect())->toArray() as $message)
        @if ($message['overlay'])
            @include('flash::modal', [
                'modalClass' => 'flash-modal',
                'title' => $message['title'],
                'body' => $message['message'],
            ])
        @else
            @push('extra-js')
                <script type="text/javascript">
                    $(function() {
                        showMessage("{{ $message['level'] }}", "{!! $message['message'] !!}");
                    });
                </script>
            @endpush
        @endif
    @endforeach
    {{ session()->forget('flash_notification') }}
@endif
