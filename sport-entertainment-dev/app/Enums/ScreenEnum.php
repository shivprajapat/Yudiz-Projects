<?php

namespace App\Enums;

enum ScreenEnum: string
{
    case DASHBOARD_SCREEN   = "dashboard_screen";
    case FAVORITE_SCREEN    = "favorite_sports_screen";
    case SIGNUP_SCREEN      = "sign_up_screen";
    case PARTICIPANT_SCREEN = "add_participants_screen";
    case NO_ANY_SCREEN      = "no_any_screen";
    case VERIFY_OTP_SCREEN  = "verify_otp_screen";
}
