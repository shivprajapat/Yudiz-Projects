<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SummernoteController extends Controller
{
    public function imageUpload(Request $request)
    {
        if($request->hasFile('file')) {
            $path = $request->file('file')->store($request->path);
            return asset('storage/'.$path);
        }
    }

    public function mediaDelete(Request $request)
    {
      $base_url = url('/').'/storage/';
      $image = $request->image;
      $file_name = str_replace($base_url, '', $image);
      if(Storage::delete($file_name))
      {
          return 'File Delete Successfully';
      }
    }
}
