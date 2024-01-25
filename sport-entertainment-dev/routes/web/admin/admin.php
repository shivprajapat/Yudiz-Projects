<?php

use App\Http\Controllers\Admin\BannerImagesController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\ChartController;
use App\Http\Controllers\Admin\CityController;
use App\Http\Controllers\Admin\CountryController;
use App\Http\Controllers\Admin\ErrorController;
use App\Http\Controllers\admin\FaqsController;
use App\Http\Controllers\Admin\PagesController;
use App\Http\Controllers\Admin\SportsController;
use App\Http\Controllers\Admin\StateController;
use App\Http\Controllers\Admin\SummernoteController;
use App\Http\Controllers\Admin\UsersController;
use App\Http\Controllers\Admin\AgeGroupController;
use App\Http\Controllers\Admin\BannerImageController;
use App\Http\Controllers\Admin\BatchController;
use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\CmsPagesController;
use App\Http\Controllers\Admin\CoachingCentreController;
use App\Http\Controllers\Admin\ContentController;
use App\Http\Controllers\Admin\PushNotificationController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\UtilityController;
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

// Route::middleware(['check_permit', 'admin.verified'])->group(function() {

// });

Route::controller(PagesController::class)->group(function () {
    // Profile
    Route::get('profile/', 'profile')->name('profile');
    Route::post('profile/update', 'updateProfile')->name('profile.update');
    Route::put('change/password', 'updatePassword')->name('update-password');

    // Quick Link
    Route::get('quickLink', 'quickLink')->name('quickLink');
    Route::post('link/update', 'updateQuickLink')->name('update-quickLink');
});

Route::group(['middleware' => ['check_permit', 'revalidate']], function () {

    Route::controller(PagesController::class)->group(function () {
        /* Dashboard */
        Route::get('/', 'dashboard')->name('dashboard.index');
        Route::get('/dashboard', 'dashboard')->name('dashboard.index');

        /* Site Configuration */
        Route::get('/settings', "showSetting")->name('settings.index');
        Route::post('change-setting', "changeSetting")->name('settings.change-setting');
    });

    /* User */
    Route::get('users/listing', [UsersController::class, 'listing'])->name('users.listing');
    Route::resource('users', UsersController::class);


    /* Role Management */
    Route::get('roles/listing', [AdminController::class, 'listing'])->name('roles.listing');
    Route::resource('roles', AdminController::class);

    /* Batches  Management */
    Route::get('batches/listing', [BatchController::class, 'listing'])->name('batches.listing');
    Route::resource('batches', BatchController::class);

    /* Bookings  Management */
    Route::get('bookings/listing', [BookingController::class, 'listing'])->name('bookings.listing');
    Route::resource('bookings', BookingController::class);

    /* Reviews  Management */
    Route::get('reviews/listing', [ReviewController::class, 'listing'])->name('reviews.listing');
    Route::resource('reviews', ReviewController::class);

    /* Transactions  Management */
    Route::get('transactions/listing', [TransactionController::class, 'listing'])->name('transactions.listing');
    Route::resource('transactions', TransactionController::class);

    /* Sports  Management */
    Route::get('sports/listing', [SportsController::class, 'listing'])->name('sports.listing');
    Route::resource('sports', SportsController::class);

    /* Age Groups  Management */
    Route::get('age-groups/listing', [AgeGroupController::class, 'listing'])->name('age-groups.listing');
    Route::resource('age-groups', AgeGroupController::class);

    /* Push Notifications  Management */
    Route::get('push-notifications/listing', [PushNotificationController::class, 'listing'])->name('push-notifications.listing');
    Route::resource('push-notifications', PushNotificationController::class);
    //Test web notification
    Route::post('/store-token', [PushNotificationController::class, 'storeToken'])->name('push-notifications.store-token');
    Route::post('/send-web-notification', [PushNotificationController::class, 'sendWebNotification'])->name('push-notifications.send-notification');

    /* FAQs Management*/
    Route::get('faqs/listing', [FaqsController::class, 'listing'])->name('faqs.listing');
    Route::resource('faqs', FaqsController::class);

    /* Banner Images  Management*/
    Route::get('banner-images/listing', [BannerImageController::class, 'listing'])->name('banner-images.listing');
    Route::resource('banner-images', BannerImageController::class);

    /* contents  Management*/
    Route::resource('contents', ContentController::class);

    /* Country Management*/
    Route::get('countries/listing', [CountryController::class, 'listing'])->name('countries.listing');
    Route::resource('countries', CountryController::class);

    /* State Management*/
    Route::get('states/listing', [StateController::class, 'listing'])->name('states.listing');
    Route::resource('states', StateController::class);

    /* City Management*/
    Route::get('cities/listing', [CityController::class, 'listing'])->name('cities.listing');
    Route::resource('cities', CityController::class);

    /* Coaching Centre Management*/
    Route::get('coaching-centres/listing', [CoachingCentreController::class, 'listing'])->name('coaching-centres.listing');
    Route::post('coaching-centres/edit-images/upload-images/{coaching_id}', [CoachingCentreController::class,'uploadImages'])->name('coaching-centres.upload-images');
    Route::get('coaching-centres/edit-images/perform-action/{coaching_id}', [CoachingCentreController::class,'performAction'])->name('coaching-centres.perform-action');
    // Route::post('coaching-centres/delete-image', [CoachingCentreController::class,'deleteImage'])->name('coaching-centres.delete-image');
    Route::get('coaching-centres/view-images/{coaching_id}', [CoachingCentreController::class,'viewImages'])->name('coaching-centres.view-images');
    Route::get('coaching-centres/edit-images/{coaching_id}', [CoachingCentreController::class,'editImages'])->name('coaching-centres.edit-images');
    Route::get('coaching-centres/get-cities/{state_id}', [CoachingCentreController::class,'getCities'])->name('coaching-centres.get-cities');

    Route::resource('coaching-centres', CoachingCentreController::class);

    /* CMS Management*/
    Route::get('pages/listing', [CmsPagesController::class, 'listing'])->name('pages.listing');
    Route::resource('pages', CmsPagesController::class);

});

//User Exception
Route::get('users-error-listing', [ErrorController::class, "listing"])->name('error.listing');

//Chart routes
Route::controller(ChartController::class)->group(function () {
    Route::get('register-users-chart', 'getRegisterUser')->name('users.registerchart');
    Route::get('active-deactive-users-chart', 'getActiveDeactiveUser')->name('users.activeDeactiveChart');
});

Route::controller(UtilityController::class)->group(function () {
    Route::post('check-email', 'checkEmail')->name('check.email');
    Route::post('check-contact', 'checkContact')->name('check.contact');

    Route::post('check-title', 'checkTitle')->name('check.title');
    Route::post('profile/check-password', 'profilecheckpassword')->name('profile.check-password');
});

Route::post('summernote-image-upload', [SummernoteController::class, 'imageUpload'])->name('summernote.imageUpload');
Route::post('summernote-media-image', [SummernoteController::class, 'mediaDelete'])->name('summernote.mediaDelete');
