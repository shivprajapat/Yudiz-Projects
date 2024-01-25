<?php

namespace App\Http\Controllers\Api\EndUser;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CoachingCentreIdRequest;
use App\Http\Services\BatchService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;;

class BatchController extends Controller
{
    //
    function batchDetail(Request $request, BatchService $batchService)
    {
        try {
            $this->response["data"]       = $batchService->getBatchDetail($request);
            $this->status = Response::HTTP_OK;
            $this->response["message"]    = __("BATCH_FETCHED");
        } catch (ModelNotFoundException $e) {
            $this->response["message"] = __('BATCH_NOT_FOUND');
        } catch (Exception $e) {
            $this->response["message"] = $e->getMessage();
        }
        return $this->returnResponse();
    }

    function getBatchesByCoachingCentre(CoachingCentreIdRequest $request, BatchService $batchService)
    {
        try {
            $this->response["data"] = $batchService->allBatchesByCoachingCentre($request);
            $this->status = Response::HTTP_OK;
            $this->response["message"] = __("BATCH_FETCHED");
        } catch (ModelNotFoundException $e) {
            $this->response["message"] = __('BATCH_NOT_FOUND');
        } catch (Exception $e) {
            $this->response["message"] = $e->getMessage();
        }
        return $this->returnResponse();
    }
}
