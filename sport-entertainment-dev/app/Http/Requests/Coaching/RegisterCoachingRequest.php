<?php

namespace App\Http\Requests\Coaching;

use Illuminate\Foundation\Http\FormRequest;

class RegisterCoachingRequest extends FormRequest
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
        return [
            "first_name" => ["required", 'max:50', 'regex:/^[a-zA-Z\s]+$/'],
            "last_name" => ["required", 'max:50', 'regex:/^[a-zA-Z\s]+$/'],
            "email" => ["required", 'unique:coaching_centres,email'],
            "mobile_number" => ["required", 'regex:/^[0-9]+$/', 'digits:10'],
            "password" => ["required", "min:6", "confirmed"],
            "password_confirmation" =>  ["required", "min:6"],
            "coaching_name" => ["required", 'regex:/^[a-zA-Z\s]+$/', 'max:100'],
            "logo" => ["nullable", 'image'],
            // "location_name" => ["required"],
            "experience" => ["required"],
            "bio" => ["required", 'min:10', 'max:500'],
            "facility" => ["required"],
            "contact_number" => ["required", 'regex:/^[0-9]+$/', 'numeric'],
            "contact_email" => ["required", 'email'],
            "address_line1" => ["nullable", "max:200"],
            "address_line2" => ["nullable", "max:200"],
            "city_id" => ["required"],
            "state_id" => ["required"],
            "pincode" => ["required", 'numeric'],
            "lat" => ["nullable"],
            "long" => ["nullable"],
            "profile_photo" => ["nullable"],
            "account_person_name" => ["required", 'max:50', 'regex:/^[a-zA-Z\s]+$/'],
            "bank_name" => ["required", 'max:50', 'regex:/^[a-zA-Z\s]+$/'],
            "account_number" => ["required", 'max:50'],
            "ifsc_code" => ["required", 'max:50'],
            "signup_date_time" => ["nullable"],
            "is_admin_approve" => ["nullable"],
            "terms_and_condition" => ["nullable"],
        ];
    }
}
