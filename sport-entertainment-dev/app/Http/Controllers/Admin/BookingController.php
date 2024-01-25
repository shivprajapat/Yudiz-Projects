<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index()
    {
        return view('admin.pages.bookings.index')->with(['custom_title' => ('Bookings')]);
    }
    public function show(Booking $booking)
    {
        return view('admin.pages.bookings.view', compact('booking'))->with(['custom_title' => 'Booking']);

    }
    public function listing(Request $request)
    {
        extract($this->DTFilters($request->all()));
        $records = [];
        if ($sort_column == 'end_user_name') {
            $sort_column = 'users.first_name';
        }
        elseif($sort_column == 'coaching_name') {
            $sort_column = 'coaching_centres.coaching_name';
        }
        elseif($sort_column == 'batch_name') {
            $sort_column = 'batches.name';
        }

        $bookings = Booking::with(["user","batch"])
                    ->join('users', 'bookings.user_id', '=', 'users.id')
                    ->withCount("participants")
                    ->join('coaching_centres', 'bookings.coaching_centre_id', '=', 'coaching_centres.id')
                    ->join('batches', 'bookings.batch_id', '=', 'batches.id')
                    ->select('bookings.*');

        if ($search != '') {
            $bookings->where(function ($query) use ($search) {
                $query->where("booking_id", 'like', "%{$search}%")
                        ->orWhere('booking_date', 'like', "%{$search}%")
                        ->orWhere('booking_time', 'like', "%{$search}%")
                        ->orWhere('total_price', 'like', "%{$search}%")
                        ->orWhere('no_of_participants', 'like', "%{$search}%")
                        ->orWhereHas("user", function ($q) use ($search) {
                            $q->where('first_name', 'like', "%{$search}%")
                               ->orWhere('last_name', 'like',"%{$search}%");
                        })
                        ->orWhereHas("batch", function ($q) use ($search) {
                            $q->where("name", 'like', "%{$search}%")
                               ->orWhereHas("coachingCentre", function($p) use ($search){
                                $p->where('coaching_name', 'like', "%{$search}%");
                               });
                        });
            });
        }

        $count = $bookings->count();

        $records['recordsTotal'] = $count;
        $records['recordsFiltered'] = $count;
        $records['data'] = [];

        $bookings = $bookings->offset($offset)->limit($limit)->orderBy($sort_column, $sort_order);

        $bookings = $bookings->latest()->get();
        foreach ($bookings as $key => $booking) {

            $params = [
                'checked' => ($booking->is_active ? 'checked' : ''),
                'getaction' => $booking->is_active,
                'class' => '',
                'id' => $booking->id,
            ];

            $records['data'][] = [
                'id' => $booking->id,
                'sr_no' =>  ++$key,
                'booking_id' => $booking->booking_id,
                'booking_date' => $booking->booking_date . " | " . $booking->booking_time,
                'end_user_name' => $booking->user->first_name. ' ' . $booking->user->last_name,
                'no_of_participants' => $booking->no_of_participants,
                'coaching_name' => $booking->batch->coachingCentre->coaching_name,
                'batch_name' => $booking->batch->name,
                'total_price' => $booking->total_price,
                'active' => view('admin.layouts.includes.switch', compact('params'))->render(),
                'action' => view('admin.layouts.includes.actions')->with(['custom_title' => 'Coaching Center', 'id' => $booking->id], $booking)->render(),
                'updated_at' => $booking->updated_at,
                'checkbox' => view('admin.layouts.includes.checkbox')->with('id', $booking->id)->render(),
            ];
        }
        return $records;
    }

}
