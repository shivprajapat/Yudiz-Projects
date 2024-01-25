<?php

namespace App\Http\Controllers\Api\EndUser;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CoachingCentreIdRequest;
use App\Http\Services\CoachingCentreServices;
use App\Models\{CoachingCentre, CoachingCentreImages};
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CoachingCentreController extends Controller
{
    //
    function coachingInfo(Request $request,  CoachingCentreServices $coachingCentreServices)
    {
        try {
            $this->response["data"] = $coachingCentreServices->getCoachingInfo($request);
            $this->status = Response::HTTP_OK;
            $this->response["message"] = __("COACHING_CENTRE_INFO_FETCHD");
        } catch (ModelNotFoundException $e) {
            $this->response["message"] = __("COACHING_NOT_FOUND");
        } catch (Exception $e) {
            $this->response["message"] = $e->getMessage();
        }
        return $this->returnResponse();
    }
    function bannerImages(CoachingCentreIdRequest $request, CoachingCentreServices $coachingCentreServices)
    {
        try {
            $coachingCentreImage = CoachingCentreImages::where("coaching_centre_id", $request->coaching_centre_id)->get();
            $this->response["data"] = $coachingCentreServices->getCoachingCentreImages($coachingCentreImage);
            $this->status = Response::HTTP_OK;
            $this->response["message"] = __("COACHING_BANNER_IMAGE_FETCHED");
        } catch (ModelNotFoundException $e) {
            $this->response["message"] = __("COACHING_BANNER_IMAGE_NOT_FOUND");
        } catch (Exception $e) {
            $this->response["message"] = $e->getMessage();
        }
        return $this->returnResponse();
    }

    function allImages(Request  $request, CoachingCentreServices $coachingCentreServices)
    {
        try {
            $coachingCentreImages = CoachingCentreImages::select('id', 'coaching_centre_id', 'image_path', 'is_active', 'is_banner')->where("coaching_centre_id", $request->coaching_centre_id)->get();
            if ($coachingCentreImages->isNotEmpty()) {
                $this->response["data"] = $coachingCentreServices->getCoachingCentreImages($coachingCentreImages, "all_images");
                $this->response["message"] = __("COACHING_CENTRE_IAMGE_FETCHED");
            } else {
                $this->response["data"] = null;
                $this->response["message"] = __("COACHING_CENTRE_IAMGE_NOT_FOUND");
            }
            $this->status = Response::HTTP_OK;
        } catch (ModelNotFoundException $e) {
            $this->response["message"] = __("COACHING_CENTRE_NOT_FOUND");
        } catch (Exception $e) {
            $this->response["message"] = $e->getMessage();
        }
        return $this->returnResponse();
    }
}
