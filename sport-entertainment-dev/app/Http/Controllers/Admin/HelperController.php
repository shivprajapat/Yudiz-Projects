<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class HelperController extends Controller
{
    public static function generateUrl($path)
    {
        $url = "";
        if( !empty($path) && Storage::disk('public')->exists($path) )

            $url = Storage::url($path);

        return $url;
    }

}
