<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Route;

class FaqRequest extends FormRequest
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
        $id = (!empty(Route::current()->parameters()['faq']->id) ? ','.Route::current()->parameters()['faq']->id : '');
        $method = request()->method();
        switch ($method) {
            case 'PUT':
            return [
                'faq_type'      =>  ['required_unless:action,'.$unless],
                'title'         =>  ['required_unless:action,'.$unless,'min:5','max:50'],
                'description'   =>  ['required_unless:action,'.$unless,'min:5','max:250'],
            ];
        break;
        case "POST":
            return [
                'faq_type'      =>  ['required'],
                'title'         =>  ['required','min:5','max:50'],
                'description'   =>  ['required','min:5','max:250'],
            ];
            break;
        }
    }
}
