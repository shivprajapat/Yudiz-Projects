@if (in_array('access', $permissions))
@foreach(range(1,5) as $i)
    <span class="fa-stack" style="width:1em">
        <i class="far fa-star fa-stack-1x"></i>

        @if($rating >0)
            @if($rating >0.5)
                <i class="fas fa-star fa-stack-1x text-warning"></i>
            @else
                <i class="fas fa-star-half fa-stack-1x text-warning"></i>
            @endif
        @endif
        @php $rating--; @endphp
    </span>
@endforeach
@endif
