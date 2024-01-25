<?php

namespace App\Http\ViewComposers;

use App\Models\Role;
use App\Models\Section;
use App\Models\Setting;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Route;
use Illuminate\View\View;
use URL;

/**
 * To Manage View Details
 */
class AdminComposer
{
	public $menuItems = [];
	public $permissions = [];
	public $routeName = "";
	public $title = "";
	public $icon = "";
	public $image_type = "";
	public $image = "";
	public $setting = '';


	public function __construct()
	{
		// print_r(serialize(getPermissions('admin')));exit;
		$user = Auth::guard('admin')->user();
		$roleId = "";
		$routeName = Route::currentRouteName();
        $extra_slug = (!empty(Route::current()) ? Route::current()->parameters() : null);
		// $route_parameters = (!empty(Route::current()) ? request()->query() : null);

		$this->setting = Setting::pluck('value', 'constant');
		$this->routeName = $routeName = substr($routeName, 0, strrpos($routeName, '.'));

		try {
			if (config('utility.caching') && Redis::exists('active.routes.' . $routeName)) {
				$role = json_decode((Redis::get('active.routes.' . $routeName)));
			} else {
				$role = Role::where('route', 'like', $routeName . '.%')->first();
				if (config('utility.caching')) Redis::set('active.routes.' . $routeName, json_encode($role));
			}
		} catch (\Exception $ex) {
			$role = \Cache::remember('active.routes.' . $routeName, (60 * 60), function () use ($routeName) {
				return Role::where('route', 'like', $routeName . '%')->firstOrFail();
			});
		}
		$userPermissions = ($user ? unserialize($user->permissions) : []);
		if($role){
			$this->title = $role->title;
			$this->image_type = $role->icon_type;
			$this->icon = $role->icon;
			$this->image = $role->image;
		}

		$sections = [];

		try {
			if (config('utility.caching') && Redis::exists('active.sections')) {
				$sections = json_decode(Redis::get('active.sections'), true);

			} else {
                $sections = Section::activeSections()->toArray();
                // dd($sections);
				if (config('utility.caching')) Redis::set('active.sections', json_encode($sections));
			}
		} catch (\Exception $ex) {
			$sections = \Cache::remember('active.sections', (60 * 60), function () {
				return $sections = Section::activeSections()->toArray();
			});
		}

		foreach ($sections as $section) {
			$data = [];
			if (array_key_exists('roles', $section)) {
				$data	=	[
					'name'		=>	$section['name'],
					'image'		=>	$section['image'],
					'icon'		=>	$section['icon'],
					'icon_type'	=>	$section['icon_type'],
					'roles'		=>	[],
				];

				foreach ($section['roles'] as $s_role) {
					$active_class = '';
					if (array_key_exists($s_role['id'], $userPermissions) && !empty($userPermissions[$s_role['id']])) {
						if ($s_role['id'] == $role->id) {
							$this->permissions = explode(',', $userPermissions[$role->id]['permissions']);
						}

						if (substr($s_role['route'], 0, strrpos($s_role['route'], '.')) == $this->routeName) {
						// if (substr($s_role['route'], 0, strrpos($role->route, '.')) == $this->routeName) {
							if (!empty($s_role['params'])) {
								if (!empty($route_parameters['slug'])) {
									if ($route_parameters['slug'] == $s_role['params']) {
										$active_class = 'menu-item-active';
									}
								}
							} else {
								$active_class = 'menu-item-active';
							}
						}
						$data['roles'][] = array_merge(array('class' => $active_class), array_except($s_role, ['sequence', 'active', 'created_at', 'updated_at']));
					}
				}

				if (count($data['roles']) > 0)
					$this->menuItems[] = $data;
			}
		}
	}

	public function compose(View $view)
	{
		$data = [
			'menu' => $this->menuItems,
			'permissions' => $this->permissions,
			'routeName' => $this->routeName,
			'title' => $view->getData()['title'] ?? $this->title,
			'icon' => $this->icon,
			'sitesetting' => $this->setting,
			'mend_sign' => '<span class="mendatory">*</span>',
		];
		$view->with($data);
	}
}
