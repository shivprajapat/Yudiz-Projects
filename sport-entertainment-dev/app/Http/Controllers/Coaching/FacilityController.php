<?php

namespace App\Http\Controllers\Coaching;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\Request;

class FacilityController extends Controller
{
    //
    public function index(Request $request)
    {
        $facilities =  Facility::where("name", 'LIKE', "%{$request->name}%")->pluck('name')->toArray();
        if ($facilities) {
            return $facilities;
        }
        return [];
    }
}
