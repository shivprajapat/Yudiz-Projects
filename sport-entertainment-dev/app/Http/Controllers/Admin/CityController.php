<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CityRequest;
use App\Models\{City,State};
use Illuminate\Http\Request;

class CityController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('admin.pages.general.cities.index')->with(['custom_title' => 'Cities']);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $states = State::with('country')->get();
        return view('admin.pages.general.cities.create', compact('states'))->with(['custom_title' => 'City']);
    }

    /**
    * Store a newly created resource in storage.
    *
    * @param  \Illuminate\Http\Request  $request
    * @return \Illuminate\Http\Response
    */
    public function store(CityRequest $request)
    {
        $city = City::create($request->all());
        if ($city) {
            flash('state created successfully!')->success();
        } else {
            flash('Unable to save state. Please try again later.')->error();
        }
        return redirect(route('admin.cities.index'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(City $city)
    {
        $states = State::with('country')->get();
        return view('admin.pages.general.cities.edit', compact('city', 'states'))->with(['custom_title' => 'state']);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(CityRequest $request, City $city)
    {
        if (!empty($request->action) && $request->action == 'change_status') {
            $content = ['status' => 204, 'message' => "something went wrong"];
            if ($city) {
                $city->is_active = $request->value;
                if ($city->save()) {
                    $content['status'] = 200;
                    $content['message'] = "Status updated successfully.";
                }
            }
            return response()->json($content);
        } else {
            $city->fill($request->all());
            if ($city->save()) {
                flash('User details updated successfully!')->success();
            } else {
                flash('Unable to update user. Try again later')->error();
            }
            return redirect(route('admin.cities.index'));
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
            City::whereIn('id', explode(',', $request->ids))->delete();
            $content['status'] = 200;
            $content['message'] = "state deleted successfully.";
            $content['count'] = City::all()->count();
            return response()->json($content);
        } else {
            $city = City::where('id', $id)->firstOrFail();
            $city->delete();
            if (request()->ajax()) {
                $content = array('status' => 200, 'message' => "state deleted successfully.", 'count' => City::all()->count());
                return response()->json($content);
            } else {
                flash('state deleted successfully.')->success();
                return redirect()->route('admin.cities.index');
            }
        }
    }



    public function listing(Request $request)
    {
        extract($this->DTFilters($request->all()));
        $records = [];
        $cities = City::with('state');

        if ($search != '') {
            $cities->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                ->orWhereHas('state', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            });
        }

        $count = $cities->count();

        $records['recordsTotal'] = $count;
        $records['recordsFiltered'] = $count;
        $records['data'] = [];

        $cities = $cities->offset($offset)->limit($limit)->orderBy($sort_column, $sort_order);

        $cities = $cities->orderBy('name', 'ASC')->get();
        foreach ($cities as $city) {

            $params = [
                'checked' => ($city->is_active ? 'checked' : ''),
                'getaction' => $city->is_active,
                'class' => '',
                'id' => $city->id,
            ];

            $records['data'][] = [
                'id' => $city->id,
                'name' => $city->name,
                'state_name' => $city->state->name,
                'active' => view('admin.layouts.includes.switch', compact('params'))->render(),
                'action' => view('admin.layouts.includes.actions')->with(['custom_title' => 'Cities', 'id' => $city->id], $city)->render(),
                'checkbox' => view('admin.layouts.includes.checkbox')->with('id', $city->id)->render(),
                'updated_at' => $city->updated_at,
            ];

        }
        return $records;
    }

}
