<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class ActionComponent extends Component
{
    /**
     * Create a new component instance.
     */
    public $edit, $delete, $view, $route, $id, $switch;
    public function __construct($view = false, $edit = false, $delete = false, $switch = false, $route, $id)
    {
        // dd("hii");
        $this->edit = $edit;
        $this->delete = $delete;
        $this->view = $view;
        $this->route = $route;
        $this->switch = $switch;
        $this->id = $id;
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.action-component', [
            "view" => $this->view, "edit" => $this->edit,
            "delete" => $this->delete, "route" => $this->route, "switch" => $this->switch, "id" => $this->id
        ]);
    }
}
