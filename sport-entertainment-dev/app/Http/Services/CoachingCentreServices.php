<?php

namespace App\Http\Services;

use App\Http\Resources\Api\{
    BatchResource,
    CoachingCentreResource,
    CoachingCentreBannerImageResource,
    FacilitiesResource,
    OfferedSportsResource
};
use App\Models\CoachingCentre;
use App\Models\Facility;


class CoachingCentreServices
{
    function getCoachingInfo($request)
    {
        $coachingCentre = CoachingCentre::with(["coachingCentreImages"])->where("id", $request->coaching_centre_id)->firstOrFail();
        $coachingInfoData = [];

        $coachingCentre->load("offeredSports", "offeredSports.sport");

        $coachingInfoData = [
            "banner_images" => $this->getCoachingCentreImages($coachingCentre->coachingCentreImages ?? []),
            "coaching_info" =>  new CoachingCentreResource($coachingCentre),
            "offered_sports" =>  OfferedSportsResource::collection($coachingCentre->offeredSports),
            "facilities" => $this->getFacilities($coachingCentre),
        ];
        return $coachingInfoData;
    }

    function getCoachingCentreImages($coachingCentreImages, $image_type = "only_banner")
    {
        $bannerImages = $images = [];
        $bannerImageLimit = config('utility.banner_image_limit');
        /** if only_banner then apply where only banner condition is  ::::pending **/
        if ($image_type == "only_banner" && $coachingCentreImages->isNotEmpty()) {
            $images = $coachingCentreImages->where('is_banner', '1')->take($bannerImageLimit);
            //if no any banner images found then we show the all images for banner images
            if ($images->isEmpty()) {
                $images = $coachingCentreImages->take($bannerImageLimit);
            }
        } else if ($image_type == "all_images" && $coachingCentreImages->isNotEmpty()) {
            $images = $coachingCentreImages;
        }

        $bannerImages = CoachingCentreBannerImageResource::collection($images);
        return $bannerImages;
    }
    function getFacilities($coachingCentre)
    {
        $facilities = [];
        if (isset($coachingCentre->facility)) {
            $facilities = explode(',', $coachingCentre->facility);
            $facilities = Facility::select('id', 'name')->whereIn('id', $facilities)->get();
            $facilities = FacilitiesResource::collection($facilities);
        }
        return $facilities;
    }

    function getReviewCoachingCentre($coaching_centre_id)
    {
        // $totalReview = Coa
    }
}
