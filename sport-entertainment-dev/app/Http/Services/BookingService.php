<?php

namespace App\Http\Services;

use App\Enums\PaymentStatusEnums;
use App\Http\Resources\Api\{
    BasicCoachingDetail,
    BatchDetailResource,
    BookingDetailResource,
    BookingParticipantResource,
    BookingResource,
    BookingSummaryParticipantResource,
    SelfUserResource
};
use App\Models\{
    Batch,
    Booking,
    BookingParticipant,
    Participant
};
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class BookingService
{
    function showBookingSummary($request)
    {
        $batch        = Batch::with(["CoachingCentre:id,logo,coaching_name,address_line1,address_line2,pincode", "sport:id,name", "ageGroup:id,age_name"])->where('id', $request->batch_id)->firstOrFail();
        $participants = Participant::select("id", "first_name", "last_name", "dob")->where('user_id', auth()->user()->id)->get();
        $data         = [
            "coaching_detail" => new BasicCoachingDetail($batch->CoachingCentre),
            "batch_detail"    => new BatchDetailResource($batch),
            "self_user"       => new  SelfUserResource(auth()->user()),
            "participants"    => BookingSummaryParticipantResource::collection($participants),
        ];

        return $data;
    }

    function addBooking($request)
    {
        $batch        = Batch::where("id", $request->batch_id)->firstOrFail();
        $isAbleToBook = $this->ableToBooking($request, $batch);
        if ($isAbleToBook['status']) {
            return  DB::transaction(function () use ($request, $batch) {
                $validatedData   = $request->validated();
                $participantsIds = explode(',', $validatedData["participants_custom_ids"]);

                $nonEmptyValues             = array_filter($participantsIds, 'strlen');
                $totalParticipantsWantToAdd = count($nonEmptyValues);

                $booking =  Booking::create([
                    "user_id"            => auth()->user()->id,
                    "batch_id"           => $request->batch_id,
                    "booking_id"         => Booking::generateBookingId(),                                         //:::: pending ask how to generate
                    "booking_date"       => Carbon::now()->format("Y-m-d"),
                    "booking_time"       => Carbon::now()->format("g:i A"),
                    "total_price"        => $batch->price * $totalParticipantsWantToAdd,
                    "no_of_participants" => $totalParticipantsWantToAdd,
                    "status"             => PaymentStatusEnums::FAILED,
                ]);

                //add the data of booking participants if self then also is called this function
                $this->addBookingParticipantData($booking->id, $participantsIds, $batch);
                return [
                    "status"  => true,
                    "message" => __("BOOKING_CREATED")
                ];
            });
        } else {
            return $isAbleToBook;
        }
    }

    function ableToBooking($request, $batch)
    {

        $data = [
            "status"  => true,
            "message" => "Able to Booking."
        ];

        //1. completion_status ==> 1 then batch is comleted
        if ($batch->completion_status) {
            $data = [
                "status"  => false,
                "message" => "Batch is already completed."
            ];
        }

        //if total booking 20 and booked size is 18 but the partcipant is 3 so total 18 + 3 = 21 and total booking is 20
        $totalBookdedSize       = $batch->booked_batch_size;
        $participantsIds        = explode(',', $request->participants_custom_ids);
        $nonEmptyValues         = array_filter($participantsIds, 'strlen');
        $totalWantToParticipant = count($nonEmptyValues);
        $afterTotalBookSize     = $totalBookdedSize + $totalWantToParticipant;
        $totalBatchSize         = $batch->batch_size;

        if ($totalBatchSize < $afterTotalBookSize) {
            $remainBatchSize = $totalBatchSize - $totalBookdedSize;
            $data            = [
                "status"  => false,
                "message" => "There are only $remainBatchSize seats remaining, but the number of participants ($totalWantToParticipant) is greater than the number of available seats."
            ];
        }

        return $data;
    }

    function addBookingParticipantData($booking_id, $participants_ids, $batch)
    {
        $participantsData = [];
        $count            = 0;
        foreach ($participants_ids as $participant) {
            //if current user id then store only user_id not participant id
            if (auth()->user()->custom_id == $participant) {
                $participantD = [
                    "id"             => get_unique_string(),
                    "booking_id"     => $booking_id,
                    "participant_id" => null,
                    "user_id"        => auth()->user()->id,
                    "created_at"     => Carbon::now(),
                    "updated_at"     => Carbon::now(),
                ];
            } else {
                $participantD = [
                    "id"             => get_unique_string(),
                    "booking_id"     => $booking_id,
                    "participant_id" => $participant,
                    "user_id"        => null,
                    "created_at"     => Carbon::now(),
                    "updated_at"     => Carbon::now(),
                ];
            }
            $count++;
            $participantsData = [...$participantsData, $participantD];
        }

        BookingParticipant::insert($participantsData);
        //after adding the data update the batch size
        $batch->increment('booked_batch_size', $count);
        return true;
    }

    function getBookings($request)
    {
        // $bookings   = Booking::with(["batch:id,coaching_centre_id,name,start_date,end_date,price", "batch.sport:id,name", 'batch.CoachingCentre:id,coaching_name,address_line1,address_line1,pincode'])->where('user_id', auth()->user()->id)->get();
        // dd($bookings);
        $bookings = Booking::select('bookings.id', 'booking_id', 'booking_date', 'booking_time', 'total_price', 'sports.name as sport_name', 'coaching_centres.coaching_name', 'coaching_centres.address_line1', 'coaching_centres.address_line2', 'coaching_centres.pincode', 'coaching_centres.logo', 'batches.name as batch_name', 'batches.start_date as batch_start_date', 'batches.end_date as batch_end_date', 'price')
            ->join("batches", 'batches.id', '=', 'bookings.batch_id')
            ->join('sports', 'sports.id', '=', 'batches.sport_id')
            ->join('coaching_centres', 'coaching_centres.id', '=', 'batches.coaching_centre_id')
            ->where('user_id', '=', auth()->user()->id)
            ->get();

        return BookingResource::collection($bookings);
    }

    function getSingleBookingDetail($request)
    {
        $booking = Booking::select('bookings.id as custom_booking_id', 'bookings.booking_id as booking_id', 'booking_date', 'booking_time', 'total_price', 'sports.name as sport_name', 'coaching_centres.coaching_name as coaching_name', 'coaching_centres.address_line1', 'coaching_centres.address_line2', 'coaching_centres.pincode', 'coaching_centres.logo', 'batches.name as batch_name', 'batch_size', 'batches.start_date as batch_start_date', 'batches.end_date as batch_end_date', 'price', 'age_name', 'start_time', 'end_time', 'number_of_session', 'session_days', 'convenience_fees', 'coaching_centres.id as id', 'batches.id as custom_batch_id')
            ->join("batches", 'batches.id', '=', 'bookings.batch_id')
            ->join('sports', 'sports.id', '=', 'batches.sport_id')
            ->join('coaching_centres', 'coaching_centres.id', '=', 'batches.coaching_centre_id')
            ->join('age_groups', 'age_groups.id', '=', 'batches.age_id')
            ->where('bookings.id', $request->custom_booking_id)
            ->where('user_id', '=', auth()->user()->id)
            ->firstOrFail();

        // $bookingParticipant = BookingParticipant::with(["participant:id,user_id,first_name,last_name,dob,gender"])->where("booking_id", $request->custom_booking_id)->get();

        $bookingParticipants = BookingParticipant::with([
            "participant:id,user_id,first_name,last_name,dob,gender",
            "participateAsUser" => function ($query) {
                $query->whereNotNull('id');
            }
        ])
            ->where("booking_id", $request->custom_booking_id)
            ->get();
        $data = [
            "coaching_detail" => new BasicCoachingDetail($booking),
            "booking"         => new BookingDetailResource($booking),
            "participants"    => BookingParticipantResource::collection($bookingParticipants),
        ];
        return $data;
    }
}
