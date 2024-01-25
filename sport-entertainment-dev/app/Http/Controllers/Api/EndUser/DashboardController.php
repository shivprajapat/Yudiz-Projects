<?php

namespace App\Http\Controllers\Api\EndUser;

use App\Http\Controllers\Controller;
use App\Http\Services\DashBoardServices;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DashboardController extends Controller
{
    //
    function dashboard(Request $request, DashBoardServices $dashBoardServices)
    {
        try {
            $this->response["data"] = $dashBoardServices->dashboard($request);
            $this->status = Response::HTTP_OK;
            $this->response["message"] = __("DASHBOARD_DATA_FETCHED");
        } catch (Exception $e) {
            $this->response["message"] = $e->getMessage();
        }
        return $this->returnResponse();
    }
}
