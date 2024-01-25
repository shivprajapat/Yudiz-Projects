<?php

namespace App\Http\ViewComposers;

use App\Models\Role;
use App\Models\Section;
use App\Models\Setting;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Route;
use Illuminate\View\View;

/**
 * To Manage View Details
 */
class UserComposer
{
	public $menuItems = [];
	public $permissions = [];
	public $routeName = "";
	public $title = "";
	public $icon = "";
	public $image_type = "";
	public $image = "";
	public $setting = '';
	public $activeRoute = '';


	public function __construct()
	{
		// print_r(serialize(getPermissions('admin')));exit;
		$roleId = "";
		$routeName = Route::currentRouteName();
		$this->activeRoute = Route::currentRouteName();
		$extra_slug = (!empty(Route::current()) ? Route::current()->parameters() : null);
		$this->setting = Setting::pluck('value', 'constant');
		$this->routeName = $routeName = substr($routeName, 0, strrpos($routeName, '.'));
	}

	public function compose(View $view)
	{
		$data = [
			'menu' => $this->menuItems,
			'permissions' => $this->permissions,
			'routeName' => $this->routeName,
			'activeRoute' => $this->activeRoute,
			'title' => $view->getData()['title'] ?? $this->title,
			'icon' => $this->icon,
			'sitesetting' => $this->setting,
			'mend_sign' => '<span class="mendatory">*</span>',

		];
		$view->with($data);
	}
}
