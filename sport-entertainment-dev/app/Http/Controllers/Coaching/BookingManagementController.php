<?php

namespace App\Http\Controllers\Coaching;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class BookingManagementController extends Controller
{
    //
    public function index(Request $request)
    {
        if ($request->wantsJson()) {

            extract($this->DTFilters($request->all()));
            $records = [];
            $bookings = Booking::with(["batch", "user", "batch.sport", 'participants'])->coachingId();
            // ->orderBy($sort_column, $sort_order);
            if ($search != '') {
                $bookings->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('batch_size', 'like', "%{$search}%")
                        ->orWhere('start_date', 'like', "%{$search}%")
                        ->orWhere('end_date', 'like', "%{$search}%")
                        ->orWhereHas('sport', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('ageGroup', function ($q) use ($search) {
                            $q->where('age_name', 'like', "%{$search}%");
                        });
                });
            }

            $count = $bookings->count();

            $records['recordsTotal'] = $count;
            $records['recordsFiltered'] = $count;
            $records['data'] = [];

            // $batches = $batches->offset($offset)->limit($limit)->orderBy($sort_column, $sort_order);
            $bookings = $bookings->offset($offset)->limit($limit);

            // ->orderBy($sort_column, $sort_order);
            $bookings = $bookings->latest()->get();
            // dd($batches->user);

            $routeName = Route::currentRouteName();
            foreach ($bookings as $key => $booking) {
                $data = [
                    "id" => $booking->id,
                    "route" => substr($routeName, 0, strrpos($routeName, '.')),
                    "view" => true,
                ];

                // dd($data);
                $records['data'][] = [
                    'no' => ++$key,
                    'id' => $booking->booking_id,
                    'booking_date_time' => $booking->booking_date . " | " . $booking->booking_time,
                    'end_user_name' => $booking->user ? $booking->user->first_name . " " . $booking->user->last_name : "",
                    'batch_name' => $booking->batch ? $booking->batch->name : "",
                    'sport_name' => $booking->batch ?  ($booking->batch->sport  ? $booking->batch->sport->name : "") : "",
                    "total_price" => $booking->total_price,
                    'no_of_participants' => $booking->participants ? $booking->participants->count() : "0",
                    'action' => view('components.action-component',  ["data" => $data])->render(),
                ];
            }
            return $records;
        }
        return view('coaching.pages.booking.index')->with(['custom_title' => 'Booking']);
    }


    public function show(Booking $booking)
    {   $bookingParticipants = $booking->load('participants.participant', 'participants.participateAsUser');
        // dd($bookingParticipants);
        return view('coaching.pages.booking.view', [ "booking"=> $booking, "bookingParticipants" => $bookingParticipants->participants]);
    }
}
