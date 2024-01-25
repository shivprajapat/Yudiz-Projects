<?php

use App\Http\Controllers\Api\EndUser\{
    BookingController,
    SportController,
    AuthenticateController,
    BatchController,
    UtilityController,
    DashboardController,
    CoachingCentreController,
    ReviewController,
    UsersController,
    ParticipantController
};
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//routes for end users

/** without authentication routes start */
Route::controller(AuthenticateController::class)->group(function () {
    Route::post('send-otp', 'sendResendOtp')->name('sendOtp');
    // Route::post('check-registration', 'checkRegistration')->name('sendOtp');
    Route::post('verify-otp',  'verifyOtp')->name('sendVerifyOtp');
    Route::post('sign-up',  'signUp')->name('signUp');
});

/** without authentication routes end */
Route::controller(UtilityController::class)->group(function () {
    Route::get('slug', 'getCmsPage')->name('cmsPages');
    Route::get('faqs', 'getFaqs')->name('faqs');
    Route::post('contact-us', 'contactUs')->name('contactUs');
    Route::get('banner-detail', 'getBannerDetail')->name("getBannerDetail");
    Route::post('get-state', 'getState')->name("getState");
    Route::post('get-cities', 'getCities')->name("getCities");
    Route::post('filter-dashboard', 'getDashboardFilter')->name("getDashboardFilter");
});

/** with authentication api start */
Route::middleware('auth:sanctum')->group(function () {
    Route::controller(UtilityController::class)->group(function () {
        Route::get('age-groups', 'ageGroups')->name('ageGroups');
    });

    /** user apis */
    Route::controller(UsersController::class)->prefix("user")->group(function () {
        Route::get("",  'userInfo')->name('userInfo');
        Route::post("update",  'updateUser')->name("updateUser");
        Route::post('popular-sports', 'getPopularSports')->name("getPopularSports");
        Route::post('favourite-sports', 'favoriteSports')->name("favoriteSports");
        Route::post('logout', 'logout')->name("logout");
    });

    /** booking apis */
    Route::controller(BookingController::class)->prefix("booking")->group(function () {
        Route::post('add',  'addBooking')->name("addBooking");
        Route::post('summary',  'bookingSummary')->name("bookingSummary");
        Route::post('get-all', 'getBookings')->name('getBookings');
        Route::post('get-single', 'getBooking')->name('getBooking');
    });

    /** participant apis */
    Route::controller(ParticipantController::class)->prefix("participant")->group(function () {
        Route::get('get-all', 'participantsList')->name("participantsList");
        Route::post('add', 'addParticipant')->name("addParticipant");
        Route::post('get-single', 'editParticipant')->name("editParticipant");
        Route::post('update-participant', 'updateParticipants')->name("updateParticipants");
        Route::post('delete-participant', 'deleteParticipant')->name('deleteParticipant');
    });

    /** review apis */
    Route::controller(ReviewController::class)->prefix("review")->group(function () {
        Route::post('add-review', 'addReview')->name('addReview');
    });
});
/** with authentication api end */


Route::controller(CoachingCentreController::class)->prefix("coaching")->group(function () {
    Route::post('details', 'coachingInfo')->name('coachingDetails');
    Route::post('images', 'allImages')->name("allImages");
    Route::post('banner-images', 'bannerImages')->name("bannerImages");
});

Route::get('sports', [SportController::class, 'getSports'])->name("getSports");
Route::post('dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');

Route::controller(BatchController::class)->prefix("batch")->group(function () {
    Route::post('get-single', 'batchDetail')->name("batchDetail");
    Route::post('get-all', 'getBatchesByCoachingCentre')->name("getBatchesByCoachingCentre");
});
