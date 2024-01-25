<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CountryRequest;
use App\Models\Country;
use Illuminate\Http\Request;

class CountryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('admin.pages.general.countries.index')->with(['custom_title' => 'Countries']);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('admin.pages.general.countries.create')->with(['custom_title' => 'Country']);
    }

     /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CountryRequest $request)
    {
        $country = Country::create($request->all());
        if ($country) {
            flash('Country created successfully!')->success();
        } else {
            flash('Unable to save country. Please try again later.')->error();
        }
        return redirect(route('admin.countries.index'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(Country $country)
    {
        return view('admin.pages.general.countries.edit', compact('country'))->with(['custom_title' => 'Country']);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(CountryRequest $request, Country $country)
    {
        if (!empty($request->action) && $request->action == 'change_status') {
            $content = ['status' => 204, 'message' => "something went wrong"];
            if ($country) {
                $country->is_active = $request->value;
                if ($country->save()) {
                    $content['status'] = 200;
                    $content['message'] = "Status updated successfully.";
                }
            }
            return response()->json($content);
        } else {
            $country->fill($request->all());
            if ($country->save()) {
                flash('User details updated successfully!')->success();
            } else {
                flash('Unable to update user. Try again later')->error();
            }
            return redirect(route('admin.countries.index'));
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        if (!empty($request->action) && $request->action == 'delete_all') {
            $content = ['status' => 204, 'message' => "something went wrong"];
            Country::whereIn('id', explode(',', $request->ids))->delete();
            $content['status'] = 200;
            $content['message'] = "Country deleted successfully.";
            $content['count'] = Country::all()->count();
            return response()->json($content);
        } else {
            $country = Country::where('id', $id)->firstOrFail();
            $country->delete();
            if (request()->ajax()) {
                $content = array('status' => 200, 'message' => "Country deleted successfully.", 'count' => Country::all()->count());
                return response()->json($content);
            } else {
                flash('Country deleted successfully.')->success();
                return redirect()->route('admin.countries.index');
            }
        }
    }



    public function listing(Request $request)
    {
        extract($this->DTFilters($request->all()));
        $records = [];
        $countries = Country::query();

        if ($search != '') {
            $countries->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('phonecode', 'like', "%{$search}%");
            });
        }

        $count = $countries->count();

        $records['recordsTotal'] = $count;
        $records['recordsFiltered'] = $count;
        $records['data'] = [];

        $countries = $countries->offset($offset)->limit($limit)->orderBy($sort_column, $sort_order);

        $countries = $countries->orderBy('name', 'ASC')->get();
        foreach ($countries as $country) {

            $params = [
                'checked' => ($country->is_active ? 'checked' : ''),
                'getaction' => $country->is_active,
                'class' => '',
                'id' => $country->id,
            ];

            $records['data'][] = [
                'id' => $country->id,
                'name' => $country->name,
                'code' => $country->code,
                'phonecode' => $country->phonecode,
                'active' => view('admin.layouts.includes.switch', compact('params'))->render(),
                'action' => view('admin.layouts.includes.actions')->with(['custom_title' => 'Countries', 'id' => $country->id], $country)->render(),
                'checkbox' => view('admin.layouts.includes.checkbox')->with('id', $country->id)->render(),
                'updated_at' => $country->updated_at,
            ];

        }

        return $records;
    }
    //
}
