<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class RoleDetails extends FormRequest
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
        $unless = 'change_status';
        $id = (!empty(\Route::current()->parameters()['role']->id) ? ',' . \Route::current()->parameters()['role']->id : '');
        return [
            'first_name' => 'required_unless:action,' . $unless . '|max:150',
            'last_name' => 'required_unless:action,' . $unless . '|max:150',
            'email' => 'required_unless:action,' . $unless . '|email|max:80|unique:admins,email' . $id,
            'contact_number' => 'required_unless:action,' . $unless . '|digits_between:6,15|unique:admins,contact_number' . $id,
            'roles' => 'required_unless:action,' . $unless . '',
        ];
    }
}
