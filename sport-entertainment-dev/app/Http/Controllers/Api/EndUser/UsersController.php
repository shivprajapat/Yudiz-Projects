<?php

namespace App\Http\Controllers\Api\EndUser;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\EndUser\UserFavoriteSportsRequest;
use App\Http\Requests\Api\UserSignUpRequest;
use App\Http\Resources\Api\UserInfoResource;
use App\Http\Services\EndUserAuthService;
use App\Models\Sports;
use Exception;
use Illuminate\Http\Response;

class UsersController extends Controller
{

    function userInfo()
    {
        try {
            $user = auth()->user();
            $this->response["data"] = new UserInfoResource($user);
            $this->status = Response::HTTP_OK;
            $this->response["message"] = __("USER_INFO_FETCHED");
        } catch (Exception $e) {
            $this->response["message"] = $e->getMessage();
        }
        return $this->returnResponse();
    }

    function updateUser(UserSignUpRequest $request, EndUserAuthService $userService)
    {
        try {
            $user = auth()->user();
            $user = $userService->updateUser($request);

            $this->response["data"] = new UserInfoResource($user);
            $this->status = Response::HTTP_OK;
            $this->response["message"] = __("USER_UPDATED_SUCCESS");
        } catch (Exception $e) {
            $this->response["message"] = $e->getMessage();
        }
        return $this->returnResponse();
    }

    function favoriteSports(UserFavoriteSportsRequest $request, EndUserAuthService $userService)
    {
        try {
            $favoriteSports = $userService->addUpdateFavoriteSports($request);
            $this->response["data"] = $favoriteSports;
            $this->status = $favoriteSports ? Response::HTTP_OK : Response::HTTP_UNPROCESSABLE_ENTITY;
            $this->response["message"] = $favoriteSports ? __("FAVORITE_SPORTS_UPDATED") : __("SOMETHING_WENT_WRONG");
        } catch (Exception $e) {
            $this->response["message"] = $e->getMessage();
        }
        return $this->returnResponse();
    }
    function logout()
    {
        try {
            $user = auth()->user();
            // Device Token Set NULL
            if ($user->device) {
                $user->device->token = NULL;
                $user->device->save();
            }
            auth()->user()->currentAccessToken()->delete();
            $this->status = Response::HTTP_OK;
            $this->response["message"] = __("LOGOUT_SUCCESS");
        } catch (Exception $e) {
            $this->response["message"] = $e->getMessage();
        }
        return $this->returnResponse();
    }

    function getPopularSports(EndUserAuthService $endUserAuthService)
    {
        try {
            $sports = $endUserAuthService->getSportsWithPopular();
            $this->status = Response::HTTP_OK;
            $this->response["data"] = $sports;
            $this->response["message"] = __("SPORTS_FETCHED_SUCCESSFULLY");
        } catch (Exception $e) {
            $this->response["message"] = $e->getMessage();
        }
        return $this->returnResponse();
    }
}
