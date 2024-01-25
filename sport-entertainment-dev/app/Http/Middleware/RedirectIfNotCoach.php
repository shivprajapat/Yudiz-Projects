<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfNotCoach
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $guard = 'coaching')
    {
        // dd(!Auth::guard($guard)->check());
        if (!Auth::guard($guard)->check()) {
	        return to_route('coaching.login');
	    }
        return $next($request);
    }
}
