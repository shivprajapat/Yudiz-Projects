<?php

namespace App\Enums;

enum AdminApproveEnums: string
{
    case APPROVE = "approved";
    case REJECT = "rejected";
    case PENDING_APPROVAL = "pending_approval";
}
