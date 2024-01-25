<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuickLink extends Model
{
    protected $table = "quick_links";

    protected $fillable = [
    	'admin_id', 'role_id','link_type'

    ];

    public function role()
    {
        return $this->belongsTo('App\Models\Role','role_id');
    }
}
