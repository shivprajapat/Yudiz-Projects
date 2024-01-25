<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class AddReviewRequest extends FormRequest
{
    protected $stopOnFirstFailure = true;
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
            "coaching_centre_id" => ['required'],
            "batch_id"           => ['required'],
            "booking_id"         => ['required'],
            "review"             => ['required', 'integer', 'min:0', 'max:5'],
            "description"        => ['required'],
        ];
    }
    public function messages()
    {
        return [
            'review.integer' => __("ENTER_PROPER_REVIEW"),
            'review.max'     => __("REVIEW_GREATER_THEN"),
            'review.min'     => __("REVIEW_AT_LEAST")
        ];
    }
}
