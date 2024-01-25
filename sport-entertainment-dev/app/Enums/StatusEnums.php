<?php

namespace App\Enums;

enum StatusEnums : int
{
    case INACTIVE = 0;
    case ACTIVE = 1;
    case OPT_VERIFICATION_PENDING = 2;
    case REJECT = 3;
}


