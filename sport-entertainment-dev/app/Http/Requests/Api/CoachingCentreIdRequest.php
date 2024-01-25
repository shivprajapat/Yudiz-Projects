<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class CoachingCentreIdRequest extends FormRequest
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
            "coaching_centre_id" => ['required']
        ];
    }
    function messages()
    {
        return [
            'coaching_centre_id.required' => __("COACHING_CENTRE_ID_REQUIRED"),
        ];
    }
}
