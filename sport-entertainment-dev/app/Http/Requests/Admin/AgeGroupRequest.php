<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;

class AgeGroupRequest extends FormRequest
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

        $unless = "change_status";
        $id = (!empty(Route::current()->parameters()['age_group']->id) ? Route::current()->parameters()['age_group']->id : null);
        $method = request()->method();
        switch ($method) {
            case 'PUT':
                return [
                    'age_name'               =>  ['required_unless:action,'.$unless,'min:3', 'max:50', 'unique:age_groups,age_name,'.$id.',id,deleted_at,NULL'],
                    'minimum_age'            =>  ['required_unless:action,'.$unless,'min:0', 'max:100','numeric',],
                    'maximum_age'            =>  ['required_unless:action,'.$unless,'min:0', 'max:100','numeric','gt:minimum_age'],
                ];
                break;
            case "POST":
                return [
                   'age_name'                =>  ['required','min:3', 'max:50', Rule::unique('age_groups')->whereNull('deleted_at')],
                    'minimum_age'            =>  ['required','numeric','min:0', 'max:100','numeric'],
                    'maximum_age'            =>  ['required','numeric', 'min:0', 'max:100','numeric','gt:minimum_age'],
                ];
                break;
        }
    }

    public function messages()
    {
        return [
            "age_name.required_unless" => "The age group name field is required.",
            "age_name.min"             =>  "The age group name must be at least 3 characters.",
            "age_name.max"             => "The age group name may not be greater than 50 characters.",
            "age_name.regex"           => "The age group name must only contain letters.",
            "age_name.unique"          => "The age group name has already been taken.",
            "age_name.required"        => "The age group name field is required.",
            "minimum_age.min"          => "The minimum age must be greater than 0.",
            "minimum_age.max"          => "The minimum age must be greater than 0.",
            "maximum_age.gt"           => "The maximum age must be greater than minimum age.",


        ];
    }
}
