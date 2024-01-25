<?php

namespace App\Http\Controllers\Coaching;

use App\Enums\ImageAsBannerEnums;
use App\Http\Controllers\Controller;
use App\Http\Requests\Coaching\UpdateCoachingCentreRequest;
use App\Models\CoachingCentreImages;
use App\Models\CoachingCentreOfferedSport;
use App\Models\Facility;
use App\Models\Sports;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CoachingCentreController extends Controller
{
    //
    function index(Request $request)
    {
        /**
         * mode => edit, view
         * step => Personal Details->personal_details, Coaching centre details->coaching_centre_details
         * contact details->coaching_centre_contact_details, Bank details->bank_details
         */
        $data  = [
            "type" => $request->type ?? "view",
            'step_name' => $request->step_name ?? "personal_details",
            "view_more_images" => $request->view_more_images ?? false,
        ];

        $coaching_data =  auth('coaching')->user()->load(["offeredSports:id,coaching_centre_id,sport_id", "offeredSports.sport:id,name,logo"]);

        $offeredSports = $allSports = $allFacilities = $editedFacilities = $allFacilitiesForEdit = $total_banners = [];
        if ($request->step_name == "coaching_centre_details") {
            // DB::enableQueryLog();

            $allFacilities = Facility::select("id", "name")->get();
            $facilityIds = explode(',', $coaching_data->facility);
            $allFacilities->each(function ($facility) use ($facilityIds) {
                $facility->is_selected = in_array($facility->id, $facilityIds);
            });
            $allFacilities = $allFacilities->toArray();
            // dd($allFacilities);
            if ($coaching_data->offeredSports) {
                $offeredSports = $coaching_data->offeredSports->pluck("sport_id")->toArray();
            }

            $editedFacilities = array_filter($allFacilities, function ($facility) {
                return $facility['is_selected'] == true;
            });
            $names = array_column($editedFacilities, "name");
            $editedFacilities = implode(", ", $names);
            $total_banners = CoachingCentreImages::where('coaching_centre_id', $coaching_data->id)->where('is_banner', 1)->count();

            //all sports data fetch only edit time
            if ($request->type == "edit") {
                $allSports =  Sports::select("id", "name", "logo")->where("is_active", "1")->get();
                $allFacilitiesForEdit = array_map(function ($item) {
                    return '"' . $item . '"';
                }, array_column($allFacilities, "name"));
                // :::: pending working on api
                $allFacilitiesForEdit = implode(', ', $allFacilitiesForEdit);
                // dd($allFacilitiesForEdit);
            }
        }
        return view("coaching.pages.profile.view", ["data" => $data, "custom_title" => "Personal Details", "coaching_data" => $coaching_data, "facilities" => $allFacilities, "offeredSports" => $offeredSports, "allSports" => $allSports, "editedFacilities" => $editedFacilities, 'allFacilitiesForEdit' => $allFacilitiesForEdit, 'total_banners' => $total_banners]);
    }
    function updateCoachingCentre(UpdateCoachingCentreRequest $request)
    {
        $coachingUser = auth('coaching')->user();
        $step_name = $request->step_name;
        // remove the underscore from step name and capital first letter
        $formated_step_name = str_replace("_", " ", $step_name);
        $formated_step_name = ucwords($formated_step_name);

        switch ($step_name) {
            case 'personal_details':
                $coachingUser->first_name = $request->first_name;
                $coachingUser->last_name = $request->last_name;
                $coachingUser->email = $request->email;
                $coachingUser->mobile_number = $request->mobile_number;
                $coachingUser->profile_photo = imageUpload($request, 'profile_photo', 'images/coaching/profiles', $coachingUser->profile_photo);
                break;

            case 'coaching_centre_contact_details':
                $coachingUser->contact_number = $request->contact_number;
                $coachingUser->address_line1 = $request->address_line1;
                $coachingUser->address_line2 = $request->address_line2;
                $coachingUser->contact_email = $request->contact_email;
                break;

            case "bank_details":
                $coachingUser->account_person_name = $request->account_person_name;
                $coachingUser->account_number = $request->account_number;
                $coachingUser->bank_name = $request->bank_name;
                $coachingUser->ifsc_code = $request->ifsc_code;
                break;

            case "coaching_centre_details":
                $coachingUser->coaching_name = $request->coaching_name;
                $coachingUser->experience = $request->experience;
                $coachingUser->bio = $request->bio;

                // get previous offered sports
                $previous_offered_sports = $coachingUser->offeredSports->pluck("sport_id")->toArray();

                // new offered sports
                $new_offered_sports = $request->sport_id;

                // get the sports which are removed
                $removed_sports = array_diff($previous_offered_sports, $new_offered_sports);

                // get the sports which are added
                $added_sports = array_diff($new_offered_sports, $previous_offered_sports);

                // remove the sports which are removed
                if (!empty($removed_sports)) {
                    $coachingUser->offeredSports()->whereIn("sport_id", $removed_sports)->delete();
                }

                // add the sports which are added
                if (!empty($added_sports)) {
                    $offered_sports = [];
                    foreach ($added_sports as $sport_id) {
                        $offered_sports[] = [
                            "id" => get_unique_string(),
                            "coaching_centre_id" => $coachingUser->id,
                            "sport_id" => $sport_id,
                            "created_at" => now(),
                            "updated_at" => now()
                        ];
                    }

                    CoachingCentreOfferedSport::insert($offered_sports);
                }

                $facility = getTagifyValue($request->facility);

                // get the facility ids
                $getFacilityId = [];
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
                }
                $getFacilityId = implode(",", $getFacilityId);

                $coachingUser->facility = $getFacilityId;

                // if logo
                if ($request->hasFile('logo')) {
                    $coachingUser->logo = imageUpload($request, 'logo', 'images/coaching/logo', $coachingUser->logo);
                }
                break;

            default:
                # code...
                break;
        }
        $coachingUser->save();
        flash($formated_step_name . ' updated successfully!')->success();
        return to_route("coaching.coachingDetails", ["step_name" => $step_name]);
    }

    function updateCoachingCentreImages(Request $request)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg',
        ]);
        $step_name = $request->step_name;
        $view_more_images = $request->view_more_images;
        $uploaded_images = false;
        if ($request->hasFile('images')) {
            $images = $request->file('images');
            $result = [];
            foreach ($images as $image) {
                $imagePath = $image->store('images/coachingCentres');
                $resultNew = [
                    'id' => get_unique_string(),
                    'coaching_centre_id' => $request->coaching_id,
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
        return to_route("coaching.coachingDetails", ["step_name" => $step_name, "type" => $request->type, "view_more_images" =>  $view_more_images]);
    }

    function performAction(Request $request, $id)
    {
        $explodedIds = explode(',', $request->ids);
        $content = ['status' => 204, 'message' => "something went wrong"];
        if (!empty($request->action) && $request->action == 'delete_all') {
            $images = CoachingCentreImages::whereIn('id', $explodedIds)->pluck('image_path')->toArray();
            foreach ($images as $image) {
                if (!empty($image)) {
                    Storage::delete($image);
                }
            }
            CoachingCentreImages::whereIn('id', $explodedIds)->delete();
            $content['status'] = 200;
            $content['message'] = "Coaching Centre images deleted successfully.";
            $content['count'] = CoachingCentreImages::all()->count();
            $content['action'] = $request->action;
            return response()->json($content);
        } else {
            CoachingCentreImages::whereIn('id', $explodedIds)->update(['is_banner' => ImageAsBannerEnums::IS_BANNER]);
            $content['status'] = 200;
            $content['message'] = "Banners set successfully.";
            $content['count'] = CoachingCentreImages::all()->count();
            $content['action'] = $request->action;
            return response()->json($content);
        }
    }
}
