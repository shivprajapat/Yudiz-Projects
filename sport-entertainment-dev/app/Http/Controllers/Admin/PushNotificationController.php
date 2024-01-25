<?php

namespace App\Http\Controllers\Admin;

use App\Enums\FaqTypeEnums;
use App\Http\Controllers\Controller;
use App\Jobs\NotificationJob;
use App\Models\{DeviceToken, Notification, NotificationStatus};
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PushNotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('admin.pages.push_notifications.index')->with(['custom_title' => 'Push Notification Management']);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.pages.push_notifications.create')->with(['custom_title' => 'Notification']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $notificationTokens = [];
        $status = [];
        $request->validate([
            'user_type' => 'required',
            'subject' => 'required',
            'message' => 'required',
        ]);
        try {
            DB::beginTransaction();
            $deviceTokensQuery = DeviceToken::whereNotNull('device_token');

            if (!empty($request->user_type)) {
                $deviceTokensQuery->where('login_type', $request->user_type);
            }

            $deviceTokens = $deviceTokensQuery->get();

            if ($deviceTokens->isNotEmpty()) {
                $notificationData = [
                    'key' => 'push_notification',
                    'value' => 'Push Notification Send By Admin',
                    'user_type' => $request->user_type ?? 'All',
                    'subject' => $request->subject,
                    'message' => $request->message,
                    'image' => '',
                    'type' => 'admin_notification',
                ];

                $dbNotification = Notification::create($notificationData);
                foreach ($deviceTokens as $token) {
                    $status[] = [
                        'user_id'           =>   $token->user_id ?? null,
                        'coaching_centre_id'=>   $token->coaching_centre_id ?? null,
                        'notification_id'   =>  $dbNotification->id,
                        'is_read'           =>  'n',
                        'created_at'        =>  \Carbon\Carbon::now(),
                        'updated_at'        =>  \Carbon\Carbon::now(),
                    ];
                    $notificationTokens[] = $token;
                }
                NotificationStatus::insert($status);
                $notificationJob =  new NotificationJob($notificationData, $notificationTokens, $dbNotification->id);
                dispatch($notificationJob);
                DB::commit();
                flash('Push Notification Sent successfully!')->success();
            } else {
                flash('Unable to find users.')->error();
            }
            return redirect(route('admin.push-notifications.index'));
        } catch(QueryException $e) {
            DB::rollBack();
            return redirect()->back()->with('error', $e->getMessage());
        } catch(Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Notification $pushNotification)
    {
        return view('admin.pages.push_notifications.view', compact('pushNotification'))->with(['custom_title' => 'Push Notification']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        if (!empty($request->action) && $request->action == 'delete_all') {
            $content = ['status' => 204, 'message' => "something went wrong"];
            Notification::whereIn('id', explode(',', $request->ids))->delete();
            $content['status'] = 200;
            $content['message'] = "Notifications deleted successfully.";
            $content['count'] = Notification::all()->count();
            return response()->json($content);
        } else {
            $pushNotification= Notification::where('id', $id)->firstOrFail();
            $pushNotification->delete();
            if (request()->ajax()) {
                $content = array('status' => 200, 'message' => "Notification deleted successfully.", 'count' => Notification::all()->count());
                return response()->json($content);
            } else {
                flash('Notification deleted successfully.')->success();
                return redirect()->route('admin.push_notifications.index');
            }
        }
    }

    /* Listing Details */
    public function listing(Request $request)
    {
        extract($this->DTFilters($request->all()));
        $records = [];

        if($request->user_type) {
            $user_type = $request->user_type == 'end_user' ? FaqTypeEnums::END_USER : FaqTypeEnums::COACHING_CENTRE ;
            $notifications = Notification::where('user_type', $user_type);
        } else {
            $notifications = Notification::query();
        }

        if ($search != '') {
            $notifications->where(function ($query) use ($search) {
                $query->where('subject', 'like', "%{$search}%")
                ->orWhere('message', 'like', "%{$search}%")
                ->orWhere('user_type', 'like', "%{$search}%")
                ->orWhere('created_at', 'like', "%{$search}%");
            });
        }

        $count =$notifications->count();

        $records['recordsTotal'] = $count;
        $records['recordsFiltered'] = $count;
        $records['data'] = [];

        $notifications =$notifications->offset($offset)->limit($limit)->orderBy($sort_column, $sort_order);

        $notifications =$notifications->latest()->get();
        foreach ($notifications as $key => $notification) {

            $params = [
                'class' => '',
                'id' => $notification->id,
            ];

            $records['data'][] = [
                'id' => $notification->id,
                'sr_no' => ++$key,
                'user_type' => $notification->user_type,
                'title' => $notification->subject,
                'message' => $notification->message,
                'active' => view('admin.layouts.includes.switch', compact('params'))->render(),
                'action' => view('admin.layouts.includes.actions')->with(['custom_title' => 'Coaching Centre Cms Page', 'id' => $notification->id], $notification)->render(),
                'checkbox' => view('admin.layouts.includes.checkbox')->with('id', $notification->id)->render(),
                'created_at' => $notification->created_at->format('d/m/Y'). ' | ' .$notification->created_at->format('H:i:s'),
                'updated_at' => $notification->updated_at,
            ];
        }
        return $records;
    }
}
