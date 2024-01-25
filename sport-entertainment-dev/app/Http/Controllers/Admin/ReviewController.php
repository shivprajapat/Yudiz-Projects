<?php

namespace App\Http\Controllers\Admin;

use App\Enums\StatusEnums;
use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        return view('admin.pages.reviews.index')->with(['custom_title' => 'Reviews']);
    }
    public function show(Review $review)
    {
        return view('admin.pages.reviews.view', compact('review'))->with(['custom_title' => 'Review']);
    }
    public function update(Request $request, Review $review)
    {
        if (!empty($request->action)) {
            if ($review) {
                $review->is_approved = $request->action;
                if ($review->save()) {
                    if($request->action == StatusEnums::REJECT->value) {
                        flash('Review rejected successfully!')->success();
                    } else {
                        flash('Review approved successfully!')->success();
                    }
                } else {
                    flash('Unable to perform action on review. Try again later')->error();
                }
                return redirect(route('admin.reviews.index'));
            }
        }
    }
    public function destroy(Request $request, $id)
    {
        $content = ['status'=>204, 'message'=>"something went wrong"];
        if(!empty($request->action) && $request->action == 'delete_all') {
            Review::whereIn('id', explode(',', $request->ids))->delete();
            $content['status']=200;
            $content['message'] = "Review deleted successfully.";
            $content['count'] = Review::all()->count();
            return response()->json($content);
        } else {
            $review = Review::where('id', $id)->firstOrFail();
            $review->delete();
            if(request()->ajax()) {
                $content = array('status'=>200, 'message'=>"Review deleted successfully.", 'count' => Review::all()->count());
                return response()->json($content);
            } else {
                flash('Review deleted successfully.')->success();
                return redirect()->route('admin.reviews.index');
            }
        }
    }

    public function listing(Request $request)
    {
        extract($this->DTFilters($request->all()));
        $records = [];

        if($sort_column == 'coaching_name') {
            $sort_column = 'coaching_centres.coaching_name';
        }
        elseif ($sort_column == 'user_name') {
            $sort_column = 'users.first_name';
        }
        elseif($sort_column == 'batch_name') {
            $sort_column = 'batches.name';
        }
        else{
            $sort_column = "reviews.{$sort_column}";
        }

        $reviews = Review::with('user', 'batch', 'coachingCentre')
                          ->join('users', 'reviews.user_id', '=', 'users.id')
                          ->join('coaching_centres', 'reviews.coaching_centre_id', '=', 'coaching_centres.id')
                          ->join('batches', 'reviews.batch_id', '=', 'batches.id');

        if($request->requested_type == 'approved') {
            $reviews->where('is_approved', StatusEnums::ACTIVE->value);
        } else {
            $reviews->where('is_approved', StatusEnums::INACTIVE->value);
        }
        if ($search != '') {
            $reviews->where(function ($query) use ($search) {
                $query->where('review_post_date', 'like', "%{$search}%")
                    ->orWhere('review_post_time', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('first_name', 'like', "%{$search}%")
                          ->orWhere('last_name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('batch', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                   ->orWhereHas('coachingCentre', function ($q) use ($search) {
                       $q->where('coaching_name', 'like', "%{$search}%");
                   });
            });
        }

        $count = $reviews->count();

        $records['recordsTotal'] = $count;
        $records['recordsFiltered'] = $count;
        $records['data'] = [];

        $reviews = $reviews->offset($offset)->limit($limit)->orderBy($sort_column, $sort_order);

        $reviews = $reviews->get();

        foreach ($reviews as $key => $review) {

            $params = [
                'checked' => ($review->is_active ? 'checked' : ''),
                'getaction' => $review->is_active,
                'class' => '',
                'id' => $review->id,
            ];

            $records['data'][] = [
                'id' => $review->id,
                'sr_no' =>  ++$key,
                'user_name' => $review->user->first_name. ' ' . $review->user->last_name,
                'coaching_name' => $review->coachingCentre->coaching_name ?? '',
                'batch_name' => $review->batch->name ?? '',
                'review_post_date' => $review->review_post_date . " | " . $review->review_post_time,
                'rating' => view('admin.layouts.includes.ratings')->with('rating', $review->rating)->render(),
                'updated_at' => $review->updated_at,
                'active' => view('admin.layouts.includes.switch', compact('params'))->render(),
                'action' => view('admin.layouts.includes.actions')->with(['custom_title' => 'reviews', 'id' => $review->id], $review)->render(),
                'requested_action' =>view('admin.layouts.includes.actions2')->with(['custom_title' => 'Coaching Center','id' => $review->id, 'request_type' => $request->requested_type], $review)->render(),
                'checkbox' => view('admin.layouts.includes.checkbox')->with('id', $review->id)->render(),
                'updated_at' => $review->updated_at,
            ];

        }

        return $records;
    }
}
