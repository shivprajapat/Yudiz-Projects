<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Response;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        if ($request->getRequestUri() === RouteServiceProvider::ADMIN_HOME) {
            if (!$request->expectsJson()) {
                return route('admin.login');
            }
        }

        if ($request->getRequestUri() === RouteServiceProvider::HOME) {
            if (!$request->expectsJson()) {
                return route('login');
            }
        }
    }
    protected function unauthenticated($request, $guard)
    {
        // dd($request->is('api/*'));
        if ($request->is('api/*')) {
            throw new HttpResponseException(response()->json(['data' => null, 'message' => "Please login to continue."], Response::HTTP_UNAUTHORIZED));
        }
    }
}
