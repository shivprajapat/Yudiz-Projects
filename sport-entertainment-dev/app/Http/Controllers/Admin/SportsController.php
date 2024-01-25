<?php

namespace App\Http\Controllers\Admin;

use App\Enums\{SportsPopularityEnums,StatusEnums};
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SportsRequest;
use App\Models\Sports;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SportsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('admin.pages.sports.index')->with(['custom_title' => 'Sports']);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.pages.sports.create')->with(['custom_title' => 'Sports']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SportsRequest $request)
    {

        $path = null;
        if($request->has('logo')) {
            $path = imageUpload($request, 'logo', 'images/sports');
        }
        $is_popular = $request->is_popular == 'on' ? SportsPopularityEnums::POPULAR ->value: SportsPopularityEnums::NOT_POPULAR->value ;
        $sports = Sports::create([
            'name' => $request->name,
            'logo' => $request->logo,
            'is_popular' => $is_popular
        ]);
        $sports->logo = $path;
        if($sports->save()) {
            flash('Sport created successfully!')->success();
        } else {
            flash('Unable to save sport. Please try again later.')->error();
        }
        return redirect(route('admin.sports.index'));
    }
    /**
         * Display the specified resource.
         */
    public function show(Sports $sport)
    {
        return view('admin.pages.sports.view', compact('sport'))->with(['custom_title' =>'Sports']);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sports $sport)
    {
        return view('admin.pages.sports.edit', compact('sport'))->with(['custom_title' => 'Sports']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SportsRequest $request, Sports $sport)
    {
        try {
            DB::beginTransaction();
            if(!empty($request->action) && $request->action == 'change_status') {
                $content = ['status'=>204, 'message'=>"something went wrong"];
                if($sport) {
                    $sport->is_active = ($request->value) ? StatusEnums::ACTIVE : StatusEnums::INACTIVE;
                    if($sport->save()) {
                        DB::commit();
                        $content['status']=200;
                        $content['message'] = "Status updated successfully.";
                    }
                }
                return response()->json($content);
            } else {
                $path = $sport->logo;
                if($request->has('remove_logo')) {
                    if($sport->logo) {
                        Storage::delete($sport->logo);
                    }
                    $path = null;
                }
                if($request->hasFile('logo')) {
                    if($sport->logo) {
                        Storage::delete($sport->logo);
                    }
                    $path = imageUpload($request, 'logo', 'images/sports');
                }
                $is_popular = $request->is_popular == 'on' ? SportsPopularityEnums::POPULAR ->value: SportsPopularityEnums::NOT_POPULAR->value ;
                $sport['is_popular'] =  $is_popular;
                $sport->fill($request->only('name','logo'));
                $sport->logo = $path;
                if($sport->save()) {
                    DB::commit();
                    flash('Sports details updated successfully!')->success();
                } else {
                    flash('Unable to update sports. Try again later')->error();
                }
                return redirect(route('admin.sports.index'));
            }
        } catch(QueryException $e) {
            DB::rollback();
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        } catch(Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);

        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        $content = ['status'=>204, 'message'=>"something went wrong"];
        if(!empty($request->action) && $request->action == 'delete_all') {

            Sports::whereIn('id', explode(',', $request->ids))->delete();
            $content['status']=200;
            $content['message'] = "Sport deleted successfully.";
            $content['count'] = Sports::all()->count();

        } else {
            $sport = Sports::where('id', $id)->firstOrFail();
            if($sport->logo) {
                Storage::delete($sport->logo);
            }
            $sport->delete();
            if(request()->ajax()) {
                $content = array('status'=>200, 'message'=>"Sport deleted successfully.", 'count' => Sports::all()->count());
            } else {
                flash('Sport deleted successfully.')->success();
                return redirect()->route('admin.sports.index');
            }
        }
        return response()->json($content);
    }

    public function listing(Request $request)
    {
        extract($this->DTFilters($request->all()));
        $records = [];
        $sports = Sports::query();

        if ($search != '') {
            $sports->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            });
        }
        $count = $sports->count();

        $records['recordsTotal'] = $count;
        $records['recordsFiltered'] = $count;
        $records['data'] = [];

        $sports = $sports->offset($offset)->limit($limit)->orderBy($sort_column, $sort_order);

        $sports = $sports->latest()->get();
        foreach ($sports as $key =>$sport) {

            $params = [
                'checked' => ($sport->is_active ? 'checked' : ''),
                'getaction' => $sport->is_active,
                'class' => '',
                'id' => $sport->id,
            ];

            $records['data'][] = [
                'id' => $sport->id,
                'sr_no' =>  ++$key,
                'name' => $sport->name,
                'logo' => generate_url($sport->logo),
                'is_popular' => $sport->is_popular ==  SportsPopularityEnums::POPULAR ->value ? 'yes' : 'no' ,
                'active' => view('admin.layouts.includes.switch', compact('params'))->render(),
                'action' => view('admin.layouts.includes.actions')->with(['custom_title' => 'Sports', 'id' => $sport->id], $sport)->render(),
                'checkbox' => view('admin.layouts.includes.checkbox')->with('id', $sport->id)->render(),
                'updated_at' => $sport->updated_at,

            ];
        }
        return $records;
    }
}
