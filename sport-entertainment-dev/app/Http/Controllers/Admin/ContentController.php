<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Content;
use Illuminate\Http\Request;

class ContentController extends Controller
{
    public function index()
    {
        $contents = Content::get();
        return view('admin.pages.contents.index', compact('contents'))->with(['custom_title' => 'Contents']);
    }

    public function update(Request $request, Content $content)
    {
        $content->fill($request->only('content'));
        if ($content->save()) {
            flash('Content updated successfully!')->success();
        } else {
            flash('Unable to update content. Try again later')->error();
        }
        return redirect(route('admin.contents.index'));
    }
}
