<?php

namespace App\Http\Controllers\admin;

use App\Enums\FaqTypeEnums;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FaqRequest;
use App\Models\Faq;
use Illuminate\Http\Request;
class FaqsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */


    public function index()
    {
        return view('admin.pages.faqs.index')->with(['custom_title' => 'Faqs']);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('admin.pages.faqs.create')->with(['custom_title' => 'Faq']);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(FaqRequest $request)
    {
        $faq = Faq::create($request->all());
        if ($faq) {
            flash('faq created successfully!')->success();
        } else {
            flash('Unable to save faq. Please try again later.')->error();
        }
        return redirect(route('admin.faqs.index'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Faq $faq)
    {
        return view('admin.pages.faqs.view', compact('faq'))->with(['custom_title' => 'Faq']);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(Faq $faq)
    {
        return view('admin.pages.faqs.edit', compact('faq'))->with(['custom_title' => 'Faq']);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update( FaqRequest $request,Faq $faq)
    {
        if (!empty($request->action) && $request->action == 'change_status') {
            $content = ['status' => 204, 'message' => "something went wrong"];
            if ($faq) {
                $faq->is_active = $request->value;
                if ($faq->save()) {
                    $content['status'] = 200;
                    $content['message'] = "Faq updated successfully.";
                }
            }
            return response()->json($content);
        } else {
            $faq->fill($request->all());
            if ($faq->save()) {
                flash('Faq details updated successfully!')->success();
            } else {
                flash('Unable to update'.'Try again later')->error();
            }
            return redirect(route('admin.faqs.index'));
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
            $faq = Faq::where('id', $id)->firstOrFail();
            $faq->delete();
            if (request()->ajax()) {
                $content = array('status' => 200, 'message' => "faq deleted successfully.", 'count' => Faq::all()->count());
                return response()->json($content);
            } else {
                flash('faq deleted successfully.')->success();
                return redirect()->route('admin.faqs.index');
            }
    }

    /* Listing Details */
    public function listing(Request $request)
    {
        extract($this->DTFilters($request->all()));
        $records = [];
        $faqs = '';
        if($request->user_type)
        $faqs = Faq::where('faq_type',$request->user_type);
        else
        {
            $faqs = Faq::query();
        }
        if ($search != '') {
            $faqs->where(function ($query) use ($search) {
                $query->where('title', 'like', "%{$search}%")
                ->orWhere('faq_type', 'like', "%{$search}%");
            });
        }

        $count = $faqs->count();

        $records['recordsTotal'] = $count;
        $records['recordsFiltered'] = $count;
        $records['data'] = [];

        $faqs = $faqs->offset($offset)->limit($limit)->orderBy($sort_column, $sort_order);

        $faqs = $faqs->latest()->get();
        foreach ($faqs as  $key =>$faq) {
            $params = [
                'checked' => ($faq->is_active ? 'checked' : ''),
                'getaction' => $faq->is_active,
                'class' => '',
                'id' => $faq->id,
            ];
            $records['data'][] = [
                'id' => $faq->id,
                'sr_no' =>  ++$key,
                'title' => $faq->title,
                'faq_type' => $faq->faq_type == (FaqTypeEnums::END_USER)->value ? 'End User' : 'Coaching Centre',
                'active' => view('admin.layouts.includes.switch', compact('params'))->render(),
                'action' => view('admin.layouts.includes.actions')->with(['custom_title' => 'Faqs.', 'id' => $faq->id ], $faq)->render(),
                'updated_at' => $faq->updated_at,
            ];
        }
        return $records;
    }
}
