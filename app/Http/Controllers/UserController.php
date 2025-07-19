<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Password;
use Exception;


class UserController extends Controller
{
    public function register (Request $request)
    {
        try {
            $request->validate([
                "name" => "required|string|max:255",
                "user_name" => "required|string|max:255|unique:users",
                "phone" => "required|string|max:15|unique:users",
                "email" => "required|string|email|max:255|unique:users",
                "password" =>  ["required", "string", "min:6", "regex:/^(?=.*[A-Z])(?=.*\d).{6,}$/"],
            ]);

            $user = User::create([
                "name" => $request->name,
                "user_name" => $request->user_name,
                "phone" => $request->phone,
                "email" => $request->email,
                "password" => Hash::make($request->password),
            ]);

            return response()->json(["message" => "Registrasi berhasil", "user" => $user], 201);
        } catch (Exception $e) {
            return response()->json(["error" => $e->getMessage()], 400);
        }
    }
}
