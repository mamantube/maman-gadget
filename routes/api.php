<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;

Route::post("register", [UserController::class, "register"]);
Route::post("login", [UserController::class, "login"]);
Route::get("all-users", [UserController::class, "getAllUsers"]);
Route::get("user/{id}", [UserController::class, "getUserById"]);
Route::post("user/{id}", [UserController::class, "updateUser"]);
Route::delete("user/{id}", [UserController::class, "deleteUser"]);

Route::post("/add-product", [ProductController::class, "addProduct"]);
Route::get("/products/{id}", [ProductController::class, "productDetail"]);
Route::get("products", [ProductController::class, "getAllProduct"]);
Route::post("products/{id}", [ProductController::class, "updateProduct"]);
Route::delete("products/{id}", [ProductController::class, "deleteProduct"]);