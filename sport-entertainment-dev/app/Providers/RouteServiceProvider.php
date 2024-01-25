<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/home';
    public const ADMIN_HOME = '/admin/dashboard';
    public const COACHING_HOME = 'coaching/dashboard';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     *
     * @return void
     */
    public function boot()
    {
        $this->configureRateLimiting();

        /*
        |--------------------------------------------------------------------------
        | API Routes and Mappings
        |--------------------------------------------------------------------------
        |
        | Here is where you can create and map API related routes and it's files.
        |
        */

        // API Routes Mappings
        $this->mapApiRoutes();


        /*
        |--------------------------------------------------------------------------
        | Web Routes and Mappings
        |--------------------------------------------------------------------------
        |
        | Here is where you can create and map Web related routes and it's files.
        |
        */
        $this->routes(function () {
            // Web Routes Mapping
            $this->mapWebRoutes();

            // Admin Routes Mapping
            $this->mapAdminAuthRoutes();
            $this->mapAdminRoutes();
            $this->mapCoachAuthRoutes();
            $this->mapCoachRoute();
        });
    }

    /**
     * Configure the rate limiters for the application.
     *
     * @return void
     */
    protected function configureRateLimiting()
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }

    // API Routes Mappings
    protected function mapApiRoutes()
    {
        Route::prefix('api/v1')
            ->middleware('api')
            ->as('api.')
            ->namespace($this->namespace)
            ->group(base_path('routes/api/api.php'));
    }

    // Web Routes Mapping
    protected function mapWebRoutes()
    {
        Route::middleware('web')
            ->namespace($this->namespace)
            ->group(base_path('routes/web/web.php'));
    }

    // Admin Routes Mapping
    protected function mapAdminAuthRoutes()
    {
        Route::middleware('web')
            ->namespace($this->namespace)
            ->as('admin.')
            ->prefix('admin')
            ->group(base_path('routes/web/admin/adminAuth.php'));
    }

    // Admin Routes Mapping
    protected function mapAdminRoutes()
    {
        Route::middleware(['web', 'admin', 'auth:admin'])
            ->namespace($this->namespace)
            ->as('admin.')
            ->prefix('admin')
            ->group(base_path('routes/web/admin/admin.php'));
    }
    public function mapCoachAuthRoutes()
    {
        Route::middleware(['web'])
            ->namespace($this->namespace)
            ->as('coaching.')
            ->prefix('coaching')
            ->group(base_path('routes/web/coaching/coachingAuth.php'));
    }
    public function mapCoachRoute()
    {
        Route::middleware(['web','coaching'])
            ->namespace($this->namespace)
            ->as('coaching.')
            ->prefix('coaching')
            ->group(base_path('routes/web/coaching/coaching.php'));
    }
}
