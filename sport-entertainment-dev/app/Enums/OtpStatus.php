<?php

namespace App\Enums;

enum OtpStatus : string
{
    case USER_ALREADY_REGISTRED = "user_already_registred";
    case USER_NOT_REGISTRED = "user_not_registred";
    case OTP_NOT_VERIFIED = "otp_not_verified";
}
