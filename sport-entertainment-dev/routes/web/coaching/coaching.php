<?php

use App\Http\Controllers\Coaching\BatchManagementController;
use App\Http\Controllers\Coaching\BookingManagementController;
use App\Http\Controllers\Coaching\CoachingCentreController;
use App\Http\Controllers\Coaching\DashboardController;
use App\Http\Controllers\Coaching\TransactionController;
use App\Http\Controllers\CoachingAuth\AuthenticateController;
use Illuminate\Support\Facades\Route;


Route::group(['middleware' => ['coaching']], function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('batch', BatchManagementController::class);
    Route::resource('booking', BookingManagementController::class);
    Route::get("earning", [TransactionController::class, 'index'])->name('earning');

    Route::get("coaching-details", [CoachingCentreController::class, 'index'])->name('coachingDetails');
    Route::post('coaching-update', [CoachingCentreController::class, 'updateCoachingCentre'])->name('coachingUpdate');
    Route::post('coaching-update-images', [CoachingCentreController::class, 'updateCoachingCentreImages'])->name('coachingUpdateImages');
    Route::get('coaching-update-images/perform-action/{coaching_id}', [CoachingCentreController::class,'performAction'])->name('coachingUpdateImages.performAction');


    Route::get('change-password', [AuthenticateController::class, 'changePassword'])->name('changePassword');
    Route::post('update-password', [AuthenticateController::class, 'updatePassword'])->name('updatePassword');
    Route::get("logout", [AuthenticateController::class, 'logout'])->name("logout");
});
