@if (in_array('delete', $permissions))
	<center><input type="checkbox" class="small-chk" value="{{$id}}"></center>
@elseif (Route::is('marketer.marketplace.listing'))
<center><input type="checkbox" class="websitePayment" name="websitePayment" value="{{$id}}" onclick="websitePayment(this)"></center>
@endif