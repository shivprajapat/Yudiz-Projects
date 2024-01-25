<?php

namespace App\Http\Requests\Admin;

use App\Rules\GreaterStartDate;
use App\Rules\GreterEndTime;
use Illuminate\Foundation\Http\FormRequest;

class BatchRequest extends FormRequest
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
        $unless = request()->action;
            return [
                'name'           => ['required_unless:action,'.$unless,'min:3','max:50'],
                'start_date'     => ['required_unless:action,'.$unless],
                'end_date'       => ['required_unless:action,'.$unless, new GreaterStartDate(request('start_date'))],
                'sport_id'       => ['required_unless:action,'.$unless],
                'age_id'         => ['required_unless:action,'.$unless],
                'batch_size'     => ['required_unless:action,'.$unless,'integer'],
                'booked_batch_size' => ['nullable'],
                'session_days'   => ['required_unless:action,'.$unless],
                'start_time'     => ['required_unless:action,'.$unless],
                'end_time'       => ['required_unless:action,'.$unless, new GreterEndTime()],
                'number_of_session' => ['required_unless:action,'.$unless, 'integer'],
                'price'          => ['required_unless:action,'.$unless,],
                'brief_details'  => ['required_unless:action,'.$unless,'min:5','max:255'],
                'live_status'    => ['nullable','boolean'],
                'completion_status' => ['nullable','boolean'],
            ];
    }

    public function messages()
    {
        return [
            'name.required_unless'       => 'The batch name field is required.',
            'start_date.required_unless' => 'The start date field is required.',
            'end_date.required_unless'   => 'The end date field is required.',
            'age_id.required_unless'     => 'The age groups field is required.',
            'sport_id.required_unless'   => 'The sports name field is required.',
            'batch_size.required_unless' => 'The batch size field is required.',
            'session_days.required_unless' => 'The session days field is required.',
            'start_time.required_unless' => 'The start time field is required.',
            'end_time.required_unless'   => 'The end time field is required.',
            'number_of_session.required_unless' => 'The number of session field is required.',
            'price.required_unless'      => 'The price field is required.',
            'actual_price.required_unless' => 'The actual price field is required.',
            'brief_details.required_unless' => 'The brief details is required.',
        ];
    }
}

