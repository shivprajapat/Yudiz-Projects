<?php

namespace App\Http\Controllers\Coaching;

use App\Enums\BatchStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBatchRequest;
use App\Models\{AgeGroup, CoachingCentreOfferedSport, Batch, Content};
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

class BatchManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            extract($this->DTFilters($request->all()));
            $records = [];
            $batches = Batch::with(["sport", "ageGroup"])->coachingId();

            if ($search != '') {
                $batches->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('batch_size', 'like', "%{$search}%")
                        ->orWhere('start_date', 'like', "%{$search}%")
                        ->orWhere('end_date', 'like', "%{$search}%")
                        ->orWhereHas('sport', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('ageGroup', function ($q) use ($search) {
                            $q->where('age_name', 'like', "%{$search}%");
                        });
                });
            }
            $count = $batches->count();

            $records['recordsTotal']    = $count;
            $records['recordsFiltered'] = $count;
            $records['data']            = [];

            $batches   = $batches->offset($offset)->limit($limit)->orderBy($sort_column, $sort_order);
            $batches   = $batches->latest()->get();
            $routeName = Route::currentRouteName();
            foreach ($batches as $key => $batch) {
                $data = [
                    "id"             => $batch->id,
                    "route"          => substr($routeName, 0, strrpos($routeName, '.')),
                    "able_to_delete" => $batch->ableToDelete(),
                    "able_to_edit"   => $batch->ableToEdit(),
                ];

                $actionData = [
                    "view"   => true,
                    "edit"   => true,
                    "delete" => true,
                    ...$data
                ];

                $swtichData = [
                    "switch"      => true,
                    "live_status" => $batch->live_status ? 'checked' : '',
                    "able_to_off" => $batch->switchAbleToOff(),
                    ...$data
                ];

                $records['data'][] = [
                    'id'                  => $batch->id,
                    'no'                  => ++$key,
                    'name'                => $batch->name,
                    'price'               => $batch->price,
                    'batch_size'          => $batch->batch_size,
                    'live_status'         => view('components.action-component', ["data" => $swtichData])->render(),
                    'action'              => view('components.action-component',  ["data" => $actionData])->render(),
                    'start_date_end_date' => $batch->getWebStartDateEndDate(),
                    "sport_name"          => $batch->sport ? $batch->sport->name : "",
                    "age_group"           => $batch->ageGroup ? $batch->ageGroup->age_name : "",
                ];
            }
            return $records;
        }
        return view('coaching.pages.batch.index')->with(['custom_title' =>  __("BATCH_MANAGMENT")]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        $sports = CoachingCentreOfferedSport::with("sport:id,name,logo")->coachingId()->get();
        $ageGroups = AgeGroup::select("id", "age_name")->get();
        $content = Content::where('slug', 'commission')->first();

        return view('coaching.pages.batch.create', ["sports" => $sports, "age_groups" => $ageGroups, 'commission' => $content ? $content->content : 1])->with(['custom_title' => __("CREATE_BATCH")]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBatchRequest $request)
    {
        // dd($request->all());
        try {
            DB::transaction(function () use ($request) {
                // $content = Content::where('slug', 'commission')->first();
                $batchValidate = $request->validated();
                $batchValidate["start_date"] = Carbon::createFromFormat('d/m/Y', $batchValidate["start_date"])->format('Y-m-d');
                $batchValidate["session_days"] = implode(",", $request->session_days);
                $batchValidate["actual_price"] = $this->calculateActualPrice($batchValidate["price"]);
                $batchValidate["end_date"] = Carbon::createFromFormat('d/m/Y', $batchValidate["end_date"])->format('Y-m-d');
                $batchValidate["live_status"] = $batchValidate["live_status"] == "on" ? (BatchStatus::LIVE)->value : (BatchStatus::INACTIVE)->value;
                $batchValidate["coaching_centre_id"] = auth('coaching')->user()->id;
                Batch::create($batchValidate);
            });
            flash('Batch is created successfully!')->success();
            return to_route("coaching.batch.index");
        } catch (Exception $e) {
            flash('Something is wrong' . $e->getMessage())->error();
            return redirect()->route("coaching.batch.create");
        }
    }

    function calculateActualPrice($totalPrice)
    {
        $content = Content::where('slug', 'commission')->first();
        return ($totalPrice - ($totalPrice * $content->content) / 100);
    }
    /**
     * Display the specified resource.
     */
    public function show(Batch $batch)
    {
        return view('coaching.pages.batch.view', compact("batch"));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Batch $batch)
    {
        if (!$batch->ableToEdit()) {
            if ($batch->completion_status == "1") {
                flash("You are not able to edit batch is completed")->error();
                return to_route("coaching.batch.index");
            }
            if ($batch->live_status == "1") {
                flash("You are not able to edit batch is live")->error();
                return to_route("coaching.batch.index");
            }
        }
        $offeredSports = CoachingCentreOfferedSport::with("sport:id,name,logo")->coachingId()->get();
        $ageGroups     = AgeGroup::all();
        return view("coaching.pages.batch.edit", ["offered_sports" => $offeredSports, "age_groups" => $ageGroups, "batch" => $batch])->with(["custom_title" => "Edit Batch"]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreBatchRequest $request, Batch $batch)
    {
        // dd($request->all());
        if (!empty($request->action) && $request->action == 'change_status') {
            $content = ['status' => 204, 'message' => "something went wrong"];
            if ($batch) {
                $batch->live_status = ($request->value) ? BatchStatus::LIVE : BatchStatus::INACTIVE;
                if ($batch->save()) {
                    $content['status']  = 200;
                    $content['message'] = "Status updated successfully.";
                }
            }
            return response()->json($content);
        }

        try {
            DB::transaction(function () use ($request, $batch) {
                $batchValidate        = $request->validated();
                $batchValidate["start_date"]         = Carbon::createFromFormat('d/m/Y', $batchValidate["start_date"])->format('Y-m-d');
                $batchValidate["session_days"]       = is_array($request->session_days) ?  implode(",", $request->session_days) : "";
                $batchValidate["end_date"]           = Carbon::createFromFormat('d/m/Y', $batchValidate["end_date"])->format('Y-m-d');
                $batchValidate["live_status"]        = $batchValidate["live_status"] == "on" ? (BatchStatus::LIVE)->value : (BatchStatus::INACTIVE)->value;
                $batchValidate["coaching_centre_id"] = auth('coaching')->user()->id;
                $batch->update($batchValidate);
            });
            if (!$request->wantsJson()) {
                flash('Batch is updated successfully!')->success();
                return to_route("coaching.batch.index");
            }
        } catch (Exception $e) {
            flash('Something is wrong' . $e->getMessage())->error();
            return redirect()->route("coaching.batch.index");
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Batch $batch)
    {
        $batch->delete();
        $content['status']  = 200;
        $content['message'] = "Batch is deleted successfully.";
        $content['count']   = Batch::count();
        return response()->json($content);
    }
}
