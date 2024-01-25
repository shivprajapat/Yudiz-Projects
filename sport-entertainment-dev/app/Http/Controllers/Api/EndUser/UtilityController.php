<?php

namespace App\Http\Controllers\Api\EndUser;

use App\Enums\{
    CmsTypeEnums,
    FaqTypeEnums,
    StatusEnums
};
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CmsPageRequest;
use App\Http\Resources\Api\{
    AgeGroupResource,
    BannerDetailResource,
    CityResource,
    CmsPageResource,
    ContactUsResource,
    FaqsResource,
    StateResource
};
use App\Http\Resources\EndUser;
use App\Models\{
    AgeGroup,
    BannerImage,
    City,
    CmsPage,
    Faq,
    Setting,
    State
};
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class UtilityController extends Controller
{
    //
    function getCmsPage(CmsPageRequest $request)
    {
        try {
            $cmsPage = CmsPage::where('slug', $request->slug_type)->firstOrFail();
            $this->status = Response::HTTP_OK;
            $this->response["data"] = new CmsPageResource($cmsPage);
            $this->response["message"] = __("CMS_PAGE_FETCH");
        } catch (Exception $e) {
            $this->response["message"] = $e->getMessage();
        }
        return $this->returnResponse();
    }

    function getFaqs()
    {
        try {
            $faqs = Faq::where('faq_type', FaqTypeEnums::END_USER)->get();
            $this->status = Response::HTTP_OK;
            $this->response["data"] =  FaqsResource::collection($faqs);
            $this->response["message"] = __("FAQ_FETCH");
        } catch (Exception $e) {
            $this->response["message"] = $e->getMessage();
        }
        return $this->returnResponse();
    }

    function ageGroups(Request $request)
    {
        try {
            $ageGroups = AgeGroup::select("id", "age_name", "minimum_age", "maximum_age", "is_active")->where("is_active", StatusEnums::ACTIVE)->get();
            $this->status = Response::HTTP_OK;
            $this->response["data"] =  AgeGroupResource::collection($ageGroups);
            $this->response["message"] = __("AGE_GROUP");
        } catch (Exception $e) {
            $this->response["message"] = $e->getMessage();
        }
        return $this->returnResponse();
    }

    function getState()
    {
        try {
            $ages = State::select("id", "name")->get();
            $this->status = Response::HTTP_OK;
            $this->response["data"] =  StateResource::collection($ages);
            $this->response["message"] = __("STATE_FETCHED_SUCCESS");
        } catch (Exception $e) {
            $this->response["message"] = $e->getMessage();
        }
        return $this->returnResponse();
    }

    function getCities(Request $request)
    {
        try {
            $cities = City::select("id", "name")->where("state_id", $request->state_id)->get();
            $this->status = Response::HTTP_OK;
            $this->response["data"] =  CityResource::collection($cities);
            $this->response["message"] = __("CITY_FETCHED_SUCCESS");
        } catch (Exception $e) {
            $this->response["message"] = $e->getMessage();
        }
        return $this->returnResponse();
    }
    function getBannerDetail(Request $request)
    {
        try {
            $banner = BannerImage::select("id", "banner_image", "banner_note")->where("id", $request->banner_id)->firstOrFail();
            $this->status = Response::HTTP_OK;
            $this->response["data"] = new BannerDetailResource($banner);
            $this->response["message"] = __("BANNER_DETAIL_FETCHED");
        } catch (ModelNotFoundException $e) {
            $this->response["message"] = __("BANNER_NOT_FOUND");
        } catch (Exception $e) {
            $this->response["message"] = $e->getMessage();
        }
        return $this->returnResponse();
    }

    function contactUs()
    {
        try {
            $settings = Setting::whereIn("constant", ['support_contact', 'support_email', 'f_address'])->get()->keyBy('constant');

            $data = [
                "mobile_number" => $settings->get('support_contact')->value ?? "",
                "email" => $settings->get('support_email')->value ?? "",
                "address" => $settings->get('f_address')->value ?? "",
            ];
            $this->response["data"] = $data;
            $this->status = Response::HTTP_OK;
            $this->response["message"] = __("CONTACT_US_FETCHED_SUCCESSFULLY");
        } catch (Exception $e) {
            $this->response["message"] = $e->getMessage();
        }
        return $this->returnResponse();
    }

    function getDashboardFilter()
    {
        try {
            $ageGroups = AgeGroup::select("id", "age_name", "minimum_age", "maximum_age", "is_active")->where("is_active", StatusEnums::ACTIVE)->get();
            $ratings = [
                "desc" => __("HIGH_TO_LOW"),
                "asc"  =>  __("LOW_TO_HIGH"),
                "4"    =>  __("FOUR_PLUS")
            ];
            $data = [
                "age_groups" => AgeGroupResource::collection($ageGroups),
                "ratings" => $ratings,
            ];
            $this->response["data"] = $data;
            $this->status = Response::HTTP_OK;
            $this->response["message"] = __("FILTER_SUCCESSFULLY");
        } catch (Exception $e) {
            $this->response["message"] = $e->getMessage();
        }
        return $this->returnResponse();
    }
}
