<?php

return [
    'custom_length'         =>  env('CUSTOM_ID_LENGTH', 8),
    'default_password'      =>  env('PASSWORD_LENGTH', 16),
    'caching'               =>  env('CACHE_ALLOW', false),
    "coaching_name"         => "Coaching Centre",

    /** pagination */
    'limit' => env('PAGINATION_LIMIT',10),
    'banner_image_limit' => env("BANNER_IMAGE_LIMIT", 5),
    'google'        =>  [
        'fcm'       =>  env('GOOGLE_FCM_SERVER_KEY',  "AAAAF0ztxDs:APA91bGwBbxKYAmXjCDosZNasxT-9cuDy6lqNbp4zd6AzaF0HyhXvDa5Zl2sZQrPazoUt-hUhDj4ncctC5WKNAdxRip63dNwxw98H5QVYMqVN0xsiTTAlijvp_KMzVWJwPI8GI5vzx9s"),
        'deeplink'  =>  [
            'key'           =>  env('FIREBASE_API_KEY',  ""),
            'url-type'      =>  env('FIREBASE_URL_TYPE', 'SHORT'),
            'uri'           =>  env('FIREBASE_URI_PREFIX', ''),
            'ios'           =>  [
                'bundle'    =>  env('IOS_BUNDLE_NAME', NULL),
                'store'    	=>  env('IOS_APP_STORE_ID', NULL),
                'scheme'    =>  env('IOS_CUSTOM_SCHEME', NULL),
            ],
            'android'       =>  [
                'package'   =>  env('ANDROID_PACKAGE_NAME', NULL),
            ],
        ],
    ],

    'lat'					=>	env('DEFAULT_LATITUDE', '20.5937'),
	'lng'					=>	env('DEFAULT_LONGITUDE', '78.9629'),
	'MAP_KEY'				=>	env('DEFAULT_MAP_KEY', 'AIzaSyBa2lLEf_61EAxrZ1GCo6FV1jz4wcQAxkA'),
];
