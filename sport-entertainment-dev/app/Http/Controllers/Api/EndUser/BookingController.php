<?php

namespace App\Http\Controllers\Api\EndUser;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\{
    AddBookingRequest,
    BookingSummaryRequest,
    SingleBookingRequest,
};
use App\Http\Services\BookingService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class BookingController extends Controller
{
    //
    function bookingSummary(BookingSummaryRequest $request, BookingService $bookingService)
    {
        try {
            $response     = $bookingService->showBookingSummary($request);
            $this->status = Response::HTTP_OK;
            $this->response["message"]    = __("BOOKING_SUMMARY_FETCHED");
            $this->response['data']       = $response;
        } catch (Exception $e) {
            $this->response['message'] = $e->getMessage();
        }
        return $this->returnResponse();
    }
    function addBooking(AddBookingRequest $request, BookingService $bookingService)
    {
        try {
            $response = $bookingService->addBooking($request);
            if (isset($response['status']) &&  $response['status']) {
                $this->status = Response::HTTP_CREATED;
                $this->response['data']       = $response['status'];
            } else {
                $this->status = Response::HTTP_UNPROCESSABLE_ENTITY;
                $this->response['data']       = $response['status'];
            }

            $this->response["message"] = $response['message'];
        } catch (QueryException $e) {
            $this->response['message'] = "Something went wrong in query" . $e->getMessage();
        } catch (Exception $e) {
            $this->response['message'] = $e->getMessage();
        }
        return $this->returnResponse();
    }
    function getBookings(Request $request, BookingService $bookingService)
    {
        try {
            $response     = $bookingService->getBookings($request);
            $this->status = Response::HTTP_OK;
            $this->response["message"]    = __("BOOKING_FETCHED");
            $this->response['data']       = $response;
        } catch (Exception $e) {
            $this->response['message'] = $e->getMessage();
        }
        return $this->returnResponse();
    }

    function getBooking(SingleBookingRequest $request, BookingService $bookingService)
    {
        try {
            $response     = $bookingService->getSingleBookingDetail($request);
            $this->status = Response::HTTP_OK;
            $this->response["message"]    = __("BOOKING_FETCHED");
            $this->response['data']       = $response;
        } catch (ModelNotFoundException $e) {
            $this->response['message'] = __("BOOKING_DATA_NOT_FOUND");
        } catch (Exception $e) {
            $this->response['message'] = $e->getMessage();
        }
        return $this->returnResponse();
    }
}
