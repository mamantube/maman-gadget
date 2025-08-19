<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartItemController;

Route::post("register", [UserController::class, "register"]);
Route::post("login", [UserController::class, "login"]);

Route::get("/products/{id}", [ProductController::class, "productDetail"]);
Route::get("products", [ProductController::class, "getAllProduct"]);

Route::middleware(["auth:sanctum"])->group( function() {
    Route::get("all-users", [UserController::class, "getAllUsers"]);
    Route::get("user/{id}", [UserController::class, "getUserById"]);
    Route::post("user/{id}", [UserController::class, "updateUser"]);
    Route::delete("user/{id}", [UserController::class, "deleteUser"]);
    
    Route::prefix("products")->group( function() {
        Route::post("/add-product", [ProductController::class, "addProduct"]);
        Route::post("/{id}", [ProductController::class, "updateProduct"]);
        Route::delete("/{id}", [ProductController::class, "deleteProduct"]);      
    });

    Route::prefix("carts")->group( function() {
        Route::get("/", [CartItemController::class, "allCarts"]);
        Route::post("add-to-carts", [CartItemController::class, "addToCart"]);
        Route::get("/{id}", [CartItemController::class, "cartDetail"]);
        Route::delete("/{id}", [CartItemController::class, "removeFromCart"]);
        Route::post("/{id}", [CartItemController::class, "payment"]);
    });
});