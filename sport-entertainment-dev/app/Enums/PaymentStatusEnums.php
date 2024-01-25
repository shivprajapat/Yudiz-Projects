<?php

namespace App\Enums;

enum PaymentStatusEnums : string
{
    case SUCCESS = "success";
    case FAILED = "failed";
    case PROCESSED = "processed" ;
    case PENDING = "pending" ;

}



