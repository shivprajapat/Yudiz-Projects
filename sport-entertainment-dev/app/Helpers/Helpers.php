<?php

use App\View\Components\ActionComponent;
use Carbon\Carbon;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Storage;

if (!function_exists("get_permissions")) {
    // Permission for Admins
    function get_permissions(string $user_type = "normal"): array
    {
        $permissions = array();

        if ($user_type == "admin") {
            $permissions = [
                1   =>  ["permissions" => "access"],                          // Dashboard
                2   =>  ["permissions" => "access,edit,view,delete"],         // Users
                3   =>  ["permissions" => "access,edit,view,delete"],         //Coaching Centre Management
                4   =>  ["permissions" => "access,edit,view,delete"],         // Batches Management
                5   =>  ["permissions" => "access,view"],                     // Bookings Management
                6   =>  ["permissions" => "access,view,delete,edit"],              //Reviews Management
                7   =>  ["permissions" => "access,edit,delete"],                          //Payments Management   -------change
                8   =>  ["permissions" => "access,add,edit,view,delete"],     // Sports  Management
                9   =>  ["permissions" => "access,add,edit,view,delete"],     // Age Group Management
                10  =>  ["permissions" => "access,add,view,delete"],          // Manage Push Notifications
                11  =>  ["permissions" => "access,add,edit,view,delete"],     // FAQs Management
                11  =>  ["permissions" => "access,add,edit,view,delete"],     // FBanner Images  Management
                12  =>  ["permissions" => "access,add,edit,view,delete"],    // Countries Management
                13  =>  ["permissions" => "access,edit"],                    // Payment Settings management
                14  =>  ["permissions" => "access,edit"],                    // Settings
                15  =>  ["permissions" => "access,edit,view,delete"],                     // Site Configurations
                16  =>  ["permissions" => "access,add,edit,view,delete"],
                17  =>  ["permissions" => "access,add,edit,view,delete"],
                18  =>  ["permissions" => "access,add,edit,view,delete"],

            ];
        }

        return $permissions;
    }
}

if (!function_exists('fire_curl')) {
    function fire_curl($url, $type, $headers, $data = null)
    {
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => strtoupper($type),
            CURLOPT_POSTFIELDS => $data,
            CURLOPT_HTTPHEADER => $headers,
            // CURLOPT_HTTPHEADER => array("Content-Type:application/json"),
        ));

        $response = curl_exec($curl);
        curl_close($curl);
        return (object) json_decode($response, true);
    }
}


if (!function_exists('number_format_short')) {
    // Show number is cool format, like 1K, 2M, 50K etc
    function number_format_short($n, $precision = 1)
    {
        if ($n < 900) {
            $n_format = number_format($n, $precision);
            $suffix = "";
        } elseif ($n < 900000) {
            $n_format = number_format($n / 1000, $precision);
            $suffix = "K";
        } elseif ($n < 900000000) {
            $n_format = number_format($n / 1000000, $precision);
            $suffix = "M";
        } elseif ($n < 900000000000) {
            $n_format = number_format($n / 1000000000, $precision);
            $suffix = "B";
        } else {
            $n_format = number_format($n / 1000000000000, $precision);
            $suffix = "T";
        }
        if ($precision > 0) {
            $dotzero = "." . str_repeat("0", $precision);
            $n_format = str_replace($dotzero, "", $n_format);
        }
        return $n_format . $suffix;
    }
}

if (!function_exists('get_unique_string')) {
    // function get_unique_string(string $table, string $field = 'custom_id', int $length = null): string
    // {
    //     $length = $length ?? config('utility.custom_length', 12);

    //     //     $string = \Illuminate\Support\Str::random($length);
    //     //     $found = \Illuminate\Support\Facades\DB::table($table)->where([$field => $string])->first();

    //     //     return ($found) ? get_unique_string($table, $field, $length) : $string;
    //     // }

    // }
    function get_unique_string(): string
    {
        return  \Illuminate\Support\Str::uuid();
    }
}

if (!function_exists('generate_url')) {
    function generate_url(string $path = null, string $disk = "public"): string
    {
        return (!empty($path) && \Illuminate\Support\Facades\Storage::disk($disk)->exists($path))
            ? \Illuminate\Support\Facades\Storage::url($path)
            : 'https://via.placeholder.com/75/EBF4FF/7F9CF5?text=no%20image';
    }
}

if (!function_exists('get_guard')) {
    function get_guard()
    {
        //You Need to define all guard created
        if (\Illuminate\Support\Facades\Auth::guard("admin")->check()) {
            return "admin";
        } elseif (\Illuminate\Support\Facades\Auth::guard("web")->check()) {
            return "user";
        } else {
            return "Guard not match";
        }
    }
}

if (!function_exists('generate_avatar_icon')) {
    function generate_avatar_icon(string $name): string
    {
        $name = trim(collect(explode(' ', $name))->map(function ($segment) {
            return mb_substr($segment, 0, 1);
        })->join(' '));

        return 'https://ui-avatars.com/api/?name=' . urlencode($name) . '&color=7F9CF5&background=EBF4FF';
    }
}

if (!function_exists('api_validation_error_display')) {
    function api_validation_error_display($validator)
    {
        return response()->json(["data" => null, "message" => $validator->errors()->first()], Illuminate\Http\Response::HTTP_UNPROCESSABLE_ENTITY);
    }
}

if (!function_exists('imageUpload')) {

    //$attribute = input type file name , $path = storage path

    function imageUpload($request, $attribute = null, $imgPath = null, $oldImgPath = null): ?string
    {
        // dd($request);
        $path = $oldImgPath ??  null;
        if ($request->hasFile($attribute)) {
            // dd('asdas');
            if ($oldImgPath) {
                Storage::delete($oldImgPath);
            }
            if ($attribute && $imgPath) {
                $path = $request->file($attribute)->store($imgPath);
            }
        }
        // dd($path);
        return $path;
    }
}

if (!function_exists('getTagifyValue')) {
    function getTagifyValue($data): ?array
    {
        if ($data) {
            $data = explode(',', substr($data, 1, strlen($data) - 2));
            $data = array_map(function ($item) {
                return json_decode($item)->value;
            }, $data);
            return $data;
        }
        return false;
    }
}

/** check the year from today */
if (!function_exists('yearCount')) {
    function yearCount($dob)
    {
        return Carbon::parse($dob)->diffInYears(Carbon::now());
    }
}

/** convert d-m-Y To Y-m-d */
if (!function_exists('convertDateYmd')) {
    function convertDateYmd($date)
    {
        return Carbon::createFromFormat('d-m-Y', $date)->format("Y-m-d");
    }
}
