<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Product;


class CartItem extends Model
{
    protected $fillable = [
        "user_id",
        "product_id",
        "quantity"
    ];

    protected $appends = [
        "total_price"
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function getTotalPriceAttribute()
    {
        return $this->quantity * $this->product->price;
    }
}
