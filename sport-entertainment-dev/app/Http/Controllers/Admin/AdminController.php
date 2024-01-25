<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RoleDetails;
use App\Models\{Admin,Role};
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('admin.pages.roles.index')->with(['custom_title' => 'Role Management']);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $roles = Role::where('is_active', 1)->get();
        return view('admin.pages.roles.create')->with(['custom_title' => 'Create Role','roles'=>$roles]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(RoleDetails $request)
    {
        $permissions = [];
        if (!empty($request->roles)) {
            foreach ($request->roles as $id => $role) {
                if ($id == 1) {
                    $permissions[$id] = ['permissions' => 'access'];
                } else {
                    $permissions[$id] = ['permissions' => implode(',', $role['permissions'])];
                }
            }
        }

        $permissions[1] = ['permissions' => 'access'];
        $request['permissions'] = serialize($permissions);
        $password = "subadmin@321";
        $request['password'] = Hash::make($password);

        // dd($request->all());
        $user = Admin::create($request->all());
        Config::set('auth.defaults.passwords', 'admins');

        // $token = app('auth.password.broker')->createToken($user);
        // $user->sendPasswordResetNotification($token);

        flash(trans('flash_message.admin_reset'))->success();
        return redirect(route('admin.roles.index'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(Admin $role)
    {
        $roles = Role::where('is_active', 1)->get();
        return view('admin.pages.roles.edit', ['role' => $role, 'roles' => $roles])->with(['custom_title' => __('Edit Role')]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(RoleDetails $request, Admin $role)
    {
        if (!empty($request->action) && $request->action == 'change_status') {
                $content = ['status' => $this->statusArr['something_wrong'], 'message' => trans('flash_message.something')];
                if ($role->id) {
                    $role->is_active = $request->value;
                    if ($role->save()) {
                        $content['status'] = $this->statusArr['success'];
                        $content['message'] = trans('flash_message.update', ['entity' => 'Status']);
                    }
                }
                return response()->json($content);
            }
        else {

            $permissions = [];

            if (!empty($request->roles)) {
                foreach ($request->roles as $id => $user_role) {
                    if ($id == 1) {
                        $permissions[$id] = ['permissions' => 'access'];
                    } else {
                        $permissions[$id] = ['permissions' => implode(',', $user_role['permissions'])];
                    }
                }
            }
            $permissions[1] = ['permissions' => 'access'];
            $request['permissions'] = serialize($permissions);
            unset($request['email']);
            $role->fill($request->all());
            if ($role->save()) {
                flash(trans('flash_message.update', ['entity' => 'User role']))->success();
            } else {
                flash(trans('try_again'))->error();
            }
            return redirect(route('admin.roles.index'));
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
            $content = ['status' => $this->statusArr['something_wrong'], 'message' => trans('flash_message.something')];
            Admin::whereIn('id', explode(',', $request->ids))->delete();
            $content['status'] = $this->statusArr['success'];
            $content['message'] = trans('flash_message.delete', ['entity' => 'User role']);
            $content['count'] = Admin::where('type', 'role')->count();
            return response()->json($content);
        }
        else {
            Admin::where('id', $id)->delete();
            if (request()->ajax()) {
                $content = ['status' => $this->statusArr['success'], 'message' => trans('flash_message.delete', ['entity' => 'User role']), 'count' => Admin::where('type', 'role')->count()];
                return response()->json($content);
            } else {
                flash(trans('flash_message.delete', ['entity' => 'User role']))->success();
                return redirect()->route('admin.roles.index');
            }
        }

    }


    /* Listing Details */
    public function listing(Request $request) {
        extract($this->DTFilters($request->all()));
        $records = [];
        $sub_admins = Admin::where('type', 'manager');

        if ($search != '') {
            $sub_admins->where(function ($query) use ($search) {
                $query->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('contact_number', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $count = $sub_admins->count();

        $records['recordsTotal'] = $count;
        $records['recordsFiltered'] = $count;
        $records['data'] = [];

        $sub_admins = $sub_admins->offset($offset)->limit($limit)->orderBy($sort_column, $sort_order);

        $users = $sub_admins->latest()->get();
        foreach ($users as $user) {

            $params = [
                'checked' => ($user->is_active ? 'checked' : ''),
                'getaction' => $user->is_active,
                'class' => '',
                'id' => $user->id,
            ];

            $records['data'][] = [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => '<a href="mailto:' . $user->email . '" >' . $user->email . '</a>',
                'contact_number' => $user->contact_number ? '<a href="tel:' . $user->contact_number . '" >' . $user->contact_number . '</a>' : 'N/A',
                'active' => view('admin.layouts.includes.switch', compact('params'))->render(),
                'action' => view('admin.layouts.includes.actions')->with(['id' => $user->id], $user)->render(),
                'checkbox' => view('admin.layouts.includes.checkbox')->with('id', $user->id)->render(),
                'updated_at' => $user->updated_at,
            ];
        }
        // dd($records);
        return $records;
    }

}
