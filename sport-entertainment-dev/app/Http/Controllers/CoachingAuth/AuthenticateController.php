<?php

namespace App\Http\Controllers\CoachingAuth;

use App\Enums\AdminApproveEnums;
use App\Enums\DeviceTypeEnums;
use App\Enums\FaqTypeEnums;
use App\Http\Controllers\Controller;
use App\Http\Requests\Coaching\{
    LoginCoachingRequest,
    RegisterCoachingRequest,
    UpdatePasswordRequest
};
use App\Models\{
    City,
    CoachingCentre,
    CoachingCentreOfferedSport,
    DeviceToken,
    Facility,
    Sports,
    State
};
use Carbon\Carbon;
use Exception;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{
    Auth,
    DB,
    Hash,
    Password,
};

class AuthenticateController extends Controller
{

    public function showLoginForm()
    {
        return view('coaching.auth.login');
    }

    public function verifyLoginDetails(LoginCoachingRequest  $request)
    {
        $isLoginSuccess = Auth::guard('coaching')->attempt($request->validated());
        if ($isLoginSuccess) {
            $coachingUser = Auth::guard('coaching')->user();
            if ($coachingUser->is_admin_approve == (AdminApproveEnums::PENDING_APPROVAL)->value) {
                Auth::guard('coaching')->logout();
                flash(__("YOUR_ACCOUNT_NOT_APPROVE"))->error();
                return to_route('coaching.login');
            } else if ($coachingUser->is_admin_approve == (AdminApproveEnums::REJECT)->value) {
                Auth::guard('coaching')->logout();
                flash(__("YOUR_ACCOUNT_REJECTED"))->error();
                return to_route('coaching.login');
            } else {
                Auth::guard('coaching')->setUser($coachingUser);
                DeviceToken::updateOrCreate([
                    'coaching_centre_id'   => auth('coaching')->user()->id, 'type' => DeviceTypeEnums::WEB->value, 'device_type' => DeviceTypeEnums::WEB->value,
                    'login_type' => FaqTypeEnums::COACHING_CENTRE->value
                ], ['device_token' => $request->web_token]);
                return to_route('coaching.dashboard');
            }
        }
        flash("test message ")->success();  // :::: pending the toaster is not display front side
        return to_route('coaching.login');
    }

    public function showRegistrationForm()
    {
        $sports = Sports::select('name', 'id', 'logo')->onlyactive()->get();
        $states = State::all();
        $cities =  City::all();
        return view('coaching.auth.register', ['sports' => $sports, "states" => $states, "cities" => $cities]);
    }

    public function store(RegisterCoachingRequest $request)
    {
        // dump("validation is done ");
        try {

            DB::transaction(function () use ($request) {
                $coachingValidatedFields = $request->validated();
                $path = null;
                if ($request->hasFile("logo")) {
                    $path =  imageUpload($request, "logo", "coaching/photo");
                }


                // dump(json_encode(getTagifyValue($request->facility)));

                $coachingValidatedFields["password"] = Hash::make($coachingValidatedFields["password"]);
                $coachingValidatedFields["facility"] = $this->getFacilityValue($request->facility) ?? "";
                $coachingValidatedFields["logo"] = $path;
                $coachingValidatedFields["is_admin_approve"] = (AdminApproveEnums::PENDING_APPROVAL)->value;
                $coachingValidatedFields["signup_date_time"] = Carbon::now()->format("Y-m-d H:i:s");
                $coaching = CoachingCentre::create($coachingValidatedFields);
                // dd($coachingValidatedFields["facility"]);

                if (isset($request->sport_id) && count($request->sport_id)) {
                    $coaching_id = $coaching->id;
                    array_map(function ($id) use ($coaching_id) {
                        CoachingCentreOfferedSport::create(['coaching_centre_id' => $coaching_id, 'sport_id' => $id]);
                    }, $request->sport_id);
                }
            });
        } catch (Exception $e) {
            dd($e->getMessage() . "File Name::" . $e->getFile() . "Line No::" . $e->getLine());
        }
        return to_route('coaching.login')->with("success", "Coaching center registered successfully");
    }

    public function showForgotPassword(Request $request)
    {
        return view("coaching.auth.passwords.forgot_password");
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $status = Password::broker("coachings")->sendResetLink(
            $request->only('email')
        );

        $isSend = null;
        if ($status === Password::INVALID_USER) {
            $isSend = false;
        } else if ($status === Password::RESET_THROTTLED) {
            $isSend = false;
        } else if ($status === Password::RESET_LINK_SENT) {
            $isSend = true;
        }


        if ($isSend) {
            return to_route('coaching.showForgotPassword')->with('status', "Password is sent successfully.");
        }

        return to_route('coaching.showForgotPassword')->withErrors(['email' => __($status)]);
    }

    public function showResetForm(Request $request, $token = null)
    {
        return view('coaching.auth.passwords.reset')->with(
            ['token' => $token, 'email' => $request->email]
        );
    }

    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        DB::enableQueryLog();
        $status = Password::broker("coachings")->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (CoachingCentre $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(\Illuminate\Support\Str::random(60));
                $user->save();
                event(new PasswordReset($user));
            }
        );
        // dd($status);
        $isSend = null;
        if ($status === Password::INVALID_USER) {
            $isSend = false;
        } else if ($status === Password::INVALID_TOKEN) {
            $isSend = false;
        } else if ($status === Password::PASSWORD_RESET) {
            $isSend = true;
        }
        // dump(DB::getQueryLog());
        // dump($isSend);
        // dd($status);
        if ($isSend) {
            return to_route('coaching.login')->with('status', "Password is reset successfully please login .");
        }
        // dd($status);
        return redirect()->back()->withErrors(['email' => __($status)]);
        // dd($status);
        // return $status === Password::PASSWORD_RESET
        //     ? redirect()->route('login')->with('status', __($status))
        //     : back()->withErrors(['email' => [__($status)]]);
    }

    private function getFacilityValue($facility)
    {
        if ($facility) {
            $facility = getTagifyValue($facility);
            if ($facility) {
                $getFacilityId =   array_map(function ($fac) {
                    $facilities =  Facility::updateOrCreate(
                        ["name" => $fac],
                        [
                            "name" =>  $fac
                        ]
                    );
                    return $facilities->id;
                }, $facility);
                return  implode(",", $getFacilityId);
            }
            return false;
        } else {
            return null;
        }
    }

    public function changePassword()
    {
        return view('coaching.pages.general.change_password');
    }
    public function updatePassword(UpdatePasswordRequest $request)
    {
        auth('coaching')->user()->update(['password' => Hash::make($request->password)]);
        flash("Password is updated successfully.")->success();
        return to_route("coaching.dashboard");
    }

    public function logout()
    {
        $device_token = DeviceToken::where('coaching_centre_id', auth('coaching')->user()->id)->first();
        auth('coaching')->logout();
        if ($device_token) {
            $device_token->device_token = null;
            $device_token->save();
        }
        // DeviceToken::where('coaching_centre_id',auth('coaching')->user()->id)->update([]);
        return to_route('coaching.login');
    }

    public function isEmailRegistred(Request $request)
    {
        // dd($request->all());
        $isExists = CoachingCentre::where("email", $request->email)->first();
        if ($isExists) {
            return true;
        }
        return false;
    }
}
