<?php

namespace App\Http\Requests\Coaching;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCoachingCentreRequest extends FormRequest
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
        $step = request("step_name") ?? "";

        switch ($step) {
            case 'personal_details':
                return [
                    "first_name" => ["required", "max:60", 'regex:/^[a-zA-Z\s]+$/'],
                    "last_name" => ["required", "max:60", 'regex:/^[a-zA-Z\s]+$/'],
                    "email" => ["required",],
                    "mobile_number" => ["required", "max:60", 'regex:/^[0-9]+$/', 'digits:10'],
                ];
                break;
            case 'coaching_centre_contact_details':
                return [
                    "contact_number" => ["required", 'regex:/^[0-9]+$/', 'numeric'],
                    "contact_email" => ["required", 'email'],
                    "address_line1" => ["required", 'min:10', "max:200"],
                    "address_line2" => ["nullable", 'min:10', "max:200"],
                ];
                break;
            case 'bank_details':
                return [
                    "account_person_name" => ["required", 'max:50', 'regex:/^[a-zA-Z\s]+$/'],
                    "bank_name" => ["required", 'max:50', 'regex:/^[a-zA-Z\s]+$/'],
                    "account_number" => ["required", 'max:50'],
                    "ifsc_code" => ["required", 'max:50'],
                ];
                break;
            case 'coaching_centre_details':
                return [
                    "coaching_name" => ["required", 'max:50', 'regex:/^[a-zA-Z\s]+$/'],
                    "experience" => ["required"],
                    "bio" => ["required",'min:10', 'max:500', 'regex:/^[a-zA-Z\s]+$/'],
                    "sport_id" => ["required", 'array', 'exists:sports,id'],
                    "facility" => ["required"],
                    "logo" => ["nullable", 'image'],                    
                ];
                break;

            default:
                # code...
                break;
        }
    }
}
