<?php

namespace App\Jobs;

use App\Notifications\PushNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class NotificationJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;
    protected $notification;
    protected $tokens = [];
    protected $notification_id;


    /**
     * Create a new job instance.
     */
    public function __construct($notification, $tokens, $notification_id)
    {
        $this->notification = $notification;
        $this->tokens = $tokens;
        $this->notification_id = $notification_id;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        if(count($this->tokens) > 0)
       {
            foreach($this->tokens as $token)
            {
                $user = $token->user ?? $token->coachingCentre ;
                $user->notify(new PushNotification($this->notification));
                $response = [
                    'status' => 'success',
                    'message' => 'notification added! successfully'
                ];
                return (object) $response;
            }

        }


    }
}
