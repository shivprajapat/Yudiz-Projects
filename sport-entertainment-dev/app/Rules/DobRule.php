<?php

namespace App\Rules;

use Carbon\Carbon;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class DobRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        //
        // dd("hgi");
        // dd($value);
        $todayDate =  Carbon::createFromFormat('Y-m-d', Carbon::now()->format("Y-m-d"));
        $dob = Carbon::createFromFormat("Y-m-d", convertDateYmd($value));
        if ($dob->gt($todayDate)) {
            $fail(__("DOB_FEATURE_VALIDATE"));
        }
    }
}
