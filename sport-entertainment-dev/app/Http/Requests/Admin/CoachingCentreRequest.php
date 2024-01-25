<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Route;

class CoachingCentreRequest extends FormRequest
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
        $id = (!empty(Route::current()->parameters()['coaching_centre']->id) ? Route::current()->parameters()['coaching_centre']->id : null);

        return [
            "first_name" => ['required_unless:action,'.$unless, 'max:50', 'regex:/^[a-zA-Z\s]+$/'],
            "last_name" => ['required_unless:action,'.$unless, 'max:50', 'regex:/^[a-zA-Z\s]+$/'],
            "email" => ['required_unless:action,'.$unless, 'unique:coaching_centres,email,'.$id.',id,deleted_at,NULL'],
            "mobile_number" => ['required_unless:action,'.$unless, 'regex:/^[0-9]+$/', 'digits:10'],
            "coaching_name" => ['required_unless:action,'.$unless, 'max:100'],
            "logo" => ["nullable",'image'],
            // "offered_sports[]" => ['required_unless:action,'.$unless],
            "experience" => ['required_unless:action,'.$unless],
            "bio" => ['required_unless:action,'.$unless, 'min:10', 'max:500'],
            // "facilities[]" => ['required_unless:action,'.$unless],
            "contact_number" => ['required_unless:action,'.$unless, 'regex:/^[0-9]+$/', 'numeric'],
            "contact_email" => ['required_unless:action,'.$unless, 'email'],
            "address_line1" => ['required_unless:action,'.$unless, 'min:10', "max:200"],
            "address_line2" => ['required_unless:action,'.$unless, 'min:10', "max:200"],
            "city_id" => ['required_unless:action,'.$unless],
            "state_id" => ['required_unless:action,'.$unless],
            "pincode" => ['required_unless:action,'.$unless, 'numeric'],
            "lat" => ["nullable"],
            "long" => ["nullable"],
        ];
    }

    public function messages()
    {
        return [
            'offered_sports[].required_unless' => 'The offered sports field is required unless action is in change_status.',
            'facilities[].required_unless' => 'The facilities field is required unless action is in change_status.'
        ];

    }
}
