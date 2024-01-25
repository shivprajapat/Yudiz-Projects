<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ErrorLog;
use Illuminate\Http\Request;
use InvalidArgumentException;
use PhpParser\Node\Stmt\Catch_;

class ErrorController extends Controller
{
    public function listing(Request $request)
    {

        extract($this->DTFilters($request->all()));
        $errors = ErrorLog::orderBy($sort_column, $sort_order);

        if ($search != '') {
            $errors->where(function ($query) use ($search) {
                $query->where('exception', 'like', "%{$search}%")
                    ->orWhere('url', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }
        $count = $errors->count();
        $records = [];
        $records['recordsTotal'] = $count;
        $records['recordsFiltered'] = $count;
        $records['data'] = [];


        $errors = $errors->offset($offset)->limit($limit);

        $errors = $errors->latest()->get();

        foreach ($errors as $error) {
            $records['data'][] = [
                'checkbox' => '',
                'id' => $error->id,
                'first_name' =>  $error->first_name ?? "Guest",
                'email' => $error->email ? '<a href="mailto:' . $error->email . '" >' . $error->email . '</a>' : "-",
                'url' => $error->url,
                'exception' => $error->exception,
                'count' => $error->count,
                'ip_address' => $error->ip_address,
                'guard' => $error->guard,
                'updated_at' => \Carbon\Carbon::parse($error->updated_at)->format('d-m-Y H:i:s'),
                'active' => '',
                'action' => '',
            ];
        }

        return $records;
    }
}
