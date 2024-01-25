<?php

namespace App\Rules;

use Carbon\Carbon;
use Closure;
use Exception;
use Illuminate\Contracts\Validation\ValidationRule;

class DateFormatRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        //
        try {
            //if any error become converting then the catch block is handle the error
            Carbon::createFromFormat('m-d-Y', $value);
        } catch (Exception $e) {
            $fail(__("DOB_FORMAT_INVALID"));
        }
    }
}
