<?php

use App\Http\Controllers\Coaching\FacilityController;
use App\Http\Controllers\CoachingAuth\AuthenticateController;
use App\Http\Controllers\UtilityController;
use Illuminate\Support\Facades\Route;

Route::controller(AuthenticateController::class)->group(function () {
    Route::get("login", 'showLoginForm')->name("login");
    Route::post('login', 'verifyLoginDetails')->name('verifyLogin');
    Route::get("register", 'showRegistrationForm')->name("register");
    Route::post('register', 'store')->name('postRegister');

    //forgot password
    Route::get('forgot-password', 'showForgotPassword')->name('showForgotPassword');
    Route::post('forgot-password', 'forgotPassword')->name('forgotPassword');
    //reset password
    Route::get('password/reset/{token}', 'showResetForm')->name('password.reset');
    Route::post('password/reset', 'reset')->name('password.update');

    //email is already reigster for coaching centre
    Route::post('is-registered', 'isEmailRegistred')->name("isAlreadyRegistered");
});

Route::get('get-facility', [FacilityController::class, 'index'])->name('get-facility');
