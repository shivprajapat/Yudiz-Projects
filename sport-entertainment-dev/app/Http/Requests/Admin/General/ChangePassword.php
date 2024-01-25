<?php

namespace App\Http\Requests\Admin\General;

use Illuminate\Foundation\Http\FormRequest;

class ChangePassword extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'current_password' => 'required|min:8',
			'password' => 'required|min:8|max:15',
			'confirm_password' => 'required|min:8|max:15|same:password',
        ];
    }
}
