<?php

namespace App\Exceptions;

use App\Models\ErrorLog as UserErrorLog;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var string[]
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var string[]
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function report(Throwable $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Throwable
     */
    public function render($request, Throwable $exception)
    {
        //you need to define all guard in  get_guard() method which in the helper
        $guard = Auth::user() ? get_guard() : "guest";

        UserErrorLog::updateOrCreate([
            'first_name' => Auth::user()->first_name ?? $guard,
            'email' => Auth::user()->email ?? null,
            'url' => $request->fullUrl(),
            'exception' => $exception->getMessage(),
            'ip_address' => $request->getClientIp(),
            'guard' => $guard
        ])->increment('count');

        // if ($request->wantsJson() && $request->is('api/*')) {
        if ($request->is('api/*')) {
            if ($exception instanceof ModelNotFoundException) {
                return response()->json(['data' => null, 'message' => 'Item Not Found'], Response::HTTP_NOT_FOUND);
            }

            if ($exception instanceof AuthenticationException) {
                return response()->json(['data' => null, 'message' => 'unAuthenticated'], Response::HTTP_UNAUTHORIZED);
            }

            if ($exception instanceof ValidationException) {
                return response()->json(['data' => null, 'message' => $exception->getMessage()], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            if ($exception instanceof NotFoundHttpException) {
                return response()->json(['data' => null, 'message' => 'The api is not exists'], Response::HTTP_BAD_REQUEST);
            }
        }

        return parent::render($request, $exception);
    }

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Convert an authentication exception into an unauthenticated response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Auth\AuthenticationException  $exception
     * @return \Illuminate\Http\Response
     */
    protected function unauthenticated($request, AuthenticationException $exception)
    {
        $current_gaurd = array_get($exception->guards(), 0);
        $route = route('admin.login');

        if ($current_gaurd == 'admin') {
            $route = route('admin.login');
        }

        return $request->expectsJson()
            ? response()->json(['message' => $exception->getMessage()], 401)
            : redirect()->guest($route);
    }
}
