<?php

namespace Craftroots\PincodeCheck\Helper;

use \Magento\Framework\App\Helper\AbstractHelper;

class ApiData extends AbstractHelper
{
    public function __construct(
        \Magento\Framework\App\Helper\Context$context
    ) {

        parent::__construct($context);
    }
    public function curlPost($url, $data = null, $headers = null)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_ENCODING, "");
        curl_setopt($ch, CURLOPT_MAXREDIRS, 10);
        curl_setopt($ch, CURLOPT_TIMEOUT, 0);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");

        if (!empty($data)) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        } else if ($data != '') {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        } else {
            curl_setopt($ch, CURLOPT_POSTFIELDS, '');
        }

        if (!empty($headers)) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        }
        $response = curl_exec($ch);
        $info = curl_getinfo($ch);
        $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        $result = [
            'data' => '',
            'status' => $httpcode,
        ];

        if (curl_error($ch)) {
            $result['data'] = curl_error($ch);
        } else {
            $result['data'] = $response;
        }

        curl_close($ch);
        return $result;
    }
    public function curlGet($url, $headers = null)
    {
        $ch = curl_init(); // Initialize the curl session
        curl_setopt($ch, CURLOPT_URL, $url); // Set the URL
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers); // Set the headers
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Return the response as a string
        $response = curl_exec($ch); // Execute the request
        $result = [
            'data' => '',
        ];
        if (curl_error($ch)) {
            $result['data'] = curl_error($ch);
        } else {
            $result['data'] = $response;
        }
        $jsonResp = json_decode($result['data'], true);

        curl_close($ch);
        return $jsonResp['status'];
    }
}
