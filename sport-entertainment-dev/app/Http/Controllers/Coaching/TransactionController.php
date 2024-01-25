<?php

namespace App\Http\Controllers\Coaching;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class TransactionController extends Controller
{
    //
    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            extract($this->DTFilters($request->all()));
            $records = [];
            $earnings = Transaction::orderBy($sort_column, $sort_order);

            if ($search != '') {
                $batches->where(function ($query) use ($search) {
                    $query->where('commission', 'like', "%{$search}%")
                        ->orWhere('transaction_date', 'like', "%{$search}%")
                        ->orWhere('total_amount', 'like', "%{$search}%")
                        ->orWhere('amount_paid_to_owner', 'like', "%{$search}%");
                });
            }

            $count = $earnings->count();

            $records['recordsTotal'] = $count;
            $records['recordsFiltered'] = $count;
            $records['data'] = [];
            $earnings = $earnings->offset($offset)->limit($limit)->orderBy($sort_column, $sort_order);
            $earnings = $earnings->latest()->get();
            $routeName = Route::currentRouteName();
            foreach ($earnings as $key => $earning) {
                $records['data'][] = [
                    // 'no' => ++$key,
                    'transaction_id' => $earning->transaction_id,
                    'transaction_date' => Carbon::parse($earning->transaction_date)->format("d/m/Y"),
                    'payment_transfer_status' => $earning->payment_transfer_status == "success" ? "<span  class='font-weight-bold text-success'>  $earning->payment_transfer_status </span>" : "<span class='font-weight-bold text-danger'>  $earning->payment_transfer_status </span>",
                    'total_amount' => $earning->total_amount,
                ];
            }
            return $records;
        }
        return view('coaching.pages.earnings.view');
    }
}
