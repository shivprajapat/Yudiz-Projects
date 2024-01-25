<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class sendOtpRequest extends FormRequest
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
            "mobile_number" => ['required', 'digits:10', 'regex:/^[0-9]+$/']
        ];
    }
}
