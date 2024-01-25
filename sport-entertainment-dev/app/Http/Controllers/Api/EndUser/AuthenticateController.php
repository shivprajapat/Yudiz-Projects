<?php

namespace App\Http\Controllers\Api\EndUser;

use App\Enums\DeviceTypeEnums;
use App\Enums\FaqTypeEnums;
use App\Enums\OtpStatus;
use App\Enums\ScreenEnum;
use App\Enums\UserTypeEnums;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\{
    isRegisterRequest,
    sendOtpRequest,
    UserSignUpRequest,
    VerifyOtpRequest,
};
use App\Http\Resources\Api\UserInfoResource;
use App\Http\Services\EndUserAuthService;
use App\Models\DeviceToken;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
/**
 * @group Authenticated
 */
class AuthenticateController extends Controller
{
    public function __construct(private EndUserAuthService $endUserAuthService)
    {
    }

    // public function checkRegistration(isRegisterRequest $request)
    // {
    //     try {
    //         //if mobile number is already registered then send otp service is called otherwise sign up
    //         $mobileStatus = null;
    //         $isFound = User::where("mobile_number", $request->mobile_number)->first();
    //         if ($isFound && $isFound->is_active == "1") {
    //             $mobileStatus = true;
    //             $this->endUserAuthService->sendOtp($request->mobile_number);
    //             $this->response["message"] = __("OTP_SEND_SUCCESS");
    //         } else {
    //             $mobileStatus = false;
    //             $this->response["message"] = __("GO_TO_SIGN_UP");
    //         }

    //         $this->status = Response::HTTP_OK;
    //         $this->response["data"] = $mobileStatus;
    //     } catch (Exception $e) {
    //         $this->response["message"] = $e->getMessage();
    //     }
    //     return $this->returnResponse();
    // }

    /**
     * send otp
     * @group OTP
     * @param \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function sendResendOtp(sendOtpRequest $request)
    {
        try {
            $response = $this->endUserAuthService->sendOtp($request->mobile_number);
            $this->status = Response::HTTP_OK;
            $this->response["message"]    = __('OTP_SEND_SUCCESS');
            $this->response['data']       = $response;
        } catch (Exception $e) {
            $this->response['message'] = $e->getMessage();
        }
        return $this->returnResponse();
    }

    public function verifyOtp(VerifyOtpRequest $request)
    {
        try {
            $data = $this->endUserAuthService->verifyUserOtp($request);
            $this->response["message"]    = __("OTP_VERIFIED");
            $this->response['data']       = $data;
            $this->status = Response::HTTP_OK;
        } catch (ModelNotFoundException $e) {
            $this->status = Response::HTTP_OK;
            $this->response["message"]    = __("OTP_NOT_VERIFIED");
            $this->response['data']       = [
                "status" => false,
                "user_status" => (OtpStatus::OTP_NOT_VERIFIED)->value,
                "screen_to_show" => (ScreenEnum::VERIFY_OTP_SCREEN)->value,
                "screen_msg" => __("OTP_NOT_VERIFIED")
            ];
        } catch (Exception $e) {
            $this->response['message'] = $e->getMessage();
        }
        return $this->returnResponse();
    }

    public function signUp(UserSignUpRequest $request)
    {
        try {
            $response = $this->endUserAuthService->registerUser($request->validated());
            $this->response['data']       = new UserInfoResource($response);
            $this->response['token']      = $response->generateSanctumToken();
            $this->response['message']    = __("USER_REGISTRED_SUCCESS");
            $this->status = Response::HTTP_CREATED;
        } catch (Exception $e) {
            $this->response['message'] = $e->getMessage();
        }
        return $this->returnResponse();
    }

    // Store End User Device Token For Notification
    public function deviceToken(Request $request)
    {
        $rules = [
            'token'         =>  'required|string|min:10',
            'device_type'   =>  'required|in:android,ios',
        ];
        if ($this->apiValidator($request->all(), $rules)) {
            try {
                DeviceToken::updateOrCreate(
                    [
                        'user_id'   => $request->user()->id,
                        'type' => DeviceTypeEnums::APP->value,
                        'device_type' => $request->device_type == DeviceTypeEnums::ANDROID->value ? DeviceTypeEnums::ANDROID->value : DeviceTypeEnums::IOS->value,
                        'login_type' => FaqTypeEnums::END_USER->value
                    ],
                    ['device_token' => $request->token]
                );


                $this->response['message']  =  trans('api.update', ['entity' => __("Device token")]);
                $this->status =  Response::HTTP_OK;
            } catch (ModelNotFoundException $exception) {
                switch ($exception->getModel()) {
                    case 'App\Models\DeviceToken':
                        $this->response['message'] = trans('api.not_found', ['entity' => __("Device token")]);
                        break;

                    default:
                        $this->response['message'] = trans('api.went_wrong');
                        break;
                };
            }
        }
        $this->response['url'] = url()->current();
        $this->response['api'] = $this->getVersion();
        return $this->return_response();
    }
}
