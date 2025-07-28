<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Exception;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function addProduct(Request $request)
    {
        // dd($request->file('image'));
        try {
            $request->validate([
                "product_name" => "required|string|max:255",
                "description" => "required|string|max:500",
                "ram" => "required|integer",
                "internal_memory" => "required|integer",
                "price" => "required|integer",
                "stock" => "required|integer",
                "image" => "required|image|mimes:jpeg,png,jpg|max:2064"

            ]);

            $imageUrl = null;

            if($request->hasFile("image") && $request->file("image")->isValid()) {
                $file = $request->file("image");

                $destinationPath = storage_path("app/public/products");

                $extention = strtolower($file->getClientOriginalExtension());

                $file_name = now()->format("YmdHis") . "-" . uniqid() . "." . $extention;

                $file->move($destinationPath, $file_name);

                // $path = $file->storeAs("products", $file_name, "public");

                $imageUrl = Storage::url("products/" . $file_name);
            }

           

            $product = Product::create([
                "product_name" => $request->product_name,
                "description" => $request->description,
                "ram" => $request->ram,
                "internal_memory" => $request->internal_memory,
                "price" => $request->price,
                "stock" => $request->stock,
                "image" => $imageUrl,
            ]);

            return response()->json(["Message" => "Produk berhasil ditambahkan", "Produk" => $product], 200);
        } catch (Exception $e) {
            return response()->json(["Message" => "Produk gagal ditambahkan!!", "error" => $e->getMessage(), "trace" => $e->getTrace()[0] ?? null], 400);
        }
    }

    public function productDetail($id)
    {
        try {
            $product = Product::findOrFail($id);

            return response()->json(["Message" => "Detail Produk", "produk" => $product], 200);
        } catch (Exception $e) {
            return response()->json(["Message" => "Data tidak ditemukan", "error" => $e->getMessage()], 400);
        }
    }

    public function getAllProduct()
    {
        try {
            $product = Product::all();

            return response()->json(["Message" => "Data produk", "product" => $product], 200);
        } catch (Exception $e) {
            return response()->json(["Message" => "Data tidak ditemukan", "error" => $e->getMessage(), "trace" => $e->getTrace()[0]], 400);
        }
    }
}
