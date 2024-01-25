<?php

namespace App\Http\Services;

use App\Http\Resources\Api\{
    BannerImageResource,
    CoachingCentreResource,
    SportsResource
};
use App\Http\Resources\Api\EndUser\DashboardCoachingResource;
use App\Models\{
    BannerImage,
    CoachingCentre,
    Sports,
    UserFavoriteSport
};
use Illuminate\Support\Facades\DB;

class DashBoardServices
{
    function dashboard($data)
    {
        return [
            // "sports" =>  $this->getAllSports(),
            "banner_images" => $this->getBannerImage(),
            "users_sports" => $this->userSelectedSports(),
            "coaching_centres" => $this->coachingWithSport($data),
        ];
    }

    function userSelectedSports()
    {
        if (auth('sanctum')->user()) {
            // dashboard
            $sports = auth('sanctum')->user()->favoriteSports();
            if ($sports->count() > 1) {
                $sport = $sports->get();
                return SportsResource::collection($sport);
            }
            return [];
        } else {
            $this->getAllSports();
        }
    }
    function getAllSports()
    {
        $sports = Sports::SportActive()->get();
        return SportsResource::collection($sports);
    }

    function getBannerImage()
    {
        $bannerImages = BannerImage::select("id", "coaching_centre_id", "banner_image", "banner_type", "redirect_url", "banner_note")->where('is_active', '1')->limit(5)->get();
        return BannerImageResource::collection($bannerImages);
    }
    /** get all coaching centre list with the sports details */
    function coachingWithSport($data)
    {
        //is admin approve request condition is not apply.
        //all type of filter is pending. //age group and review rating
        //review count and how many of review is pending
        $limit = config('utility.limit');
        $page_no = $page_no ?? 1;
        $skip = (($page_no - 1) < 0 ? "0" : ($page_no - 1)) * $limit;
        $coachingCentres  = [];

        $coachingCentres = CoachingCentre::with(['city:id,name', "offeredSports:sport_id,coaching_centre_id", "offeredSports.sport:id,name,logo"])->select('coaching_name', 'logo', 'id', 'address_line1', 'address_line2', 'city_id')->skip($skip)->take($limit)->get();

        if ($coachingCentres->isEmpty()) {
            return $coachingCentres;
        }

        return  DashboardCoachingResource::collection($coachingCentres);
    }
}
