<?php

namespace App\Broadcasting;

use App\Enums\FaqTypeEnums;
use App\Models\CoachingCentre;
use App\Models\NotificationStatus;
use App\Models\User;
use Illuminate\Notifications\Notification;

class PushNotificationChannel
{
    public function send($notifiable, Notification $notification)
    {
        if($notifiable) {
            $message = $notification->data;

            $n_data = [
                'subject'     =>  $message['subject'],
                'badge'       =>  NotificationStatus::whereUserId($notifiable->id)->orWhere('coaching_centre_id',$notifiable->id)->whereIsRead('n')->count(),
            ];

            $data = [
                'subject'           =>  $message['subject'],
                'body'              =>  $message['message'],
                'key'               =>  $message['key'] ?? "",
                'value'             =>  $message['value'] ?? "",
                'user_type'         =>  $message['user_type'] ?? "",
                'image_url'         => ($message['image'] !== null) ? generate_url($message['image']) : "",
                'type'              =>  $message['type'] ?? "general-notification",
            ];

            $send_notification = [
                'priority'                  =>  'high',
                'to'                        =>  $notifiable->device->token,
                'content_available'         =>  true,
                'mutable_content'           =>  true,
            ];

            if ($notifiable->device->device_type == 'android') {
                $send_notification['registration_ids'] = [$notifiable->device->device_token];
                $n_data['body'] = str_limit($message['message'], 50);
                $n_data['sound'] = 'default';
                $n_data['image'] = ($message['image'] !== null) ? generate_url($message['image']) : "";
                $notification_data = $n_data;
                $n_data = array_merge($n_data, $data);

                $send_notification['notification'] = $notification_data;
                $send_notification['data'] = $n_data;
            } elseif($notifiable->device->device_type == 'ios') {
                $send_notification['registration_ids'] = [$notifiable->device->device_token];
                $n_data['body'] = str_limit($message['message'], 50);
                $n_data['sound'] = 'default';
                $send_notification['notification'] = $n_data;
                $send_notification['data'] = $data;
            }
            else{
                $send_notification['registration_ids'] = [$notifiable->device->device_token];
                $n_data['message'] = str_limit($message['message'], 50);
                $n_data['sound'] = 'default';
                $send_notification['notification'] = $n_data;
                $send_notification['data'] = $data;
            }

            $data = json_encode($send_notification);
            $headers = ['Content-Type:application/json', 'Authorization:key=' . config('utility.google.fcm')];
            $result = fire_curl('https://fcm.googleapis.com/fcm/send','POST',$headers,$data);
            return (object)$result;

        }
    }
}
