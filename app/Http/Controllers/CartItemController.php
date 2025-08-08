<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use Illuminate\Http\Request;
use App\Models\Product;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CartItemController extends Controller
{
    public function addToCart(Request $request)
    {
        try {
            $request->validate([
                "product_id" => "required|exists:products,id",
                "quantity" => "required|min:1|max: " . Product::find($request->product_id)->stock,
            ]);

            return DB::transaction(function () use ($request) {
                $user = Auth::user();
                $product = Product::lockForUpdate()->find($request->product_id);
                $quantity = $request->input("quantity", 1);

                if ($user->id !== Auth::id()) {
                    throw new \Exception("Customer tidak sesuai");
                }

                if ($product->stock < $quantity) {
                    throw new \Exception("Stock tidak cukup");
                }

                $cartItem = CartItem::firstOrNew([
                    "user_id" => $user->id,
                    "product_id" => $product->id,
                ]);

                $cartItem->quantity = ($cartItem->quantity ?? 0) + $quantity;
                $cartItem->save();

                $product->decrement("stock", $quantity);

                return response()->json([
                    "Message" => "Produk berhasil ditambahkan ke dalam keranjang",
                    "data" => $cartItem->load("product")
                ], 200);
            });
        } catch (Exception $e) {
            return response()->json([
                "Message" => "Produk gagal ditambahkan ke dalam keranjang",
                "error" => $e->getMessage()
            ], 400);
        }
    }

    public function allCarts()
    {
        try {
            if (Auth::user()->role !== "admin") {
                return response()->json(["Message" => "Anda tidak memiliki akses!!!"], 403);
            }
            
            $cartItems = CartItem::with("product", "user")->get();

            $totalPrice = $cartItems->sum( function($item) {
                return $item->quantity * $item->product->price;
            });

            return response()->json(["Message" => "Semua Cart", "data" => $cartItems], 200);
        } catch (Exception $e) {
            return response()->json(["Message" => "Gagal memuat", "error" => $e->getMessage()], 400);
        }
    }
}
