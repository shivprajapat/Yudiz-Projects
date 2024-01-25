<?php

namespace App\Http\Controllers\Admin;

use App\Enums\{PaymentStatusEnums,StatusEnums};
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\General\ChangePassword;
use App\Http\Requests\Admin\General\ProfileUpdate;
use App\Models\{Admin,Batch,Booking,CoachingCentre,QuickLink,Role,Setting,Transaction,User};
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class PagesController extends Controller
{
    public function dashboard()
    {
        $data = [];
        $userQuery = User::query();
        $data['totalUsers'] = $userQuery->count();
        $data['currentMonthUsers'] = $userQuery->whereMonth("created_at", Carbon::now()->month)->whereYear("created_at", Carbon::now()->year)->count();
        $coachingCentres = CoachingCentre::query();
        $data['totalRegisteredCentres'] =  $coachingCentres->count();
        $data['currentMonthRegisteredCentres'] =  $coachingCentres->whereMonth("signup_date_time", Carbon::now()->month)->whereYear("signup_date_time", Carbon::now()->year)->count();
        $bookingQuery = Booking::query();
        $bookingQuery =  $bookingQuery->paymentStatusSuccess();
        $data['totalBooking'] = $bookingQuery->count();
        $data['currentMonthBooking'] = $bookingQuery->whereMonth("booking_date", Carbon::now()->month)->whereYear('booking_date', Carbon::now()->year)->count();
        $data['todayBooking'] = $bookingQuery->whereDate("booking_date", Carbon::today())->count();
        $batches = Batch::query();
        $data['totalActiveBatches'] = $batches->where('is_active', StatusEnums::ACTIVE)->count();
        $earningQuery = Transaction::where('payment_status_end_user', PaymentStatusEnums::SUCCESS);
        $data['totalEarnings'] = intval($earningQuery->sum('commission'));
        $data['currentMonthEarnings'] = intval($earningQuery
            ->whereMonth("transaction_date", Carbon::now()->month)
            ->whereYear("transaction_date", Carbon::now()->year)
            ->select('commission')
            ->sum('commission'));
        // $user['Count'] = User::count();
        // cache()->forget('oldest-record'); //forget cache recorde change on development
        // $old_date = cache()->rememberForever('oldest-record', function () {
        //     return User::selectRaw('created_at')->orderBy('created_at', 'asc')->first();
        // });

        // if (isset($old_date->created_at)) {
        //     $startDate = Carbon::parse($old_date->created_at)->startOfDay();
        //     $endDate = Carbon::now()->endOfDay();
        //     $diffInDays = $startDate->diffInDays($endDate);

        //     //diffInDays same date return 0 day and if date 4 and 5 diffInDays return 1 day
        //     $diffInDays = $diffInDays + 1;
        //     $user['PerDayCount'] = $diffInDays >= 1 ? number_format_short(floor(($user['Count'] / $diffInDays))) : 0; //Per Day Register User
        //     $user['PerWeekCount'] = $diffInDays >= 7 ? number_format_short(floor(($user['Count'] / ($diffInDays / 7)))) : 0; //Per Week Register User
        //     $user['Per30DayCount'] = $diffInDays >= 30 ? number_format_short(floor(($user['Count'] / ($diffInDays / 30)))) : 0; //Per 30 Day Register User
        //     $user['Count'] = number_format_short($user['Count']);
        // }
        return view('admin.dashboard', ['data' => $data])->with(['custom_title' => __('Dashboard')]);
    }
    public function profile()
    {
        $admin = Admin::findOrFail(auth()->id());

        return view('admin.pages.general.profile', compact('admin'))->with(['custom_title' => __('Edit Profile')]);
    }

    public function updateProfile(ProfileUpdate $request)
    {
        $user = Auth::user();

        if ($request->hasFile('profile_photo')) {
            Storage::delete($user->profile_photo);
            $user->profile_photo = imageUpload($request, 'profile_photo', "profileImage", $user->profile_photo);
        }

        $old_email = $user->email;

        $user->first_name = $request->first_name;
        $user->email = $request->email;
        $user->contact_number = $request->contact_number;
        if ($user->save()) {
            if ($old_email != $user->email) {
                Auth::guard('admin')->logout();
                return redirect()->guest(route('admin.login'));
                die;
            }
        }
        flash(trans('flash_message.update', ['entity' => 'Profile']))->success();
        return to_route('admin.profile');
    }

    public function updatePassword(ChangePassword $request)
    {
        // dd($request->all());
        if (Hash::check($request->current_password, Auth::user()->password)) {
            $user = Auth::user();
            $user->password = Hash::make($request->password);
            flash(trans('flash_message.password_change'))->success();
            $user->save();
        } else {
            flash(trans('flash_message.password_not_match'))->error();
        }
        return redirect()->route('admin.profile');
    }

    public function quickLink()
    {
        $roles = Role::where('is_display', 1)->with(['quickLinks'])->get();
        return view('admin.pages.general.quickLink', compact('roles'))->with(['custom_title' => __('Quick Link')]);
    }

    public function updateQuickLink(Request $request)
    {
        $user = Auth::user();
        if ($request->has('roles')) {
            //getting all requested roles id of quickLinks
            $requestedRoleIds = array_keys($request->roles);
            //getting admins all roles id of quickLinks
            $quickLinksRoleIds =  $user->quickLinks->pluck('role_id')->toArray();
            //getting diffQuickLinks data
            $diffQuickLinks = array_diff($quickLinksRoleIds, $requestedRoleIds);
            //getting role id values of diffQuickLinks
            $values = array_values($diffQuickLinks);
            if (count($values) > 0) {
                QuickLink::where('admin_id', $user->id)->whereIn('role_id', $values)->delete();
            }
            foreach ($request->roles as $key => $role) {
                if (!empty($role['permissions'])) {
                    $quickLink = QuickLink::updateOrCreate(
                        ['role_id' => $key, 'admin_id' => $user->id],
                        ['link_type' => implode(',', $role['permissions'])]
                    );
                }
            }
        } else {
            //quick links request empty then delete all quick links
            $user->quickLinks()->delete();
        }
        return redirect()->back();
    }

    public function showSetting()
    {

        $settings = Setting::where('editable', '=', 'y')->get();
        return view('admin.pages.general.settings', compact('settings'))->with(['custom_title' => 'Site Setting']);
    }

    public function changeSetting(Request $request)
    {
        $array = array();
        $flag = false;
        $cb_key = $cb_secret = '';
        foreach ($request->input() as $key => $value) {
            $setting = Setting::find($key);
            if ($setting) {
                if ($value != "" || $setting->required == "n") {
                    $setting->value = $value;
                    $setting->save();
                    $array[$setting->constant] = $value;

                    //Config::set('settings.' . $setting->constant, $setting->value);
                }
            }
        }

        //Image Uploading
        foreach ($request->file() as $key => $value) {
            $setting = Setting::find($key);
            if ($request->hasFile($key)) {
                // $file_pre = ($setting->constant == 'site_logo') ? 'logo.' : time() . '.';
                // $filename = $file_pre . $request->file($key)->getClientOriginalExtension();
                // $request->file($key)->move(public_path('frontend/images'), $filename);
                // $setting->value = 'frontend/images/' . $filename;
                // $setting->save();
                // $array[$setting->constant] = 'frontend/images/' . $filename;

                $path = $request->file($key)->store('frontend/site_logo');
                $setting->value = $path;
                $setting->save();
                $array[$setting->constant] = $path;
            }
        }

        //Non editable value
        $rem_settings = Setting::where('editable', '=', 'n')->get();
        foreach ($rem_settings as $key => $single) {
            $array[$single->constant] = $single->value;
        }
        flash(trans('flash_message.update', ['entity' => 'Settings']))->success();
        return redirect()->route('admin.settings.index');
    }
}
