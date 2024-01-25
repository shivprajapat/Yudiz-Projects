<?php

namespace App\Rules;

use Carbon\Carbon;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class GreaterStartDate implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public $startDate;
    public function __construct($startDate)
    {
        $this->startDate = $startDate;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $startDate = Carbon::createFromFormat('d/m/Y', $this->startDate);
        $endDate = Carbon::createFromFormat('d/m/Y', $value);
        if ($endDate->lessThan($startDate)) {
            $fail('End date must be greater than the start date.');
        }
    }
}
