<?php

namespace App\Http\Services;

use App\Http\Resources\Api\{BasicCoachingDetail, BatchDetailResource, BatchResource};
use App\Models\Batch;

class BatchService
{
    function getBatchDetail($request)
    {
        $batch = Batch::with(["CoachingCentre", "sport", "ageGroup"])->where('id', $request->batch_id)->firstOrFail();
        $data  = [
            // "coaching_detail" => new BasicCoachingDetail($batch->CoachingCentre),
            "batch_detail"    => new BatchDetailResource($batch)
        ];

        return $data;
    }

    function allBatchesByCoachingCentre($data)
    {
        $batches = Batch::where('coaching_centre_id', $data["coaching_centre_id"])->get();
        return BatchResource::collection($batches);
    }
}
