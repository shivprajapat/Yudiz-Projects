<?php

namespace App\Http\Requests\Admin\General;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;


class ProfileUpdate extends FormRequest
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
            'first_name' => 'required|max:50',
			'email' => 'required|max:80|unique:admins,email,' . Auth::id(),
			'contact_number' => 'required|digits_between:6,15|unique:admins,contact_number,' . Auth::id(),
			'profile_avatar' => 'nullable|mimes:jpeg,jpg,png',
        ];
    }
}
