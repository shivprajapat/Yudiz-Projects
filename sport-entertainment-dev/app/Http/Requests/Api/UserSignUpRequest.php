<?php

namespace App\Http\Requests\Api;

use App\Rules\DateFormatRule;
use App\Rules\DobRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Routing\Route;

class UserSignUpRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    protected $stopOnFirstFailure = true;
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
        // dd(request('dob'));
        $rule = [];
        if (request()->route()->getName() == "api.updateUser") {
        // if (Route::currentRouteName() == "api.updateUser") {
            $rule =  [
                "first_name"     => ["required", 'max:50', 'regex:/^[a-zA-Z]+$/'],
                "last_name"      => ["required", 'max:50', 'regex:/^[a-zA-Z]+$/'],
                "gender"         => ["required", 'in:1,0'],
                "dob"            => ["required", new DateFormatRule(), 'bail', new DobRule()],
                "profile_photo"  => ["nullable", "mimes:png,jpg,jpeg"],
                "state_id"       => ["required"],
                "city_id"        => ["required"],
                "address_line_1" => ["required"],
                "address_line_2" => ["required"],
                "pin_code"       => ["required", "numeric"],
            ];
        } else {
            $rule =  [
                "first_name"     => ["required", 'max:50', 'regex:/^[a-zA-Z]+$/'],
                "last_name"      => ["required", 'max:50', 'regex:/^[a-zA-Z]+$/'],
                "mobile_number"  => ["required", 'regex:/^[0-9]+$/', 'digits:10', 'unique:users,mobile_number'],
                "gender"         => ["required", 'in:1,0'],
                "dob"            => ["required", new DateFormatRule(), 'bail', new DobRule()],
                "profile_photo"  => ["nullable", "mimes:png,jpg,jpeg"],
                "state_id"       => ["required"],
                "city_id"        => ["required"],
                "address_line_1" => ["required"],
                "address_line_2" => ["required"],
                "pin_code"       => ["required", "numeric"],
            ];
        }
        return $rule;
    }

    public function messages()
    {
        return [
            'gender.in'           => __("GENDER_MALE_FEMALE"),
            'profile_photo.mimes' => __("UPLOAD_IMG_VALIDATION")
        ];
    }
}
