<?php
require  './vendor/autoload.php';

use Lullabot\AMP\AMP;
use Lullabot\AMP\Validate\Scope;

function convertHtmlToAmp()
{
    try {
        echo  $_SERVER['REQUEST_URI'];
    
        if($_SERVER['REQUEST_METHOD'] === 'GET' &&  $_SERVER['REQUEST_URI'] === '/ping'){
            return returnJsonHttpResponse(true,'success');
        }
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $amp = new AMP();

            $request_body = file_get_contents('php://input');

            $data = json_decode($request_body, true);

            $html = $data['plainHtml'];

            $amp->loadHtml($html);

            $amp_html = $amp->convertToAmpHtml();
    
            return returnJsonHttpResponse(true, $amp_html);
        } else {
            $sMessage = "Bad Request";
            return returnJsonHttpResponse(false, $sMessage);
        }
    } catch (Exception $e) {
        echo $e;
        $sMessage = $e->getMessage();
        return returnJsonHttpResponse(false, $sMessage);
    }
}

convertHtmlToAmp();

function returnJsonHttpResponse($success, $data)
{
    if ($success) {
        http_response_code(200);
        echo json_encode($data);
    } else {
        http_response_code(500);
        echo json_encode($data);
    }
    exit();
}
