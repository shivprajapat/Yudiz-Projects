<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CmsTypeEnums;
use App\Enums\StatusEnums;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CmsPageUpdateRequest;
use App\Models\CmsPage;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CmsPagesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $count = CmsPage::count();
        return view('admin.pages.cms.index', compact('count'))->with(['custom_title' => ('CMS Pages')]);
    }


    public function show(CmsPage $page)
    {
        return view('admin.pages.cms.view', compact('page'))->with(['custom_title' => 'CMS Page']);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CmsPage $page)
    {
        return view('admin.pages.cms.edit', ['page' => $page])->with(['custom_title' => 'CMS Page']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CmsPageUpdateRequest $request, CmsPage $page)
    {
        try {
            $coaching_centre_page  = $page;
            if (!empty($request->action) && $request->action == 'change_status') {
                $content = ['status' => 204, 'message' => "something went wrong"];
                if ($coaching_centre_page) {
                    $coaching_centre_page->is_active = ($request->value) ? StatusEnums::ACTIVE : StatusEnums::INACTIVE;
                    if ($coaching_centre_page->save()) {
                        $content['status'] = 200;
                        $content['message'] = "Status updated successfully.";
                    }
                }
                return response()->json($content);
            } else {
                $path = $coaching_centre_page->file;
                if ($request->has('remove_image')) {
                    if ($coaching_centre_page->file) {
                        Storage::delete($coaching_centre_page->file);
                    }
                    $path = null;
                }
                if ($request->hasFile('image')) {
                    if ($coaching_centre_page->file) {
                        Storage::delete($coaching_centre_page->file);
                    }
                    $path = imageUpload($request, 'image', 'general/files');
                }

                $coaching_centre_page->fill($request->only('title', 'description'));
                $coaching_centre_page->file = $path;
                if ($coaching_centre_page->save()) {
                    flash('flash_message.update', ['entity' => 'Page details'])->success();
                } else {
                    flash('try_again')->error();
                }

                return to_route('admin.pages.index');
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
        $content = ['status'=>204, 'message'=>"something went wrong"];
        if(!empty($request->action) && $request->action == 'delete_all') {
            $files = CmsPage::whereIn('id', explode(',', $request->ids))->pluck('file')->toArray();
            foreach ($files as $image) {
                if(!empty($image)) {
                    Storage::delete($image);
                }
            }
            CmsPage::whereIn('id', explode(',', $request->ids))->delete();
            $content['status']=200;
            $content['message'] = "Cms Pages deleted successfully.";
            $content['count'] = CmsPage::all()->count();
            return response()->json($content);
        } else {
            $page = CmsPage::where('id', $id)->firstOrFail();
            if($page->file) {
                Storage::delete($page->file);
            }
            $page->delete();
            if(request()->ajax()) {
                $content = array('status'=>200, 'message'=>"Cms Page deleted successfully.", 'count' => CmsPage::all()->count());
                return response()->json($content);
            } else {
                flash('Cms Page  deleted successfully.')->success();
                return redirect()->route('admin.pages.index');
            }
        }
    }

    /* Listing Details */
    public function listing(Request $request)
    {
        extract($this->DTFilters($request->all()));
        $records = [];
        $pages = CmsPage::where('cms_type', (CmsTypeEnums::COACHING_CENTRE)->value);
        if ($search != '') {
            $pages->where(function ($query) use ($search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $count = $pages->count();

        $records['recordsTotal'] = $count;
        $records['recordsFiltered'] = $count;
        $records['data'] = [];

        $pages = $pages->offset($offset)->limit($limit)->orderBy($sort_column, $sort_order);

        $pages = $pages->latest()->get();
        foreach ($pages as $key => $page) {

            $params = [
                'checked' => ($page->is_active ? 'checked' : ''),
                'getaction' => $page->is_active,
                'class' => '',
                'id' => $page->id,
            ];

            $records['data'][] = [
                'id' => $page->id,
                'sr_no' => ++$key,
                'title' => $page->title,
                'active' => view('admin.layouts.includes.switch', compact('params'))->render(),
                'action' => view('admin.layouts.includes.actions')->with(['custom_title' => 'Coaching Centre Cms Page', 'id' => $page->id], $page)->render(),
                'checkbox' => view('admin.layouts.includes.checkbox')->with('id', $page->id)->render(),
                'updated_at' => $page->updated_at,
            ];
        }
        return $records;
    }
}
