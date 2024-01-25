<?php

namespace App\Http\Requests\Coaching;

use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class UpdatePasswordRequest extends FormRequest
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
            "old_password" => ["required", "min:6", "max:80", "current_password:coaching"],
            "password" => ["required", "min:6", "max:80", function (string $attribute, mixed $value, Closure $fail) {
                if (strcmp(request('old_password'), request('password')) == 0) {
                    $fail("New Password cannot be same as your current password.");
                }
            }],
            "password_confirmation" => ["same:password"]
        ];
    }

    public function messages()
    {
        return [
            "password_confirmation.same" => "The re-entered new password is not same.",
            "old_password.current_password" => "Old Password Doesn't match!"
        ];
    }
}
