@if (in_array('edit', $permissions))
    @if (Route::is($routeName . '.listing'))
        {{--  For Active Users  --}}
        <div class="d-flex align-item-center w-60px">
            <span class="switch switch-outline switch-icon switch-success">
                <label>
                    <input type="checkbox" data-getaction="change_live_status" class="toggleSwitch"
                    {{ $params['live-checked'] }}
                    data-id="{{ $params['id'] }}"
                    data-url="{{ route($routeName . '.update', $params['id']) }}"
                    {{($params['live-checked'] == '' && $params['completion_status'] == 1) ? 'disabled' : '' }} />

                    <span></span>
                </label>
            </span>
        </div>
    @endif
@endif
