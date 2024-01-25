<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;

class BannerImageRequest extends FormRequest
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
        $method = request()->method();
        switch ($method) {
            case 'PUT':
                return [
                    'banner_image'    =>    ['required_if:remove_banner_image,removed','mimes:jpeg,jpg,png'],
                    'banner_type'     =>    ['required_unless:action,'.$unless],
                    'redirect_url'    =>    request()->banner_type == 'url' ? ['required_unless:action,'.$unless] : ['nullable'],
                    'coaching_centre_id'     => request()->banner_type == 'id' ? ['required_unless:action,'.$unless] : ['nullable'],
                    'banner_note'    =>    ['nullable','min:3','max:255'],
                ];
                break;
            case "POST":
                return [
                    'banner_image'    =>    [ 'required','mimes:jpeg,jpg,png'],
                    'banner_type'     =>    ['required'],
                    'redirect_url'    =>    request()->banner_type == 'url' ? ['required'] : ['nullable'],
                    'coaching_centre_id'     => request()->banner_type == 'id' ? ['required'] : ['nullable'],
                    'banner_note'    =>    ['nullable','min:3','max:255'],
                ];
                break;
        }
    }
}
