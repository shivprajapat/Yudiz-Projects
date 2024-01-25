<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class PushNotificationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        $unless = "change_status";
        return [
            'user_type'     =>  'required_unless:action,'.$unless,
            'subject'       =>  'required_unless:action,'.$unless.'|min:3|max:500',
            'message'       =>  'required_unless:action,'.$unless.'|min:3',
        ];
    }
}
