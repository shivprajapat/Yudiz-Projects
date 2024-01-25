<?php

namespace App\Http\Requests\Api;

use App\Rules\DateFormatRule;
use App\Rules\DobRule;
use Illuminate\Foundation\Http\FormRequest;

class ParticipantRequest extends FormRequest
{
    protected $stopOnFirstFailure = true;
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
        $rules = [
            "first_name"     => ["required"],
            "last_name"      => ["required"],
            "gender"         => ["required", 'in:0,1'],
            "dob"            => ["required", new DateFormatRule(), 'bail', new DobRule()],
            "school_name"    => ["required"],
            "state_id"       => ["required"],
            "city_id"        => ["required"],
            "address_line_1" => ["required"],
            "address_line_2" => ["required"],
            "pin_code"       => ["required"],
        ];
        return $rules;
    }

    function messages()
    {
        return [
            'dob.date'  => __("DATE_OF_BIRTH_INVALID"),
            'gender.in' => __("GENDER_MALE_FEMALE"),
        ];
    }
}
