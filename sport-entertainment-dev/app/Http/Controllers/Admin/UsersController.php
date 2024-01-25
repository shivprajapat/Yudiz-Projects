<?php

namespace App\Http\Controllers\Admin;

use App\Enums\StatusEnums;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserRequest;
use App\Models\{City,User,Participant,State};
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UsersController extends Controller
{
    public function index()
    {
        return view('admin.pages.users.index')->with(['custom_title' => 'Users']);
    }

    public function create()
    {
        return view('admin.pages.users.create')->with(['custom_title' => 'User']);
    }

    public function store(UserRequest $request)
    {
        $request['custom_id']   =   get_unique_string('users');
        $request['password']    =   Hash::make(str_random(config('utility.default_password')));
        $path = null;
        if ($request->has('profile_photo')) {
            $path = $request->file('profile_photo')->store('users/profile_photo');
        }
        $user = User::create($request->all());
        $user->profile_photo = $path;
        if ($user->save()) {
            flash('User account created successfully!')->success();
        } else {
            flash('Unable to save avatar. Please try again later.')->error();
        }
        return redirect(route('admin.users.index'));
    }

    public function show(User $user)
    {
        return view('admin.pages.users.view', compact('user'))->with(['custom_title' => 'Users']);
    }

    public function edit(User $user)
    {
        $states =  State::select('id', 'name')->get();
        if ($user->state) {
            $cities =  City::select('id', 'name')->where('state_id', $user->state->id)->get();
        } else {
            $cities =  City::select('id', 'name')->get();
        }
        return view('admin.pages.users.edit', compact(['user', 'states', 'cities']))->with(['custom_title' => 'Users']);
    }

    public function update(UserRequest $request, User $user)
    {
        try {
            DB::beginTransaction();
            if (!empty($request->action) && $request->action == 'change_status') {
                $content = ['status' => 204, 'message' => "something went wrong"];
                if ($user) {
                    $user->is_active = ($request->value) ? StatusEnums::ACTIVE : StatusEnums::INACTIVE;
                    if ($user->save()) {
                        DB::commit();
                        $content['status'] = 200;
                        $content['message'] = "Status updated successfully.";
                    }
                }
                return response()->json($content);
            } else {
                $path = $user->profile_photo;
                if ($request->has('remove_profile_photo')) {
                    if ($user->profile_photo) {
                        Storage::delete($user->profile_photo);
                    }
                    $path = null;
                }

                if ($request->hasFile('profile_photo')) {
                    if ($user->profile_photo) {
                        Storage::delete($user->profile_photo);
                    }
                    $path = $request->profile_photo->store('users/profile_photo');
                }

                $user->fill($request->only(
                    "first_name",
                    "last_name",
                    "gender",
                    "dob",
                    "address_line_1",
                    "address_line_2",
                    "city_id",
                    "state_id",
                    "pin_code",
                ));
                $user->profile_photo = $path;
                if ($request->participants) {
                    $participantsData = $request->participants;

                    foreach ($participantsData as $data) {

                        $participant = Participant::find($data['id']);
                        $participant_path = $participant->profile_photo;
                        if ($participant) {
                            $participant->first_name = $data['first_name'];
                            $participant->last_name = $data['last_name'];
                            $participant->gender = $data['gender'];
                            $participant->dob = $data['dob'];
                            $participant->school_name = $data['school_name'];
                            if ($request->has('remove_participant_photo')) {
                                if ($participant->profile_photo) {
                                    Storage::delete($participant->profile_photo);
                                }
                                $participant_path = null;
                            }

                            if (isset($data['participant_photo'])) {
                                if ($participant->profile_photo) {
                                    Storage::delete($participant->profile_photo);
                                }
                                $participant_path = $data['participant_photo']->store('users/profile_photo');
                            }
                            $participant->profile_photo = $participant_path;
                            $participant->save();
                        }
                    }
                }
                if ($user->save()) {
                    DB::commit();
                    flash('User details updated successfully!')->success();
                } else {
                    flash('Unable to update user. Try again later')->error();
                }
                return redirect(route('admin.users.index'));
            }
        } catch (QueryException $e) {
            DB::rollback();
            return redirect()->back()->flash('error', $e->getMessage());
        } catch (Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function destroy(Request $request, $id)
    {

        $content = ['status' => 204, 'message' => "something went wrong"];
        if (!empty($request->action) && $request->action == 'delete_all') {

            $users_profile_photos = User::whereIn('custom_id', explode(',', $request->ids))->pluck('profile_photo')->toArray();
            foreach ($users_profile_photos as $image) {
                if (!empty($image)) {
                    Storage::delete($image);
                }
            }
            User::whereIn('custom_id', explode(',', $request->ids))->delete();
            $content['status'] = 200;
            $content['message'] = "User deleted successfully.";
            $content['count'] = User::all()->count();
        } else {
            $user = User::where('custom_id', $id)->firstOrFail();
            if ($user->profile_photo) {
                Storage::delete($user->profile_photo);
            }
            $user->delete();
            if (request()->ajax()) {
                $content = array('status' => 200, 'message' => "User deleted successfully.", 'count' => User::all()->count());
            } else {
                flash('User deleted successfully.')->success();
                return redirect()->route('admin.users.index');
            }
        }
        return response()->json($content);
    }

    public function listing(Request $request)
    {
        extract($this->DTFilters($request->all()));
        $records = [];
        $users = User::query();

        if ($sort_column == "user_name") {
            $users = $users->select('*')
                ->selectRaw('CONCAT(first_name, " ", last_name) as full_name')
                ->whereNull('deleted_at')
                ->orderByRaw('CONCAT(first_name, " ", last_name) ' . $sort_order . '');
            $users->withCount("participants");
        } else {
            $users->withCount("participants");
            $users->orderBy($sort_column, $sort_order);
        }

        if ($search != '') {
            $users->where(function ($query) use ($search) {
                $query->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('mobile_number', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $count = $users->count();

        $records['recordsTotal'] = $count;
        $records['recordsFiltered'] = $count;
        $records['data'] = [];
        $users = $users->offset($offset)->limit($limit)->latest()->get();

        foreach ($users as $user) {
            $params = [
                'checked' => ($user->is_active ? 'checked' : ''),
                'getaction' => $user->is_active,
                'class' => '',
                'id' => $user->custom_id,
            ];

            $records['data'][] = [
                'id' => $user->id,
                'user_name' => $user->first_name . ' ' . $user->last_name,
                'email' => '<a href="mailto:' . $user->email . '" >' . $user->email . '</a>',
                'gender' => $user->gender->name,
                'dob' => $user->dob,
                'participants_count' => $user->participants_count,
                'active' => view('admin.layouts.includes.switch', compact('params'))->render(),
                'action' => view('admin.layouts.includes.actions')->with(['custom_title' => 'User', 'id' => $user->custom_id], $user)->render(),
                'updated_at' => $user->updated_at,
                'checkbox' => view('admin.layouts.includes.checkbox')->with('id', $user->custom_id)->render(),
            ];
        }
        return $records;
    }

    public function trashed()
    {
        $users = User::onlyTrashed()->get();
        return view('admin.pages.users.trashed', compact('users'))->with(['custom_title' => 'TRASHED']);
    }

    public function trashedData(Request $request)
    {
        extract($this->DTFilters($request->all()));
        $records = [];
        $users = User::query();

        if ($search != '') {
            $users->where(function ($query) use ($search) {
                $query->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('contact_number', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $count = $users->count();

        $records['recordsTotal'] = $count;
        $records['recordsFiltered'] = $count;
        $records['data'] = [];

        $users = $users->offset($offset)->limit($limit)->orderBy($sort_column, $sort_order);

        $users = $users->onlyTrashed()->get();
        foreach ($users as $user) {

            $params = [
                'checked' => ($user->is_active ? 'checked' : ''),
                'display' => ($user->is_display == 'y' ? 'checked' : ''),
                'getaction' => $user->is_active,
                'class' => '',
                'id' => $user->id,
            ];

            $records['data'][] = [
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => '<a href="mailto:' . $user->email . '" >' . $user->email . '</a>',
                'contact_number' => $user->contact_number ? '<a href="tel:' . $user->contact_number . '" >' . $user->contact_number . '</a>' : 'N/A',
                'active' => view('admin.layouts.includes.switch', compact('params'))->render(),
                'display' => view('admin.layouts.includes.switchDisplay', compact('params'))->render(),
                'action' => view('admin.layouts.includes.actions')->with(['custom_title' => 'User', 'id' => $user->custom_id], $user)->render(),
                'checkbox' => view('admin.layouts.includes.checkbox')->with('id', $user->id)->render(),
            ];
        }
        return $records;
    }
}
