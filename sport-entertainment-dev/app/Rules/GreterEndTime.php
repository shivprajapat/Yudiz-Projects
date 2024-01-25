<?php

namespace App\Rules;

use Carbon\Carbon;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class GreterEndTime implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $start = Carbon::createFromFormat('g:i A', request("start_time"));
        $end   = Carbon::createFromFormat('g:i A', $value);
        if (!$end->greaterThan($start)) {
            $fail(__("END_TIME_GREATER"));
        }
    }
}
