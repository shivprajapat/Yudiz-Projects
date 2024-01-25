<?php

namespace App\Http\Controllers\Admin;
use App\Enums\{BatchStatus,StatusEnums};
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BatchRequest;
use App\Models\{AgeGroup,Batch,CoachingCentreOfferedSport};
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Carbon\Carbon;

class BatchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('admin.pages.batches.index')->with(['custom_title' => ('Batches')]);
    }
    /**
     * Display the specified resource.
     */
    public function show(Batch $batch)
    {
        return view('admin.pages.batches.view', compact('batch'))->with(['custom_title' => 'Batch']);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Batch $batch)
    {
        $sports = CoachingCentreOfferedSport::with("sport:id,name,logo")->where("coaching_centre_id", $batch->CoachingCentre->id)->get();
        $ageGroups = AgeGroup::all();
        return view('admin.pages.batches.edit', compact(['batch','sports','ageGroups']))->with(['custom_title' => 'Batch']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BatchRequest $request, Batch $batch)
    {
        try {
            if(!empty($request->action) && $request->action == 'change_status') {
                $content = ['status'=>204, 'message'=>"something went wrong"];
                if($batch) {
                    $batch->is_active = ($request->value) ? StatusEnums::ACTIVE : StatusEnums::INACTIVE;
                    if($batch->save()) {
                        $content['status']=200;
                        $content['message'] = "Status updated successfully.";
                    }
                }
                return response()->json($content);
            } elseif(!empty($request->action) && $request->action == 'change_live_status') {
                $content = ['status'=>204, 'message'=>"something went wrong"];
                if ($batch) {
                    $batch->live_status = $request->value == 1 ? BatchStatus::LIVE : BatchStatus::INACTIVE;

                    if ($batch->save()) {
                        $content['status'] = 200;
                        $content['message'] = "Live status updated successfully.";
                    }
                }
                return response()->json($content);
            } else {
                $request['session_days'] = is_array($request->session_days) ? implode(",", $request->session_days) : "";
                $request['start_date'] = Carbon::createFromFormat('d/m/Y', $request->start_date)->format('Y-m-d');
                $request['end_date'] = Carbon::createFromFormat('d/m/Y', $request->end_date)->format('Y-m-d');
                $batch->fill($request->only('name', 'start_date', 'end_date', 'sport_id', 'age_id', 'batch_size', 'session_days', 'start_time', 'end_time', 'number_of_session', 'price', 'actual_price', 'brief_details', 'live_status'));
            }
            if($batch->save()) {
                flash('Batch  updated successfully!')->success();
            } else {
                flash('Unable to update batch. Try again later')->error();
            }
            return redirect(route('admin.batches.index'));

        } catch(QueryException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        } catch(Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        if(!empty($request->action) && $request->action == 'delete_all') {
            $content = ['status'=>204, 'message'=>"something went wrong"];
            $batches =  Batch::whereIn('id', explode(',', $request->ids))->delete();
            $content['status']=200;
            $content['message'] = "Batches deleted successfully.";
            $content['count'] = Batch::all()->count();
            return response()->json($content);
        } else {
            Batch::find($id)->delete();
            $content['status'] = 200;
            $content['message'] = "Batch deleted successfully.";
            $content['count'] = Batch::count();
            return response()->json($content);
        }
    }

    public function listing(Request $request)
    {
        extract($this->DTFilters($request->all()));
        $records = [];
        if ($sort_column == 'coaching_name') {
            $sort_column = 'coaching_centres.coaching_name';
        } elseif($sort_column  == 'sport_name') {
            $sort_column = 'sports.name' ;
        } elseif($sort_column == 'age_name') {
            $sort_column = 'age_groups.age_name' ;
        }
        if($request->completion_status) {
            $completion_status = $request->completion_status == 'completed' ? 1 : 0 ;
            $batches = Batch::with(["sport", "ageGroup", "CoachingCentre"])->where('completion_status', $completion_status);
        } else {
            $batches = Batch::with(["sport", "ageGroup", "CoachingCentre"]);
        }
        $batches
        ->join('coaching_centres', 'batches.coaching_centre_id', '=', 'coaching_centres.id')
        ->join('sports', 'batches.sport_id', '=', 'sports.id')
        ->join('age_groups', 'batches.age_id', '=', 'age_groups.id')
        ->select('batches.*'); // Select the columns from the 'batches' table explicitly to avoid ambiguity

        if ($search != '') {
            $batches->where(function ($query) use ($search) {
                $query->where("batches.name", 'like', "%{$search}%")
                        ->orWhere('start_date', 'like', "%{$search}%")
                        ->orWhere('end_date', 'like', "%{$search}%")
                        ->orWhereHas("sport", function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas("ageGroup", function ($q) use ($search) {
                            $q->where("age_name", 'like', "%{$search}%");
                        })
                        ->orWhereHas("CoachingCentre", function ($q) use ($search) {
                            $q->where("coaching_name", 'like', "%{$search}%");
                        });
            });
        }

        $count = $batches->count();

        $records['recordsTotal'] = $count;
        $records['recordsFiltered'] = $count;
        $records['data'] = [];

        $batches = $batches->offset($offset)->limit($limit)->orderBy($sort_column, $sort_order);

        $batches = $batches->latest()->get();
        foreach ($batches as $batch) {

            $params = [
                'checked' => ($batch->is_active ? 'checked' : ''),
                'live-checked' => ($batch->live_status ? 'checked' : ''),
                'getaction' => $batch->is_active,
                'completion_status' =>  $batch->completion_status ,
                'disable_button' => ($batch->live_status == BatchStatus::LIVE->value) ? ($batch->completion_status == 0 ? true : false ) : false,
                'id' => $batch->id,
            ];

            $records['data'][] = [
                'id' => $batch->id,
                'coaching_name' => $batch->CoachingCentre->coaching_name,
                'name' => $batch->name,
                'start_date' => $batch->start_date . " | " . $batch->end_date,
                'sport_name' => $batch->sport->name,
                'age_name' => $batch->ageGroup->age_name,
                'active' => view('admin.layouts.includes.switch', compact('params'))->render(),
                'live_status' => view('admin.layouts.includes.batch-switch', compact('params'))->render(),
                'action' => view('admin.layouts.includes.actions2')->with(['custom_title' => 'Coaching Center', 'id' => $batch->id, 'request_type' => 'batch','params' =>$params], $batch)->render(),
                'updated_at' => $batch->updated_at,
                'checkbox' => view('admin.layouts.includes.checkbox')->with('id', $batch->id)->render(),
            ];
        }
        return $records;
    }

}
