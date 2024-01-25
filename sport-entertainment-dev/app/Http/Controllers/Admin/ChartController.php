<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ChartController extends Controller
{
    public function getRegisterUser(Request $request)
    {
        $filterBy = $request->filterBy;
        switch ($filterBy) {
            case 'week':
                $startDate = Carbon::now()->startOfWeek();
                $endDate = Carbon::now()->endOfWeek();
                $dateFormat = 'l';
                $datasetLabel = "This Week";
                $period = CarbonPeriod::create($startDate, $endDate);
                break;
            case 'month':
                $startDate = Carbon::now()->startOfMonth();
                $endDate = Carbon::now()->endOfMonth();
                $dateFormat = 'd';
                $filterBy = "Month";
                $datasetLabel = "This Month";
                $period = CarbonPeriod::create($startDate, $endDate);
                break;
            case '3 month':
                $startDate = Carbon::now()->subMonths(2)->startOfMonth();
                $endDate = Carbon::now()->endOfMonth();
                $dateFormat = 'F';
                $datasetLabel = "3 Months";
                $period = CarbonPeriod::create($startDate, '1 month', $endDate);
                break;
            case '6 month':
                $startDate = Carbon::now()->subMonths(5)->startOfMonth();
                $endDate = Carbon::now()->endOfMonth();
                $dateFormat = 'F';
                $datasetLabel = "6 Months";
                $period = CarbonPeriod::create($startDate, '1 month', $endDate);
                break;
            case 'year':
                $startDate = Carbon::now()->startOfYear();
                $endDate = Carbon::now()->endOfYear();
                $dateFormat = 'F';
                $datasetLabel = "This Year";
                $period = CarbonPeriod::create($startDate, '1 month', $endDate);
                break;
            case 'overall':
                //set cache for oldest record  never change  in the production
                cache()->forget('oldest-record'); //forget cache recorde change on development
                $old_date = cache()->rememberForever('oldest-record', function () {
                    return User::selectRaw('created_at')->orderBy('created_at', 'asc')->first();
                });
                $startDate = Carbon::parse($old_date->created_at)->startOfYear();
                $endDate = Carbon::now()->endOfYear();
                $dateFormat = 'Y';
                $datasetLabel = "Overall";
                $period = CarbonPeriod::create($startDate, '1 year', $endDate);
                break;
            case 'custom':
                $startDate = Carbon::parse($request->startDate)->startOfDay();
                $endDate = Carbon::parse($request->endDate)->endOfDay();
                $datasetLabel = "Custom Range";
                $diffInDays = $startDate->diffInDays($endDate);
                if ($diffInDays <= 31) {
                    $dateFormat = 'd-F';
                    $period = CarbonPeriod::create($startDate, $endDate);
                } elseif ($diffInDays <= 365) {
                    $dateFormat = 'F';
                    $period = CarbonPeriod::create($startDate, '1 month', $endDate);
                } elseif ($diffInDays > 365) {
                    $dateFormat = 'Y';
                    $period = CarbonPeriod::create($startDate, '1 year', $endDate);
                }
                break;
            default:
                # code...
                break;
        }

        // Iterate over the period
        foreach ($period as $date) {
            $labels[] = $date->format($dateFormat);
        }

        $users = User::whereBetween('created_at', [$startDate, $endDate])->orderBy('created_at')->get()->groupBy(function ($user) use ($dateFormat) {
            return Carbon::parse($user->created_at)->format($dateFormat);
        });
        //getting all keys
        $users_keys = array_keys($users->toArray());

        foreach ($labels as $label) {
            $user_count = in_array($label, $users_keys) ? count($users[$label]) :  0;
            $data[]  = $user_count;
        }

        $all_zero = true;
        foreach ($data as $value) {
            // any value not equal then zerot then array all data zero
            if ($value != '0') {
                $all_zero = false;
                break;
            }
        }
        //$data array all value zero then we unset $data for disable download options of the chart
        if ($all_zero == true) {
            unset($data);
            $data = [];
        }

        return response()->json(compact('datasetLabel', 'labels', 'data'));
    }

    public function getActiveDeactiveUser()
    {
        $users = User::get()->groupBy('is_active');
        $datasetLabel = "Active - Deactive Users";
        $labels = ["Active", "Deactive"];
        $active_users = isset($users['1']) ? count($users['1']) : 0;
        $deactive_users = isset($users['0']) ? count($users['0']) : 0;
        $data = [$active_users, $deactive_users];

        return response()->json(compact('datasetLabel', 'labels', 'data'));
    }
}
