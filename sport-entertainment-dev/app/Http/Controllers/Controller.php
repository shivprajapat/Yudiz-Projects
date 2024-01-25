<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Validator;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    //add for api
    protected $response = array('data' => null, 'message' => '');
    protected $status = 422;

    public function ValidateForm($fields, $rules)
    {
        Validator::make($fields, $rules)->validate();
    }

    public function DTFilters($request)
    {
        $filters = array(
            // 'draw' => $request['draw'],
            'offset' => isset($request['start']) ? $request['start'] : 0,
            'limit' => isset($request['length']) ? $request['length'] : 25,
            'sort_column' => (isset($request['order'][0]['column']) && isset($request['columns'][$request['order'][0]['column']]['data'])) ? $request['columns'][$request['order'][0]['column']]['data'] : 'created_at',
            'sort_order' => isset($request['order'][0]['dir']) ? $request['order'][0]['dir'] : 'DESC',
            'search' => isset($request['search']['value']) ? $request['search']['value'] : '',
        );
        return $filters;
    }

    public function returnResponse()
    {
        return response()->json($this->response, $this->status);
    }
}
