<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table("users")->insert([
             "name" => "maman",
            "user_name" => "admin001",
            "phone" => "0895634655946",
            "role" => "admin",
            "email" => "admin001@mail.com",
            "password" => Hash::make("Admin001"),
            "created_at" => now(),
            "updated_at" => now(),
        ]);
    }
}
