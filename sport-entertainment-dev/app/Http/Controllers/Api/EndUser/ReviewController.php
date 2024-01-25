<?php

namespace App\Http\Controllers\Api\EndUser;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\AddReviewRequest;
use App\Models\Review;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ReviewController extends Controller
{
    function addReview(AddReviewRequest $request)
    {
        try {
            $validatedReview = $request->validated();
            $validatedReview['users_id'] = auth()->user()->id;
            $validatedReview['review_post_date'] = Carbon::now()->format("Y-m-d");
            $validatedReview['end_time'] = Carbon::now()->format('g:i A');

            $reviewCreate =  Review::create($validatedReview);
            $this->status = Response::HTTP_CREATED;
            $this->response["message"] = __("REVIEW_CREATED");
            $this->response['data'] = $reviewCreate;
        } catch (Exception $e) {
            $this->response['message'] = $e->getMessage();
        }
        return $this->returnResponse();
    }
}
