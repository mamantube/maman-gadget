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
                "quantity" => "required|min:1|max:" . Product::find($request->product_id)->stock,
            ]);

            return DB::transaction(function () use ($request) {
                $user = Auth::user();
                $product = Product::lockForUpdate()->find($request->product_id);
                $quantity = $request->input("quantity", 1);

                if ($product->stock < $quantity) {
                    throw new \Exception("Stock tidak cukup");
                }

               $cartItem = CartItem::where("user_id", $user->id)->where("product_id", $product->id)->where("payment", "pending")->first();
               
               if (!$cartItem) {
                $cartItem = CartItem::create([
                    "user_id" => $user->id,
                    "product_id" => $product->id,
                    "quantity" => 0,
                    "payment" => "pending"
                ]);
               }

               $cartItem->quantity += $quantity;
               $cartItem->save();

               $product->decrement("stock", $quantity);

                return response()->json([
                    "message" => "Produk berhasil ditambahkan ke dalam keranjang",
                    "data" => $cartItem->load("product")
                ], 200);
            });
        } catch (Exception $e) {
            return response()->json([
                "message" => "Produk gagal ditambahkan ke dalam keranjang",
                "error" => $e->getMessage()
            ], 400);
        }
    }

    public function allCarts()
    {
        try {
            if (Auth::user()->role !== "admin") {
                return response()->json(["message" => "Anda tidak memiliki akses!!!"], 403);
            }

            $cartItems = CartItem::with("product", "user")->get();

            $totalPrice = $cartItems->sum(function ($item) {
                return $item->quantity * $item->product->price;
            });

            return response()->json(["message" => "Semua Cart", "data" => $cartItems], 200);
        } catch (Exception $e) {
            return response()->json(["message" => "Gagal memuat", "error" => $e->getMessage()], 400);
        }
    }

    public function cartDetail($id)
    {
        try {
            $item = CartItem::with("product")->find($id);

            if (!$item) {
                return response()->json(["message" => "Data tidak ditemukan"], 404);
            }

            if ($item->user_id !== Auth::id()) {
                return response()->json(["message" => "anda tidak memiliki izin untuk mengakses data ini!!!"], 403);
            }

            return response()->json(["message" => "Detail Cart", "data" => $item], 200);
        } catch (Exception $e) {
            return response()->json(["message" => "tidak dapat memuat data", "error" => $e->getMessage()], 400);
        }
    }

    public function removeFromCart($id)
    {
        try {
            $item = CartItem::with("product")->find($id);

            if (!$item) {
                return response()->json(["message" => "data tidak ditemukan"], 404);
            }

            if ($item->user_id !== Auth::id()) {
                return response()->json(["message" => "anda tidak memiliki akses!!!"], 403);
            }

            $item->delete();

            return response()->json(["message" => "item berhasil dihapus dari cart"], 200);
        } catch (Exception $e) {
            return response()->json(["message" => "terjadi kesalahan", "error" => $e->getMessage()], 400);
        }
    }

    public function payment($id)
    {
        try {
            $item = CartItem::with("product", "user")->findOrFail($id);

            if (!$item) {
                return response()->json(["message" => "data tidak ditemukan"], 400);
            }

            if ($item->user_id !== Auth::id()) {
                return response()->json(["message" => "anda tidak memiliki akses!!!"], 403);
            }

            $item->payment = "success";
            $item->save();

            return response()->json(["message" => "pembayaran berhasil", "data" => $item], 200);
        } catch (Exception $e) {
            return response()->json(["message" => "terjadi kesalahan", "error" => $e->getMessage()], 400);
        }
    }
}
