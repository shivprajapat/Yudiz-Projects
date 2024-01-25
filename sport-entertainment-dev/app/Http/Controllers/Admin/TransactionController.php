<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PaymentStatusEnums;
use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index()
    {
        $currentYear = Carbon::now()->format('Y');
        $previousYear = $currentYear - 1;

        $earnings = [
            'total' => intval(Transaction::sum('commission')),
            'current_month' => intval(Transaction::whereMonth('transaction_date', Carbon::now()->format('m'))->sum('commission')),
            'current_year' => intval(Transaction::whereYear('transaction_date', $currentYear)->sum('commission')),
            'previous_year' => intval(Transaction::whereYear('transaction_date', $previousYear)->sum('commission')),
        ];
        return view('admin.pages.payments.index', compact('earnings'))->with(['custom_title' => 'Payments']);
    }
    public function update(Request $request, $id)
    {
        $content = ['status'=>204, 'message'=>"something went wrong"];
        if(!empty($request->action) && $request->action == 'processed_all') {
            foreach($request->ids as $id) {
                $payment = Transaction::find($id);
                $payment->payment_transfer_status = PaymentStatusEnums::PROCESSED->value;
                $payment->save();
            }
            $content['status']=200;
            $content['message'] = "Records processed successfully.";
            $content['count'] = Transaction::all()->count();
        }
        return response()->json($content);
    }
    public function destroy(Request $request, string $id)
    {
        $content = ['status'=>204, 'message'=>"something went wrong"];
        if(!empty($request->action) && $request->action == 'delete_all') {
            $content = ['status' => 204, 'message' => "something went wrong"];
            Transaction::whereIn('id', explode(',', $request->ids))->delete();
            $content['status'] = 200;
            $content['message'] = "Transactions deleted successfully.";
            $content['count'] = Transaction::all()->count();
            return response()->json($content);
        }
    }

    public function listing(Request $request)
    {
        extract($this->DTFilters($request->all()));
        $records = [];
        if($request->selected_column == 'payment_status_end_user') {
            $option = $request->selected_option == PaymentStatusEnums::SUCCESS->value ? PaymentStatusEnums::SUCCESS->value : PaymentStatusEnums::FAILED->value ;
            $payments = Transaction::where('payment_status_end_user', $option)->with('user', 'batch');
        } elseif($request->selected_column == 'payment_transfer_status') {
            $option = $request->selected_option == PaymentStatusEnums::PROCESSED->value ? PaymentStatusEnums::PROCESSED->value : PaymentStatusEnums::PENDING->value ;
            $payments = Transaction::where('payment_transfer_status', $option)->with('user', 'batch');
        } elseif($request->selected_column == 'transaction_date') {
            $option = Carbon::createFromFormat('d/m/Y', $request->selected_option)->format('Y-m-d');
            $payments = Transaction::where('transaction_date', $option)->with('user', 'batch');
        } else {
            $payments = Transaction::with('user', 'batch');
        }

        if ($sort_column == 'user_name') {
            $sort_column = 'users.first_name';
        }
        elseif($sort_column == 'coaching_name') {
            $sort_column = 'coaching_centres.coaching_name';
        }
        elseif($sort_column == 'batch_name') {
            $sort_column = 'batches.name';
        }

        $payments->join('users', 'transactions.user_id', '=', 'users.id')
                    ->join('coaching_centres', 'transactions.coaching_centre_id', '=', 'coaching_centres.id')
                    ->join('batches', 'transactions.batch_id', '=', 'batches.id')
                    ->select('transactions.*');

        if ($search != '') {
            $payments->where(function ($query) use ($search) {
                $query->where('transaction_id', 'like', "%{$search}%")
                    ->orWhere('transaction_date', 'like', "%{$search}%")
                    ->orWhere('transaction_time', 'like', "%{$search}%")
                    ->orWhere('total_amount', 'like', "%{$search}%")
                    ->orWhere('commission', 'like', "%{$search}%")
                    ->orWhere('amount_paid_to_owner', 'like', "%{$search}%")
                    ->orWhere('payment_status_end_user', 'like', "%{$search}%")
                    ->orWhere('payment_transfer_status', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('batch', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                          ->orWhereHas('coachingCentre', function ($t) use ($search) {
                              $t->where('coaching_name', 'like', "%{$search}%");
                          });
                    });
            });
        }

        $count = $payments->count();

        $records['recordsTotal'] = $count;
        $records['recordsFiltered'] = $count;
        $records['data'] = [];

        $payments = $payments->offset($offset)->limit($limit)->orderBy($sort_column, $sort_order);

        $payments = $payments->latest()->get();
        foreach ($payments as $payment) {

            $params = [
                'checked' => ($payment->is_active ? 'checked' : ''),
                'getaction' => $payment->is_active,
                'class' => '',
                'id' => $payment->id,
            ];

            $records['data'][] = [
                'id' => $payment->id,
                'transaction_id' => $payment->transaction_id	,
                'transaction_date' => $payment->transaction_date. ' | ' .$payment->transaction_time,
                'user_name' => $payment->user->first_name . ' ' . $payment->user->last_name,
                'coaching_name' => $payment->batch->coachingCentre->coaching_name ?? '',
                'batch_name' => $payment->batch->name ?? '',
                'total_amount' => $payment->total_amount,
                'commission' => $payment->commission,
                'amount_paid_to_owner' => $payment->amount_paid_to_owner,
                'payment_status_end_user' => $payment->payment_status_end_user ==  PaymentStatusEnums::SUCCESS->value ? "<span  class='font-weight-bold text-success' style='border: 1px solid; padding:3px;'>Success</span>" : "<span class='font-weight-bold text-danger' style='border: 1px solid; padding:3px;'>Failed </span>",
                'payment_transfer_status' => $payment->payment_transfer_status == PaymentStatusEnums::PROCESSED->value ? "<span  class='font-weight-bold text-success'>Processed</span>" : "<span class='font-weight-bold text-danger'> Pending </span>",
                'active' => view('admin.layouts.includes.switch', compact('params'))->render(),
                'checkbox' => view('admin.layouts.includes.checkbox')->with('id', $payment->id)->render(),
                'updated_at' => $payment->updated_at,
            ];

        }
        return $records;
    }
}
