<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        "product_name",
        "description",
        "ram",
        "internal_memory",
        "price",
        "stock",
        "image"

    ];
}
