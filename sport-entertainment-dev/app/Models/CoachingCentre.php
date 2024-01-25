<?php

namespace App\Models;

use App\Http\Resources\Api\SportsResource;
use App\Notifications\CoachingResetPassword;
use App\Notifications\RejectCoachingCentre;
use App\Traits\UUID;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class CoachingCentre extends Authenticatable
{
    use HasFactory, HasUuids, Notifiable;

    protected $fillable = [
        'id', 'first_name', 'last_name', 'email', 'mobile_number', 'password', 'coaching_name', 'logo', 'location_name', 'experience', 'bio', 'facility',
        'contact_number', 'contact_email', 'address_line1', 'address_line2', 'city_id', 'state_id', 'pincode', 'lat', 'long', 'profile_photo',
        'account_person_name', 'bank_name', 'account_number', 'ifsc_code', 'signup_date_time', 'is_admin_approve', 'terms_and_condition'
    ];

    public function bannerImages()
    {
        return $this->hasMany(BannerImage::class, 'coaching_centre_id', 'id');
    }

    public function offeredSports()
    {
        // return $this->belongsToMany(Sports::class,'coaching_centre_offered_sports','coaching_centre_id','sport_id');
        return $this->hasMany(CoachingCentreOfferedSport::class, 'coaching_centre_id', 'id');
    }
    public function sports()
    {
        return $this->belongsToMany(Sports::class, 'coaching_centre_offered_sports', 'coaching_centre_id', 'sport_id');
        // return $this->hasMany(CoachingCentreOfferedSport::class, 'coaching_centre_id','id');
    }

    public function coachingCentreImages()
    {
        return $this->hasMany(CoachingCentreImages::class, 'coaching_centre_id', 'id');
    }
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new CoachingResetPassword($token));
    }
    public function sendRejectCoachingCentreReasonNotification()
    {
        $this->notify(new RejectCoachingCentre());
    }
    public function state()
    {
        return $this->belongsTo(State::class);
    }
    public function city()
    {
        return $this->belongsTo(City::class);
    }
    public function facilities()
    {
        return $this->belongsToMany(Facility::class);
    }
    public function batches()
    {
        return $this->hasMany(Batch::class, 'coaching_centre_id', 'id');
    }

    function getCoachingCentreReview()
    {
        return 4.3;
    }
    function getTotalCountCoachingReview()
    {
        return 98;
    }

    function getDistance()
    {
        return 2.7 . " km";
    }

    // function getCoachingCentreAddress()
    // {
    //     return $this->address_line1 . " ," . $this->address_line2;
    // }
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
    public function device()
    {
        return $this->hasOne(DeviceToken::class, 'coaching_centre_id', 'id');
    }

    /** for api only */
    public function dashboardOfferedSport()
    {
        // dd($this->id);
        if (auth('sanctum')->user()) {
            $sports =  auth('sanctum')->user()->favoriteSports()->get();
            if ($sports->isNotEmpty()) {
                $sports_ids = $sports->pluck('id')->toArray();
                $mergedCollection = collect();
                $sportD = $this->offeredSports->whereIn("sport_id", $sports_ids);
                foreach ($sportD as $key => $sport) {
                    if ($sport->sport && in_array($sport->sport->id, $sports_ids)) {
                        // dump($sport->sport->id);
                        if ($key >= 5) {
                            break;
                        }
                        $mergedCollection->push($sport->sport);
                    }
                }
                // dd($mergedCollection->toArray());
                if ($mergedCollection->isEmpty()) {
                    return [];
                }

                return $mergedCollection;
            }
        } else {
            //in mobile screen only five sport display so after 5 remove this
            return $this->favoriteSportsData();
        }
    }

    /** if no any favorite sports  */
    function favoriteSportsData()
    {
        $mergedCollection = collect();
        foreach ($this->offeredSports as $key => $sport) {
            if ($key >= 5) {
                break;
            }
            if ($sport->sport) {
                $mergedCollection->push($sport->sport);
            }
        }
        return SportsResource::collection($mergedCollection);
    }
}
