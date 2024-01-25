<?php

namespace App\Http\Controllers\Coaching;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $bookingQyery = Booking::query();
        $bookingQyery =  $bookingQyery->coachingId()->paymentStatusSuccess();
        //1. total booking  //2.current month booking recieved //3.today booking recieved
        $totalBooking = $bookingQyery->count();
        $currentMonthBooking = $bookingQyery->whereMonth("booking_date", Carbon::now()->month)->whereYear('booking_date', Carbon::now()->year)->count();
        $todayBooking = $bookingQyery->whereDate("booking_date", Carbon::today())->count();

        $batches = Batch::query();
        $totalActiveBatches = $batches->coachingId()->count();
        // dump($totalBooking);
        // dump($currentMonthBooking);
        // dump($todayBooking);
        // dd($totalActiveBatches);

        return view('coaching.pages.dashboard', ["total_booking" => $totalBooking, "current_month_booking" => $currentMonthBooking, "today_booking" => $todayBooking, 'active_batches' => $totalActiveBatches]);
    }
}
