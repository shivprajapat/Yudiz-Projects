<?php

namespace App\Http\Requests;

use App\Rules\GreaterStartDate;
use App\Rules\GreterEndTime;
use Illuminate\Foundation\Http\FormRequest;

class StoreBatchRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        //this function is used for the when edit the data.
        // if (request()->isMethod("put")) {
        //     $isPut = "true";
        // }
        if (!request()->wantsJson()) {
            return [
                "name"              => ["required"],
                "start_date"        => ["required"],
                "end_date"          => ["required", new GreaterStartDate(request('start_date'))],
                "sport_id"          => ["required"],
                "age_id"            => ["required"],
                "batch_size"        => ["required"],
                "booked_batch_size" => ["nullable"],
                "session_days"      => ["required"],
                "start_time"        => ["required"],
                "end_time"          => ["required", new GreterEndTime()],
                "number_of_session" => ["required", "numeric"],
                "price"             => ["required"],
                // "actual_price"      => ["required"],
                "brief_details"     => ["required"],
                "live_status"       => ["nullable"],
                "completion_status" => ["nullable"],
            ];
        }
        return [];
    }
}
