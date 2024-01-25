<?php

namespace App\Http\Controllers\Api\EndUser;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\SportsResource;
use App\Models\Sports;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SportController extends Controller
{
    //
    function getSports(Request $request)
    {
        try {
            $sprots = Sports::where('is_active', "1")->get();
            $this->response["data"] = SportsResource::collection($sprots);
            $this->status = Response::HTTP_OK;
            $this->response["message"] = __("SPORTS_DATA_FETCHED");
        } catch (Exception $e) {
            $this->response["message"] = $e->getMessage();
        }
        return $this->returnResponse();
    }
}
