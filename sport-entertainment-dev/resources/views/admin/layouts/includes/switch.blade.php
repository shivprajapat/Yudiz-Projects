@if (in_array('edit', $permissions))
    @if ( Route::is($routeName.'.listing'))
        {{--  For Active Users  --}}
        <div class="d-flex align-item-center w-60px">
            <span class="switch switch-outline switch-icon switch-success switch-sm">
                <label>
                    <input type="checkbox" class="toggleSwitch" {{ $params["checked"] }} data-id="{{ $params['id'] }}" data-url="{{ route($routeName.'.update', $params['id']) }}" />
                    <span></span>
                </label>
            </span>
        </div>
	@endif
@endif
