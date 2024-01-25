<?php

use Illuminate\Support\Facades\Auth;
use DaveJamesMiller\Breadcrumbs\Facades\Breadcrumbs;

// Dashboard ---------------------------------------------------------------------------------------------------------------------------------------------------
Breadcrumbs::register('dashboard', function ($breadcrumbs) {
    $breadcrumbs->push('Dashboard', route(Auth::getDefaultDriver() . '.dashboard.index'));
});

// Users -------------------------------------------------------------------------------------------------------------------------------------------------------
Breadcrumbs::register('users_list', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard');
    $breadcrumbs->push('Users', route(Auth::getDefaultDriver() . '.users.index'));
});

// Quick Links
Breadcrumbs::register('quick_link', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard');
    $breadcrumbs->push(__('Mange Quick Link'), route('admin.quickLink'));
});
// Profile
Breadcrumbs::register('my_profile', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard');
    $breadcrumbs->push(__('Manage Account'), route('admin.profile'));
});

Breadcrumbs::register('users_view', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('users_list');
    $breadcrumbs->push('View User', route(Auth::getDefaultDriver() . '.users.show', $id));
});
Breadcrumbs::register('users_create', function ($breadcrumbs) {
    $breadcrumbs->parent('users_list');
    $breadcrumbs->push('Add New User', route(Auth::getDefaultDriver() . '.users.create'));
});
Breadcrumbs::register('users_update', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('users_list');
    $breadcrumbs->push('Edit User', route(Auth::getDefaultDriver() . '.users.edit', $id));
});

// Role Management -------------------------------------------------------------------------------------------------------------------------------------------------------
Breadcrumbs::register('roles_list', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard');
    $breadcrumbs->push('Roles', route(Auth::getDefaultDriver() . '.roles.index'));
});
Breadcrumbs::register('roles_create', function ($breadcrumbs) {
    $breadcrumbs->parent('roles_list');
    $breadcrumbs->push('Add New Role', route(Auth::getDefaultDriver() . '.roles.create'));
});
Breadcrumbs::register('roles_update', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('roles_list');
    $breadcrumbs->push(__('Edit Role'), route('admin.roles.edit', $id));
});

// Coaching Centre Management ---------------------------------------------------------------------------------------------------------------------------------------------------
Breadcrumbs::register('coaching-centres_list', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard');
    $breadcrumbs->push('Coaching Centres', route('admin.coaching-centres.index'));
});

Breadcrumbs::register('coaching-centres_update', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('coaching-centres_list');
    $breadcrumbs->push('Edit Coaching Centre', route('admin.coaching-centres.edit', $id));
});
Breadcrumbs::register('coaching-centres_view', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('coaching-centres_list');
    $breadcrumbs->push('View Coaching Centre', route(Auth::getDefaultDriver() . '.coaching-centres.show', $id));
});

Breadcrumbs::register('coaching-centres-images_view', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('coaching-centres_view', $id);
    $breadcrumbs->push("View Coaching Centre's Images");
});

Breadcrumbs::register('coaching-centres-images_update', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('coaching-centres_update', $id);
    $breadcrumbs->push("Edit Coaching Centre's Images");
});

// Batches -------------------------------------------------------------------------------------------------------------------------------------------------------
Breadcrumbs::register('batches_list', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard');
    $breadcrumbs->push('Batches', route(Auth::getDefaultDriver() . '.batches.index'));
});

Breadcrumbs::register('batches_view', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('batches_list');
    $breadcrumbs->push('View Batch', route(Auth::getDefaultDriver() . '.batches.show', $id));
});
Breadcrumbs::register('batches_update', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('batches_list');
    $breadcrumbs->push('Edit Batch', route(Auth::getDefaultDriver() . '.batches.edit', $id));
});

// Bookings -------------------------------------------------------------------------------------------------------------------------------------------------------
Breadcrumbs::register('bookings_list', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard');
    $breadcrumbs->push('bookings', route(Auth::getDefaultDriver() . '.bookings.index'));
});
Breadcrumbs::register('bookings_view', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('bookings_list');
    $breadcrumbs->push('View Batch', route(Auth::getDefaultDriver() . '.bookings.show', $id));
});


// Reviews -------------------------------------------------------------------------------------------------------------------------------------------------------
Breadcrumbs::register('reviews_list', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard');
    $breadcrumbs->push('reviews', route(Auth::getDefaultDriver() . '.reviews.index'));
});
Breadcrumbs::register('reviews_view', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('reviews_list');
    $breadcrumbs->push('View Batch', route(Auth::getDefaultDriver() . '.reviews.show', $id));
});

// Transactions -------------------------------------------------------------------------------------------------------------------------------------------------------
Breadcrumbs::register('transactions_list', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard');
    $breadcrumbs->push('Payments', route(Auth::getDefaultDriver() . '.transactions.index'));
});
// Sports -------------------------------------------------------------------------------------------------------------------------------------------------------
Breadcrumbs::register('sports_list', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard');
    $breadcrumbs->push('Sports', route(Auth::getDefaultDriver() . '.sports.index'));
});
Breadcrumbs::register('sports_create', function ($breadcrumbs) {
    $breadcrumbs->parent('sports_list');
    $breadcrumbs->push('Add New Sports', route(Auth::getDefaultDriver() . '.sports.create'));
});
Breadcrumbs::register('sports_view', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('sports_list');
    $breadcrumbs->push('View Sports', route(Auth::getDefaultDriver() . '.sports.show', $id));
});
Breadcrumbs::register('sports_update', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('sports_list');
    $breadcrumbs->push('Edit Sports', route(Auth::getDefaultDriver() . '.sports.edit', $id));
});

// Age Groups -------------------------------------------------------------------------------------------------------------------------------------------------------
Breadcrumbs::register('age-groups_list', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard');
    $breadcrumbs->push('Age Groups', route(Auth::getDefaultDriver() . '.age-groups.index'));
});
Breadcrumbs::register('age-groups_create', function ($breadcrumbs) {
    $breadcrumbs->parent('age-groups_list');
    $breadcrumbs->push('Add New Age group', route(Auth::getDefaultDriver() . '.age-groups.create'));
});
Breadcrumbs::register('age-groups_view', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('age-groups_list');
    $breadcrumbs->push('View Age Group', route(Auth::getDefaultDriver() . '.age-groups.show', $id));
});
Breadcrumbs::register('age-groups_update', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('age-groups_list');
    $breadcrumbs->push('Edit Age Group', route(Auth::getDefaultDriver() . '.age-groups.edit', $id));
});

// Push Notifications -------------------------------------------------------------------------------------------------------------------------------------------------------
Breadcrumbs::register('push-notifications_list', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard');
    $breadcrumbs->push('push-notifications', route(Auth::getDefaultDriver() . '.push-notifications.index'));
});
Breadcrumbs::register('push-notifications_create', function ($breadcrumbs) {
    $breadcrumbs->parent('push-notifications_list');
    $breadcrumbs->push('Push New Notifications', route(Auth::getDefaultDriver() . '.push-notifications.create'));
});
Breadcrumbs::register('push-notifications_view', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('push-notifications_list');
    $breadcrumbs->push('View push notifications', route(Auth::getDefaultDriver() . '.push-notifications.show', $id));
});

// FAQs ---------------------------------------------------------------------------------------------------------------------------------------------------
Breadcrumbs::register('faqs_list', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard');
    $breadcrumbs->push(__('FAQs'), route('admin.faqs.index'));
});
Breadcrumbs::register('faqs_create', function ($breadcrumbs) {
    $breadcrumbs->parent('faqs_list');
    $breadcrumbs->push('Add New FAQ', route('admin.faqs.create'));
});
Breadcrumbs::register('faqs_update', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('faqs_list');
    $breadcrumbs->push(__('Edit FAQ'), route('admin.faqs.edit', $id));
});
Breadcrumbs::register('faqs_view', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('faqs_list');
    $breadcrumbs->push('View FAQ ', route(Auth::getDefaultDriver() . '.faqs.show', $id));
});

// Banner Images -------------------------------------------------------------------------------------------------------------------------------------------------------
Breadcrumbs::register('banner-images_list', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard');
    $breadcrumbs->push('Banner Images', route(Auth::getDefaultDriver() . '.banner-images.index'));
});
Breadcrumbs::register('banner-images_create', function ($breadcrumbs) {
    $breadcrumbs->parent('banner-images_list');
    $breadcrumbs->push('Add New Banner Image', route(Auth::getDefaultDriver() . '.banner-images.create'));
});
Breadcrumbs::register('banner-images_view', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('banner-images_list');
    $breadcrumbs->push('View Banner Image', route(Auth::getDefaultDriver() . '.banner-images.show', $id));
});
Breadcrumbs::register('banner-images_update', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('banner-images_list');
    $breadcrumbs->push('Edit Banner Image', route(Auth::getDefaultDriver() . '.banner-images.edit', $id));
});

// countries -------------------------------------------------------------------------------------------------------------------------------------------------------
Breadcrumbs::register('countries_list', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard');
    $breadcrumbs->push('Countries', route(Auth::getDefaultDriver() . '.countries.index'));
});
Breadcrumbs::register('countries_create', function ($breadcrumbs) {
    $breadcrumbs->parent('countries_list');
    $breadcrumbs->push('Add New Country', route(Auth::getDefaultDriver() . '.countries.create'));
});

Breadcrumbs::register('countries_update', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('countries_list');
    $breadcrumbs->push('Edit Country', route(Auth::getDefaultDriver() . '.countries.edit', $id));
});

// states -------------------------------------------------------------------------------------------------------------------------------------------------------
Breadcrumbs::register('states_list', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard');
    $breadcrumbs->push('States', route(Auth::getDefaultDriver() . '.states.index'));
});
Breadcrumbs::register('states_create', function ($breadcrumbs) {
    $breadcrumbs->parent('states_list');
    $breadcrumbs->push('Add New State', route(Auth::getDefaultDriver() . '.states.create'));
});

Breadcrumbs::register('states_update', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('states_list');
    $breadcrumbs->push('Edit State', route(Auth::getDefaultDriver() . '.states.edit', $id));
});

// cities -------------------------------------------------------------------------------------------------------------------------------------------------------
Breadcrumbs::register('cities_list', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard');
    $breadcrumbs->push('Cities', route(Auth::getDefaultDriver() . '.cities.index'));
});
Breadcrumbs::register('cities_create', function ($breadcrumbs) {
    $breadcrumbs->parent('cities_list');
    $breadcrumbs->push('Add New City', route(Auth::getDefaultDriver() . '.cities.create'));
});

Breadcrumbs::register('cities_update', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('cities_list');
    $breadcrumbs->push('Edit City', route(Auth::getDefaultDriver() . '.cities.edit', $id));
});


//CMS Pages ---------------------------------------------------------------------------------------------------------------------------------------------------
Breadcrumbs::register('cms_list', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard');
    $breadcrumbs->push('CMS Pages', route('admin.pages.index'));
});
Breadcrumbs::register('cms_update', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('cms_list');
    $breadcrumbs->push('Edit CMS Page', route('admin.pages.edit', $id));
});
Breadcrumbs::register('cms_view', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('cms_list');
    $breadcrumbs->push('View CMS Page', route('admin.pages.show', $id));
});
//site configuartion
Breadcrumbs::register('site_setting', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard');
    $breadcrumbs->push(__('Site Configuration'), route('admin.settings.index'));
});

// Contents -------------------------------------------------------------------------------------------------------------------------------------------------------
Breadcrumbs::register('contents', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard');
    $breadcrumbs->push('Contents', route(Auth::getDefaultDriver() . '.contents.index'));
});


// ----------------------------------Start Coaching Center Breadcrums ----------------------------------------------

Breadcrumbs::register('dashboard_coaching', function ($breadcrumbs) {
    $breadcrumbs->push('Dashboard', route('coaching.dashboard'));
});

// Coaching Batch Management

// Sports -------------------------------------------------------------------------------------------------------------------------------------------------------
Breadcrumbs::register('coaching_batch_list', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard_coaching');
    $breadcrumbs->push('Batch', route('coaching.batch.index'));
});
Breadcrumbs::register('coaching_batch_create', function ($breadcrumbs) {
    $breadcrumbs->parent('coaching_batch_list');
    $breadcrumbs->push('Create Batch', route('coaching.batch.create'));
});
Breadcrumbs::register('coaching_batch_view', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('coaching_batch_list');
    $breadcrumbs->push('View Batch', route('coaching.batch.show', $id));
});
Breadcrumbs::register('coaching_batch_update', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('coaching_batch_list');
    $breadcrumbs->push('Edit Batch', route('coaching.batch.edit', $id));
});

/** Booking routes */
Breadcrumbs::register('coaching_booking_list', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard_coaching');
    $breadcrumbs->push('Booking', route('coaching.booking.index'));
});
Breadcrumbs::register('coaching_booking_view', function ($breadcrumbs, $id) {
    $breadcrumbs->parent('coaching_booking_list');
    $breadcrumbs->push('View Booking', route('coaching.booking.show', $id));
});

/** Earning routes */
Breadcrumbs::register('coaching_earning_view', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard_coaching');
    $breadcrumbs->push('Earnings', route('coaching.booking.index'));
});

/** coaching centre routes  */

Breadcrumbs::register('personal_details', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard_coaching');
    $breadcrumbs->push('Personal Details', route('coaching.booking.index'));
});

Breadcrumbs::register('coaching_centre_details', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard_coaching');
    $breadcrumbs->push('Coaching Center Details', route('coaching.booking.index'));
});

Breadcrumbs::register('coaching_centre_contact_details', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard_coaching');
    $breadcrumbs->push('Coaching Center Contact Details', route('coaching.booking.index'));
});

Breadcrumbs::register('bank_details', function ($breadcrumbs) {
    $breadcrumbs->parent('dashboard_coaching');
    $breadcrumbs->push('Bank Details', route('coaching.booking.index'));
});

//   -------- end of coaching center breadcumb ------------
