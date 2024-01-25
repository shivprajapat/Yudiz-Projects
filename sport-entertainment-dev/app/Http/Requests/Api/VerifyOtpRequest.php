<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class VerifyOtpRequest extends FormRequest
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
        return [
            'mobile_number' => ['required', 'regex:/^[0-9]+$/', 'digits:10'],
            "otp"           => ["required", "numeric"],
        ];
    }
    function messages()
    {
        return [
            'mobile_number.required' => __("MOBILE_NO_REQUIRED"),
            "mobile_number.regex"    => __("MOBILE_NO_NOT_VALID"),
            "mobile_number.digits"   => __("MOBILE_NO_ONLY_DIGIT"),
        ];
    }
}
