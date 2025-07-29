<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\CartItem;

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

    public function CartItem()
    {
        return $this->hasMany(CartItem::class);
    }
}
