<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StateRequest;
use App\Models\{Country,State};
use Illuminate\Http\Request;

class StateController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('admin.pages.general.states.index')->with(['custom_title' => 'States']);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $countries = Country::all();
        return view('admin.pages.general.states.create',compact('countries'))->with(['custom_title' => 'State']);
    }

     /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StateRequest $request)
    {
        $state = State::create($request->all());
        if ($state) {
            flash('state created successfully!')->success();
        } else {
            flash('Unable to save state. Please try again later.')->error();
        }
        return redirect(route('admin.states.index'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(State $state)
    {
        $countries = Country::all();
        return view('admin.pages.general.states.edit', compact('state','countries'))->with(['custom_title' => 'state']);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(StateRequest $request, State $state)
    {
        if (!empty($request->action) && $request->action == 'change_status') {
            $content = ['status' => 204, 'message' => "something went wrong"];
            if ($state) {
                $state->is_active = $request->value;
                if ($state->save()) {
                    $content['status'] = 200;
                    $content['message'] = "Status updated successfully.";
                }
            }
            return response()->json($content);
        } else {
            $state->fill($request->all());
            if ($state->save()) {
                flash('User details updated successfully!')->success();
            } else {
                flash('Unable to update user. Try again later')->error();
            }
            return redirect(route('admin.states.index'));
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
            State::whereIn('id', explode(',', $request->ids))->delete();
            $content['status'] = 200;
            $content['message'] = "state deleted successfully.";
            $content['count'] = State::all()->count();
            return response()->json($content);
        } else {
            $state = State::where('id', $id)->firstOrFail();
            $state->delete();
            if (request()->ajax()) {
                $content = array('status' => 200, 'message' => "state deleted successfully.", 'count' => State::all()->count());
                return response()->json($content);
            } else {
                flash('state deleted successfully.')->success();
                return redirect()->route('admin.states.index');
            }
        }
    }



    public function listing(Request $request)
    {
        extract($this->DTFilters($request->all()));
        $records = [];
        $states = State::with('country');

        if ($search != '') {
            $states->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                ->orWhereHas('country',function($q) use ($search){
                    $q->where('name', 'like', "%{$search}%");
                });
            });
        }

        $count = $states->count();

        $records['recordsTotal'] = $count;
        $records['recordsFiltered'] = $count;
        $records['data'] = [];

        $states = $states->offset($offset)->limit($limit)->orderBy($sort_column, $sort_order);

        $states = $states->orderBy('name', 'ASC')->get();
        foreach ($states as $state) {

            $params = [
                'checked' => ($state->is_active ? 'checked' : ''),
                'getaction' => $state->is_active,
                'class' => '',
                'id' => $state->id,
            ];

            $records['data'][] = [
                'id' => $state->id,
                'name' => $state->name,
                'country_name' => $state->country->name,
                'active' => view('admin.layouts.includes.switch', compact('params'))->render(),
                'action' => view('admin.layouts.includes.actions')->with(['custom_title' => 'States', 'id' => $state->id], $state)->render(),
                'checkbox' => view('admin.layouts.includes.checkbox')->with('id', $state->id)->render(),
                'updated_at' => $state->country->updated_at,
            ];

        }

        return $records;
    }

}
