<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Route;

class UserRequest extends FormRequest
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
        $unless = "change_status";
        $id = (!empty(Route::current()->parameters()['user']->id) ? Route::current()->parameters()['user']->id : null);
        return [
            'first_name'        =>  ['required_unless:action,'.$unless,'regex:/^[a-zA-Z]+$/','max:50','min:3'],
            'last_name'         =>  ['required_unless:action,'.$unless,'regex:/^[a-zA-Z]+$/','max:50','min:3'],
            'email'             =>  ['required_unless:action,'.$unless,'max:50','unique:users,email,'.$id.',id,deleted_at,NULL'],
            'gender'            =>  ['required_unless:action,'.$unless,'in:1,0'],
            'dob'               =>  ['required_unless:action,'.$unless],
            "address_line_1"    =>  ['required_unless:action,'.$unless, 'min:5', "max:200"],
            "address_line_2"    =>  ['required_unless:action,'.$unless, 'min:5', "max:200"],
            "city_id"           =>  ['required_unless:action,'.$unless],
            "state_id"          =>  ['required_unless:action,'.$unless],
            "pin_code"          =>  ['required_unless:action,'.$unless, 'numeric'],
            'profile_photo'     =>  ['nullable','mimes:jpeg,jpg,png'],
            'participants.*.first_name' => ['required','alpha','max:50','min:3','regex:/^\S*$/'],
            'participants.*.last_name' => ['required','alpha','max:50','min:3','regex:/^\S*$/'],
            'participants.*.dob' => ['required','date'],
            'participants.*.school_name' => ['required','max:255'],
        ];
    }
    public function messages()
    {
        return [
                'participants.*.first_name.required' => 'The first name field is required.',
                'participants.*.first_name.min'      => 'The first name must be at least 3 characters.',
                'participants.*.first_name.max'      => 'The first name must not be more than 50 characters.',
                'participants.*.first_name.alpha'    => 'The first name must only contain letters.',
                'participants.*.first_name.regex'    => 'The first name must not have space.',
                'participants.*.last_name.required'  => 'The last name field is required.',
                'participants.*.last_name.min'       => 'The last name must be at least 3 characters.',
                'participants.*.last_name.max'       => 'The last name must not be more than 50 characters',
                'participants.*.last_name.alpha'     => 'The last name must only contain letters.',
                'participants.*.last_name.regex'     => 'The last name must not have space.',
                'participants.*.dob.required'        => 'The date of birth field is required.',
                'participants.*.dob.date'            => 'The date of birth is not a valid date.',
                'participants.*.school_name.max'     => 'The school name must not be more than 255 characters.',
               ];
    }
}
