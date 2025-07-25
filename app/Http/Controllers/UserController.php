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
                "phone" => ["required", "max:13", "unique:users", "regex:/^(\+62|62)?[\s-]?0?8[1-9]{1}\d{1}[\s-]?\d{4}[\s-]?\d{2,5}$/"],
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

    public function login(Request $request)
    {
        try {
            $request->validate([
                "email" => "required|email",
                "password" => "required|string"
            ]);

            $user = User::where("email", $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json(["message" => "Email atau password salah"], 401);
            }

            $token = $user->createToken("auth_token")->plainTextToken;

            return response()->json(["message" => "Login berhasil!", "user" => $user, "token" => $token], 200);
        } catch (Exception $e) {
            return response()->json(["error" => $e->getMessage()], 400);
        }
    }

    public function getAllUsers()
    {
        try {
            $users = User::all();

            return response()->json(["Message" => "Data Pengguna", "user" => $users], 200);
        } catch (Exception $e) {
            return response()->json(["error" => $e->getMessage()], 400);
        }
    }

    public function getUserById($id)
    {
        try {
            $user = User::findOrfail($id);

            return response()->json(["Message" => "Detail Pengguna", "user" => $user], 200);
        } catch (Exception $e) {
            return response()->json(["error" => $e->getMessage()], 400);
        }
    }

    public function updateUser(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $request->validate([
                "name" => "sometimes|required|string|max:255",
                "user_name" => "sometimes|required|string|unique:users",
                "phone" => ["sometimes", "required", "max:13", "unique:users", "regex:/^(\+62|62)?[\s-]?0?8[1-9]{1}\d{1}[\s-]?\d{4}[\s-]?\d{2,5}$/"],
            ]);

            $user->update([
                "name" => $request->name ?? $user->name,
                "user_name" => $request->user_name ?? $user->user_name,
                "phone" => $request->phone ?? $user->phone
            ]);

            return response()->json(["Message" => "Data user berhasil diupdate", "user" => $user], 200);

        } catch (Exception $e) {
            return response()->json(["Message" => "Update data user gagal", "error" => $e->getMessage()], 400);
        }
    }

    public function deleteUser($id)
    {
        try {
            $user = User::findOrFail($id);

            $user->delete();

            return response()->json(["Message" => "User berhasil dihapus"], 200);
        } catch (Exception $e) {
            return response()->json(["Message" => $e->getMessage()], 400);
        }
    }
}
