<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::post("register", [UserController::class, "register"]);
Route::post("login", [UserController::class, "login"]);
Route::get("all-users", [UserController::class, "getAllUsers"]);
Route::get("user/{id}", [UserController::class, "getUserById"]);
Route::post("user/{id}", [UserController::class, "updateUser"]);
