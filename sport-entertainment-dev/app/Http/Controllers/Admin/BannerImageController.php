<?php

namespace App\Http\Controllers\Admin;

use App\Enums\StatusEnums;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BannerImageRequest;
use App\Models\{BannerImage,CoachingCentre};
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BannerImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('admin.pages.banner_images.index')->with(['custom_title' => 'Banner Images']);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $coaching_centres = CoachingCentre::select('id', 'coaching_name')->get();
        return view('admin.pages.banner_images.create', compact('coaching_centres'))->with(['custom_title' => 'Banner Image']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BannerImageRequest $request)
    {
        $path = null;
        if($request->has('banner_image')) {
            $path = imageUpload($request, 'banner_image', 'images/banners');
        }
        $banner_image = BannerImage::create($request->all());
        $banner_image->banner_image = $path;
        if($banner_image->save()) {
            flash('Banner image created successfully!')->success();
        } else {
            flash('Unable to save image. Please try again later.')->error();
        }
        return redirect(route('admin.banner-images.index'));
    }

    /**
     * Display the specified resource.
     */
    public function show(BannerImage $bannerImage)
    {
        return view('admin.pages.banner_images.view', compact('bannerImage'))->with(['custom_title' => 'Banner Image']);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BannerImage $bannerImage)
    {
        $coaching_centres = CoachingCentre::select('id', 'coaching_name')->get();
        return view('admin.pages.banner_images.edit', compact(['bannerImage','coaching_centres']))->with(['custom_title' => 'Banner Image']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BannerImageRequest $request, BannerImage $bannerImage)
    {
        try {
            if(!empty($request->action) && $request->action == 'change_status') {
                $content = ['status'=>204, 'message'=>"something went wrong"];
                if($bannerImage) {
                    $bannerImage->is_active = ($request->value) ? StatusEnums::ACTIVE : StatusEnums::INACTIVE;
                    if($bannerImage->save()) {
                        $content['status']=200;
                        $content['message'] = "Status updated successfully.";
                    }
                }
                return response()->json($content);
            } else {
                $path = $bannerImage->banner_image;
                if($request->has('remove_banner_image')) {
                    if($bannerImage->banner_image) {
                        Storage::delete($bannerImage->banner_image);
                    }
                    $path = null;
                }
                if($request->hasFile('banner_image')) {
                    if($bannerImage->banner_image) {
                        Storage::delete($bannerImage->banner_image);
                    }
                    $path = imageUpload($request, 'banner_image', 'images/bannerImages');
                }
                if($request->coaching_centre_id) {
                    $bannerImage->redirect_url = null ;
                } else {
                    $bannerImage->coaching_centre_id = null ;
                }

                $bannerImage->fill($request->all());
                $bannerImage->banner_image = $path;
                if($bannerImage->save()) {
                    flash('Banner Image details updated successfully!')->success();
                } else {
                    flash('Unable to update banner image. Try again later')->error();
                }
                return redirect(route('admin.banner-images.index'));
            }
        } catch(QueryException $e) {
            return redirect()->back()->flash('error', $e->getMessage());
        } catch(Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        if(!empty($request->action) && $request->action == 'delete_all') {
            $content = ['status'=>204, 'message'=>"something went wrong"];
            BannerImage::whereIn('id', explode(',', $request->ids))->delete();
            $content['status']=200;
            $content['message'] = "Banner Images deleted successfully.";
            $content['count'] = BannerImage::all()->count();
            return response()->json($content);
        } else {
            $banner_image = BannerImage::where('id', $id)->firstOrFail();
            if($banner_image->banner_image) {
                Storage::delete($banner_image->banner_image);
            }
            $banner_image->delete();
            if(request()->ajax()) {
                $content = array('status'=>200, 'message'=>"Banner Image deleted successfully.", 'count' => BannerImage::all()->count());
                return response()->json($content);
            } else {
                flash('Banner Image deleted successfully.')->success();
                return redirect()->route('admin.banner-images.index');
            }
        }
    }

    public function listing(Request $request)
    {
        extract($this->DTFilters($request->all()));
        $records = [];
        $banner_images = BannerImage::query();

        if ($search != '') {
            $banner_images->where(function ($query) use ($search) {
                $query->where('banner_image', 'like', "%{$search}%")
                ->orWhere('banner_type', 'like', "%{$search}%")
                ->orWhere('redirect_url', 'like', "%{$search}%")
                ->orWhere('coaching_centre_id', 'like', "%{$search}%")
                ->orWhere('banner_note', 'like', "%{$search}%");
            });
        }

        $count = $banner_images->count();

        $records['recordsTotal'] = $count;
        $records['recordsFiltered'] = $count;
        $records['data'] = [];

        $banner_images = $banner_images->offset($offset)->limit($limit)->orderBy($sort_column, $sort_order);

        $banner_images = $banner_images->latest()->get();

        foreach ($banner_images as $banner_image) {
            $redirect_id = $banner_image->coachingCentre->coaching_name ?? null;
            $params = [
                'checked' => ($banner_image->is_active ? 'checked' : ''),
                'getaction' => $banner_image->is_active,
                'class' => '',
                'id' => $banner_image->id,
            ];

            $records['data'][] = [
                'id' => $banner_image->id,
                'banner_image' => generate_url($banner_image->banner_image),
                'banner_type' => $banner_image->banner_type,
                'banner_redirect' => $banner_image->redirect_url ?? $redirect_id,
                'banner_note' => $banner_image->banner_note,
                'active' => view('admin.layouts.includes.switch', compact('params'))->render(),
                'action' => view('admin.layouts.includes.actions')->with(['custom_title' => 'banner_images', 'id' => $banner_image->id], $banner_image)->render(),
                'updated_at' => $banner_image->updated_at,
                'checkbox' => view('admin.layouts.includes.checkbox')->with('id', $banner_image->id)->render(),
            ];
        }
        return $records;
    }
}
