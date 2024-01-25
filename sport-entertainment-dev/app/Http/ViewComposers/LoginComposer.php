<?php

namespace App\Http\ViewComposers;

use App\Models\Setting;
use Illuminate\View\View;

/**
 * To Manage View Details
 */
class LoginComposer
{
	public $setting = '';

	public function __construct()
	{
		$this->setting = Setting::pluck('value', 'constant');
	}

	public function compose(View $view)
	{
		$data = [
			'sitesetting' => $this->setting,
		];
		$view->with($data);
	}
}
