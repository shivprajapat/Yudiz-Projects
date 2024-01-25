<?php

use App\Http\Controllers\AdminAuth\{
    LoginController, RegisterController, ForgotPasswordController, ResetPasswordController
};

use App\Http\Controllers\Auth\{ConfirmPasswordController,VerificationController};
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Here is where you can register admin routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/**
 * Admin Extra Middlewares
 * =======================================================================================
 * admin.password.confirm   =>  Re-confirm the password before accessing the given routes.
 * admin.verified           =>  Only email verified admins can see or open the given routes.
 *
 */

// Guest Routes
Route::controller(LoginController::class)->group(function() {
    Route::get('login', 'showLoginForm')->name('login');
    Route::post('login', 'login');
    Route::post('logout', 'logout')->name('logout');
});

// Route::controller(RegisterController::class)->group(function() {
//     Route::get('register', 'showRegistrationForm')->name('register');
//     Route::post('register', 'register');
// });

Route::controller(ForgotPasswordController::class)->group(function() {
    Route::get('password/reset', 'showLinkRequestForm')->name('password.request');
    Route::post('password/email', 'sendResetLinkEmail')->name('password.email');
});

Route::controller(ResetPasswordController::class)->group(function() {
    Route::get('password/reset/{token}', 'showResetForm')->name('password.reset');
    Route::post('password/reset', 'reset')->name('password.update');
});

// Auth Protected Routes
Route::middleware(['web', 'admin', 'auth:admin'])->group(function() {
    Route::controller(ConfirmPasswordController::class)->group(function() {
        Route::get('password/confirm', 'showConfirmForm')->name('password.confirm');
        Route::post('password/confirm', 'confirm');
    });

    Route::controller(VerificationController::class)->group(function() {
        Route::get('email/verify', 'show')->name('verification.notice');
        Route::get('email/verify/{id}/{hash}', 'verify')->name('verification.verify');
        Route::post('email/resend', 'resend')->name('verification.resend');
    });
});
