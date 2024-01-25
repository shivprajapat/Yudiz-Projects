<?php

namespace App\Providers;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class ViewComposerServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(\App\Http\ViewComposers\AdminComposer::class);
        $this->app->singleton(\App\Http\ViewComposers\LoginComposer::class);
        $this->app->singleton(\App\Http\ViewComposers\UserComposer::class);
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        view()->composer(['admin.auth.*'], 'App\Http\ViewComposers\LoginComposer');
        view()->composer(['admin.pages.*','admin.layouts.*'], 'App\Http\ViewComposers\AdminComposer');
        view()->composer(['coaching.pages.*','coaching.layouts.*'], 'App\Http\ViewComposers\UserComposer');
    }
}
