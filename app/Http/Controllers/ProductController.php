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
                "price" => "required|integer",
                "stock" => "required|integer",
                "image" => "required|image|mimes:jpeg,png,jpg|max:2064"

            ]);

            $imageUrl = null;

            if ($request->hasFile("image") && $request->file("image")->isValid()) {
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
                "price" => $request->price,
                "stock" => $request->stock,
                "image" => $imageUrl,
            ]);

            return response()->json(["Message" => "Produk berhasil ditambahkan", "data" => $product], 200);
        } catch (Exception $e) {
            return response()->json(["Message" => "Produk gagal ditambahkan!!", "error" => $e->getMessage(), "trace" => $e->getTrace()[0] ?? null], 400);
        }
    }

    public function productDetail($id)
    {
        try {
            $product = Product::findOrFail($id);

            return response()->json(["Message" => "Detail Produk", "data" => $product], 200);
        } catch (Exception $e) {
            return response()->json(["Message" => "Data tidak ditemukan", "error" => $e->getMessage()], 400);
        }
    }

    public function getAllProduct(Request $request)
    {
        try {
            $per_page = $request->query("per_page", 8);
            $search = $request->query("search");
            $query = Product::query();

            if ($search) {
                $query->where("product_name", "like", "%" . $search . "%")->orWhere("description", "like", "%" . $search . "%");
            }


            $product = $query->paginate($per_page);

            return response()->json([
                "Message" => "Data produk",
                "data" => $product->items(), 
                "meta" => [
                    "current_page" => $product->currentPage(),
                    "from" => $product->firstItem(),
                    "last_page" => $product->lastPage(),
                    "per_page" => $product->perPage(),
                    "to" => $product->lastItem(),
                    "total" => $product->total(),
                ],
                "links" => [
                    "first" => $product->url(1),
                    "last" => $product->url($product->lastPage()),
                    "next" => $product->previousPageUrl(),
                    "prev" => $product->nextPageUrl()
                ] ], 200);
        } catch (Exception $e) {
            return response()->json([
                "Message" => "Data tidak ditemukan", 
                "error" => $e->getMessage()], 400);
        }
    }

    public function updateProduct(Request $request, $id)
    {
        try {
            $product = Product::findOrFail($id);

            $request->validate([
                "product_name" => "sometimes|required|string|max:255",
                "description" => "sometimes|string|max:500",
                "ram" => "sometimes|required|integer",
                "internal_memory" => "sometimes|required|integer",
                "price" => "sometimes|required|integer",
                "stock" => "sometimes|required|integer",
                "image" => "sometimes|required|image|mimes:jpeg,png,jpg|max:2064"
            ]);

            $product->update([
                "product_name" => $request->product_name ?? $product->product_name,
                "description" => $request->description ?? $product->description,
                "ram" => $request->ram ?? $product->ram,
                "internal_memory" => $request->internal_memory ?? $product->internal_memory,
                "price" => $request->price ?? $product->price,
                "stock" => $request->stock ?? $product->stock,
                "image" => $request->image ?? $product->image,
            ]);

            return response()->json(["Message" => "Data produk berhasil diperbaharui", "data" => $product], 200);
        } catch (Exception $e) {
            return response()->json(["Message" => "Data produk gagal diperbaharui", "error" => $e->getMessage()], 400);
        }
    }

    public function deleteProduct($id)
    {
        try {
            $product = Product::findOrFail($id);

            if ($product->image) {
                $filpath = str_replace("/storage/", "", $product->image);

                Storage::disk("public")->delete($filpath);
            }

            $product->delete();

            return response()->json(["Message" => "Produk berhasil dihapus"], 200);
        } catch (Exception $e) {
            return response()->json(["Message" => "Produk gagal dihapus", "error" => $e->getMessage()], 400);
        }
    }
}
