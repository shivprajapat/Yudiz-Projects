<?php

namespace App\Http\Controllers\Admin;

use App\Enums\{AdminApproveEnums,ImageAsBannerEnums,StatusEnums};
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CoachingCentreRequest;
use App\Models\{City,CoachingCentre,CoachingCentreImages,CoachingCentreOfferedSport,Facility,Sports,State};
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CoachingCentreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $count = CoachingCentre::where("is_admin_approve", AdminApproveEnums::PENDING_APPROVAL)->count();
        return view('admin.pages.coaching_centres.index', compact('count'))->with(['custom_title' => ('Coaching Centre')]);
    }

    /**
     * Display the specified resource.
     */
    public function show(CoachingCentre $coaching_centre)
    {
        $fac_ids =  explode(",", $coaching_centre->facility);
        $selected_facilities = Facility::select('name')->whereIn('id', $fac_ids)->get();
        return view('admin.pages.coaching_centres.view', compact(['coaching_centre','selected_facilities']))->with(['custom_title' => 'Coaching Centre']);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CoachingCentre $coaching_centre)
    {
        $sports =  Sports::select('name', 'id', 'logo')->get();
        $states =  State::select('id', 'name')->get();
        $cities =  City::select('id', 'name')->where('state_id', $coaching_centre->state->id)->get();
        $facilities = Facility::select('id', 'name')->get();
        return view('admin.pages.coaching_centres.edit', compact(['coaching_centre','sports','states','cities','facilities']))->with(['custom_title' => 'Coaching Centre']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CoachingCentreRequest $request, CoachingCentre $coaching_centre)
    {

        try {
            DB::beginTransaction();
            if(!empty($request->action)) {
                $content = ['status'=>204, 'message'=>"something went wrong"];
                if($coaching_centre) {
                    if($request->action == 'change_status') {
                        $coaching_centre->is_active = ($request->value) ? StatusEnums::ACTIVE : StatusEnums::INACTIVE;

                    } elseif($request->action == 'admin_approved') {
                        $coaching_centre->is_admin_approve = $request->action == 'admin_approved' ? AdminApproveEnums::APPROVE : AdminApproveEnums::PENDING_APPROVAL;

                    } else {
                        $coaching_centre->is_admin_approve = $request->action == 'admin_rejected' ? AdminApproveEnums::REJECT : AdminApproveEnums::PENDING_APPROVAL;
                        $coaching_centre->rejection_reason = $request->rejection_reason;
                    }
                    if($coaching_centre->save()) {
                        DB::commit();
                        if($request->action == 'admin_rejected')
                        {
                            $coaching_centre->sendRejectCoachingCentreReasonNotification();
                        }
                        $content['status']=200;
                    }
                }
                return response()->json($content);
            } else {
                $path = $coaching_centre->logo;

                if($request->has('remove_logo')) {
                    if($coaching_centre->logo) {
                        Storage::delete($coaching_centre->logo);
                    }
                    $path = null;
                }
                if($request->hasFile('logo')) {
                    if($coaching_centre->logo) {
                        Storage::delete($coaching_centre->logo);
                    }
                    $path = imageUpload($request, 'logo', 'images/coachingCentres/logo');
                }

                $coaching_centre['facility'] = $this->getFacilityValue($request->facilities) ?? "";
                $coaching_centre->fill($request->only(
                    "first_name",
                    "last_name",
                    "email",
                    "mobile_number",
                    "coaching_name",
                    "experience",
                    "bio",
                    "contact_number",
                    "contact_email",
                    "address_line1",
                    "address_line2",
                    "city_id",
                    "state_id",
                    "pincode",
                    "lat",
                    "long",
                ));
                $coaching_centre->logo = $path;

                if (isset($request->offered_sports) && count($request->offered_sports)) {
                    $coaching_id = $coaching_centre->id;
                    array_map(function ($id) use ($coaching_id) {

                        CoachingCentreOfferedSport::updateOrCreate(['coaching_centre_id' => $coaching_id,'sport_id' => $id], [ 'sport_id' => $id]);

                    }, $request->offered_sports);
                    CoachingCentreOfferedSport::where('coaching_centre_id', $coaching_id)->whereNotIn('sport_id', $request->offered_sports)->delete();
                }

                if($coaching_centre->save()) {
                    DB::commit();
                    flash('Coaching Centre details updated successfully!')->success();
                } else {
                    flash('Unable to update Coaching Centre. Try again later')->error();
                }
                return redirect(route('admin.coaching-centres.index'));
            }
        } catch(QueryException $e) {
            DB::rollback();
            return redirect()->back()->flash('error', $e->getMessage());
        } catch(Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $content = ['status'=>204, 'message'=>"something went wrong"];
        if(!empty($request->action) && $request->action == 'delete_all') {
            $logo = CoachingCentre::whereIn('id', explode(',', $request->ids))->pluck('logo')->toArray();
            foreach ($logo as $image) {
                if(!empty($image)) {
                    Storage::delete($image);
                }
            }
            CoachingCentre::whereIn('id', explode(',', $request->ids))->delete();
            $content['status']=200;
            $content['message'] = "Coaching Centre deleted successfully.";
            $content['count'] = CoachingCentre::all()->count();
            return response()->json($content);
        } else {
            $coaching_centre = CoachingCentre::where('id', $id)->firstOrFail();
            if($coaching_centre->coaching_centre) {
                Storage::delete($coaching_centre->coaching_centre);
            }
            $coaching_centre->delete();
            if(request()->ajax()) {
                $content = array('status'=>200, 'message'=>"Coaching Centre deleted successfully.", 'count' => CoachingCentre::all()->count());
                return response()->json($content);
            } else {
                flash('Coaching Centre deleted successfully.')->success();
                return redirect()->route('admin.coaching_centres.index');
            }
        }
    }

    public function listing(Request $request)
    {
        extract($this->DTFilters($request->all()));
        $records = [];
        $centres ='';
        if($request->requested_type == 'requested_data') {
            $centres = CoachingCentre::where('is_admin_approve', (AdminApproveEnums::PENDING_APPROVAL)->value)->orderBy($sort_column, $sort_order);
        } else {
            $centres = CoachingCentre::query();
        }
        if ($search != '') {
            $centres->where(function ($query) use ($search) {
                $query->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('coaching_name', 'like', "%{$search}%")
                    ->orWhere('mobile_number', 'like', "%{$search}%");
            });
        }

        $count = $centres->count();

        $records['recordsTotal'] = $count;
        $records['recordsFiltered'] = $count;
        $records['data'] = [];

        $centres = $centres->offset($offset)->limit($limit)->orderBy($sort_column, $sort_order);

        $centres = $centres->latest()->get();
        foreach ($centres as $key =>$centre) {

            $params = [
                'checked' => ($centre->is_active ? 'checked' : ''),
                'getaction' => $centre->is_active,
                'class' => '',
                'id' => $centre->id,
            ];
            $records['data'][] = [
                'id' => $centre->id,
                'sr_no' =>  ++$key,
                'first_name' => $centre->first_name,
                'last_name' =>$centre->last_name,
                'email' => $centre->email,
                'coaching_name' => $centre->coaching_name,
                'mobile_number' => $centre->mobile_number,
                'data_type' => $request->data_type,
                'active' => view('admin.layouts.includes.switch', compact('params'))->render(),
                'action' => view('admin.layouts.includes.actions')->with(['custom_title' => 'Coaching Center','id' => $centre->id], $centre)->render(),
                'requested_action' =>view('admin.layouts.includes.actions2')->with(['custom_title' => 'Coaching Center','id' => $centre->id,'request_type' => $request->requested_type], $centre)->render(),
                'checkbox' => view('admin.layouts.includes.checkbox')->with('id', $centre->id)->render(),
                'updated_at' => $centre->updated_at,

            ];
        }
        return $records;
    }

    public function viewImages(string $id)
    {
        $coaching_centre =  CoachingCentre::find($id);
        return view('admin.pages.coaching_centres.view-images', compact('coaching_centre'))->with(['custom_title' => "View Images"]);

    }
    public function editImages(string $id)
    {
        $coaching_centre =  CoachingCentre::find($id);
        $total_banners = CoachingCentreImages::where('coaching_centre_id', $id)->where('is_banner', 1)->count();
        return view('admin.pages.coaching_centres.edit-images', compact(['coaching_centre','total_banners']))->with(['custom_title' => "Images"]);

    }
    public function uploadImages(Request $request, string $id)
    {
        if ($request->hasFile('images')) {
            $images = $request->file('images');
            $result = [];
            foreach ($images as $image) {
                $imagePath = $image->store('images/coachingCentres');
                $resultNew = [
                    'id' => get_unique_string(),
                    'coaching_centre_id' =>$id,
                    'image_path' => $imagePath,
                ];
                $result = [...$result, $resultNew];
            }
            $uploaded_images = CoachingCentreImages::insert($result);
        }
        if ($uploaded_images) {
            flash('Images updated successfully!')->success();
        } else {
            flash('Unable to update image. Try again later')->error();
        }
        return to_route('admin.coaching-centres.edit-images', $id);
    }

    public function deleteImage(Request $request)
    {
        $status         =   'fail';
        $status_code    =   403;
        $message        =   trans('api.not_found', ['entity' => 'Media']);
        $image = CoachingCentreImages::where('id', $request->id)->first();

        if($image) {
            if(!empty($image->image_path)) {
                if(Storage::exists($image->image_path)) {
                    Storage::delete($image->image_path);
                }
            }

            $image->delete();

            $status         =   'success';
            $status_code    =   200;
            $message        =   trans('api.delete', ['entity' => 'Media']);
        }
        $response[$status] = $message;

        return response()->json($response, $status_code);
    }

    private function getFacilityValue($facility)
    {

        if ($facility) {
            if ($facility) {
                $getFacilityId =   array_map(function ($fac) {
                    $facilities =  Facility::updateOrCreate(
                        ["name" => $fac],
                        [
                            "name" =>  $fac
                        ]
                    );
                    return $facilities->id;
                }, $facility);
                return  implode(",", $getFacilityId);
            }
            return false;
        } else {
            return null;
        }
    }

    public function getCities($id)
    {
        $cities = City::where('state_id', $id)->get();
        return response()->json(['cities' => $cities]);
    }

    public function performAction(Request $request, $id)
    {
        $explodedIds = explode(',', $request->ids);
        $content = ['status'=>204, 'message'=>"something went wrong"];
        if(!empty($request->action) && $request->action == 'delete_all') {
            $images = CoachingCentreImages::whereIn('id', $explodedIds)->pluck('image_path')->toArray();
            foreach ($images as $image) {
                if(!empty($image)) {
                    Storage::delete($image);
                }
            }
            CoachingCentreImages::whereIn('id', $explodedIds)->delete();
            $content['status']=200;
            $content['message'] = "Coaching Centre images deleted successfully.";
            $content['count'] = CoachingCentreImages::all()->count();
            $content['action'] =$request->action ;
            return response()->json($content);
        } else {
            CoachingCentreImages::whereIn('id', $explodedIds)->update(['is_banner' => ImageAsBannerEnums::IS_BANNER]);
            $content['status']=200;
            $content['message'] = "Banners set successfully.";
            $content['count'] = CoachingCentreImages::all()->count();
            $content['action'] =$request->action ;
            return response()->json($content);
        }
    }
}
