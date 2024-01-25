<?php

namespace App\Http\Services;

use App\Enums\OtpStatus;
use App\Enums\ScreenEnum;
use App\Http\Resources\Api\SportsResource;
use App\Models\{Participant, SendOtp, Sports, User, UserFavoriteSport};
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;

class EndUserAuthService
{
    /**
     * @param string $mobile_number
     * @return
     * @throws Exception
     */

    public function sendOtp($mobile_number)
    {
        $otp = false;
        if (isset($mobile_number)) {
            $otp = mt_rand(100000, 999999);  // here logic for otp generation
            SendOtp::updateOrCreate(["mobile_number" => $mobile_number], ["otp" => $otp]);
        }
        return ["otp" => $otp];
    }

    public function verifyUserOtp($request)
    {
        SendOtp::where(["mobile_number" => $request->mobile_number, "otp" => $request->otp])->firstOrFail();
        $user =  User::where('mobile_number', $request->mobile_number)->first();
        if ($user) {
            $participants   = Participant::where('user_id', $user->id)->get();
            $favoriteSports = $user->favoriteSports();
            $token          = $user->generateSanctumToken();
            if ($favoriteSports->count()) {
                $data = [
                    "status"         => true,
                    "user_status"    => (OtpStatus::USER_ALREADY_REGISTRED)->value,
                    "screen_to_show" => (ScreenEnum::DASHBOARD_SCREEN)->value,
                    "token"          => $token,
                    "screen_msg"     => __("WELCOME_TO_SCREEN"),
                ];
            } else {
                if ($participants->isEmpty()) {
                    $data = [
                        "status"         => true,
                        "user_status"    => (OtpStatus::USER_ALREADY_REGISTRED)->value,
                        "screen_to_show" => (ScreenEnum::PARTICIPANT_SCREEN)->value,
                        "token"          => $token,
                        "screen_msg"     => __("PARTICIPANT_SCREEN_MSG"),
                    ];
                } else {
                    $data = [
                        "status"         => true,
                        "user_status"    => (OtpStatus::USER_ALREADY_REGISTRED)->value,
                        "screen_to_show" => (ScreenEnum::FAVORITE_SCREEN)->value,
                        "token"          => $token,
                        "screen_msg"     => __("FAVORITE_SCREEN_MSG"),
                    ];
                }
            }
        } else {
            $data = [
                "status"         => true,
                "user_status"    => (OtpStatus::USER_NOT_REGISTRED)->value,
                "screen_to_show" => (ScreenEnum::SIGNUP_SCREEN)->value,
                "screen_msg"     => __("NOT_REGISTERED_USER"),
            ];
        }
        return $data;
    }

    /**
     * @param array $data
     * @return User
     * @throws Exception
     */
    public function registerUser($data)
    {
        return DB::transaction(function () use ($data) {
            $data["custom_id"] = get_unique_string();
            // $data['dob']       = Carbon::createFromFormat('d-m-Y', $data['dob'])->format("Y-m-d");
            $data['dob']       = convertDateYmd($data['dob']);
            return User::create($data);
        });
    }

    function updateUser($request)
    {
        return DB::transaction(function () use ($request) {
            $validateData    = $request->validated();
            // dd($validateData);
            $user            = User::where('id', auth()->user()->id)->firstOrFail();
            // $validateData['dob']       = convertDateYmd($data['dob']);
            $validateData['profile_photo'] = imageUpload($request, 'profile_photo', 'users', $user->profile_photo);
            $validateData['dob'] =  convertDateYmd($validateData['dob']);
            $user->update($validateData);
            return $user->refresh();
        });
    }

    function addUpdateFavoriteSports($data)
    {
        // $sports    = explode(',', $data->sport_ids);
        // dd($sports);
        $sports    = $data->sport_ids;
        // dd($sports);
        $userId    = auth()->user()->id;
        $isSuccess = DB::transaction(function () use ($userId, $sports) {
            // dd($sports);
            foreach ($sports as  $sport) {
                $addUpdateSport = [
                    "sport_id" => $sport,
                    "user_id"  => $userId,
                ];
                UserFavoriteSport::updateOrCreate(
                    $addUpdateSport,
                    $addUpdateSport
                );
            }
            return true;
        });
        return $isSuccess ?? false;
    }

    function getSportsWithPopular()
    {
        $popularSports = Sports::where('is_active', 1)
            ->where('is_popular', 1)
            ->get();

        $nonPopularSports = Sports::where('is_active', 1)
            ->where('is_popular', 0)
            ->get();

        $data = [
            "popular_sports" => SportsResource::collection($popularSports),
            "all_sports"     => SportsResource::collection($nonPopularSports)
        ];
        return $data;
    }
}
