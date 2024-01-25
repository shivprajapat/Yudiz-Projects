<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AgeGroupRequest;
use App\Models\AgeGroup;
use Illuminate\Http\Request;

class AgeGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('admin.pages.age_groups.index')->with(['custom_title' => 'Age Groups']);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.pages.age_groups.create')->with(['custom_title' => 'Age Group']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AgeGroupRequest $request)
    {
        $age_group = AgeGroup::create($request->all());
        if ($age_group) {
            flash('Age Group created successfully!')->success();
        } else {
            flash('Unable to save Age Group. Please try again later.')->error();
        }
        return redirect(route('admin.age-groups.index'));
    }

    /**
     * Display the specified resource.
     */
    public function show(AgeGroup $ageGroup)
    {
        return view('admin.pages.age_groups.view', compact('ageGroup'))->with(['custom_title' => 'Age Group']);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AgeGroup $ageGroup)
    {
        return view('admin.pages.age_groups.edit', compact('ageGroup'))->with(['custom_title' => 'Age Group']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AgeGroupRequest $request, AgeGroup $ageGroup)
    {
        if (!empty($request->action) && $request->action == 'change_status') {
            $content = ['status' => 204, 'message' => "something went wrong"];
            if ($ageGroup) {
                $ageGroup->is_active = $request->value;
                if ($ageGroup->save()) {
                    $content['status'] = 200;
                    $content['message'] = "Status updated successfully.";
                }
            }
            return response()->json($content);
        } else {
            $ageGroup->fill($request->all());
            if ($ageGroup->save()) {
                flash('Age Group details updated successfully!')->success();
            } else {
                flash('Unable to update Age Group. Try again later')->error();
            }
            return redirect(route('admin.age-groups.index'));
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
            $AgeGroup = AgeGroup::where('id', $id)->firstOrFail();
            $AgeGroup->delete();
            if (request()->ajax()) {
                $content = array('status' => 200, 'message' => "Age Group deleted successfully.", 'count' => AgeGroup::all()->count());
                return response()->json($content);
            } else {
                flash('Age Group deleted successfully.')->success();
                return redirect()->route('admin.age-groups.index');
            }
    }

    public function listing(Request $request)
    {
        extract($this->DTFilters($request->all()));
        $records = [];
        $age_groups = AgeGroup::query();

        if ($search != '') {
            $age_groups->where(function ($query) use ($search) {
                $query->where('age_name', 'like', "%{$search}%")
                ->orWhere('minimum_age', 'like', "%{$search}%")
                ->orWhere('maximum_age', 'like', "%{$search}%");
            });
        }

        $count = $age_groups->count();

        $records['recordsTotal'] = $count;
        $records['recordsFiltered'] = $count;
        $records['data'] = [];

        $age_groups = $age_groups->offset($offset)->limit($limit)->orderBy($sort_column, $sort_order);

        $age_groups = $age_groups->latest()->get();
        foreach ($age_groups as $key => $age_group) {

            $params = [
                'checked' => ($age_group->is_active ? 'checked' : ''),
                'getaction' => $age_group->is_active,
                'class' => '',
                'id' => $age_group->id,
            ];

            $records['data'][] = [
                'id' => $age_group->id,
                'sr_no' =>  ++$key,
                'age_name' => $age_group->age_name,
                'minimum_age' => $age_group->minimum_age,
                'maximum_age' => $age_group->maximum_age,
                'active' => view('admin.layouts.includes.switch', compact('params'))->render(),
                'action' => view('admin.layouts.includes.actions')->with(['custom_title' => 'age_groups', 'id' => $age_group->id], $age_group)->render(),
                'updated_at' => $age_group->updated_at,

            ];
        }
        // dd($records);
        return $records;
    }
}
