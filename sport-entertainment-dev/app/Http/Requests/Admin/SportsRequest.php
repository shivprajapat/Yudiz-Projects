<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;

use function PHPUnit\Framework\matches;

class SportsRequest extends FormRequest
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
        $id = (!empty(Route::current()->parameters()['sport']->id) ? Route::current()->parameters()['sport']->id : null);
        $method = request()->method();
        switch ($method) {
            case 'PUT':
                return [
                    'name'    =>  ['required_unless:action,'.$unless,'min:3', 'max:50', 'regex:/^[a-zA-Z]+$/', 'unique:sports,name,'.$id.',id,deleted_at,NULL'],
                    'logo'    =>  ['required_if:remove_logo,removed','mimes:jpeg,jpg,png'],
                ];
                break;
            case "POST":
                return [
                    'name'    =>     ['required','min:3', 'max:50', 'regex:/^[a-zA-Z]+$/', Rule::unique('sports')->whereNull('deleted_at')],
                    'logo'    =>   ['required','mimes:jpeg,jpg,png'],
                ];
                break;
        }
    }

    public function messages()
    {
        return [
            "name.required" => "The sports name field is required.",
            "name.required_unless" => "The sports name field is required.",
            "name.unique" => "The sports name is must be unique.",
            "name.min" =>  "The sports name must be at least 3 characters.",
            "name.max" => "The sports name must not be more than 50 characters.",
            "name.regex" => "The sports name must only contain letters.",
            "name.unique" => "The sports name has already been taken.",
            "logo.required_if" => "The sports logo is required."
        ];
    }
}
