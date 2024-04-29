<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [HomeController::class, 'home'])->name('dashboard');

    Route::get('/user/{userId}', function () {

    })->name('chat.user');

    Route::get('/group/{groupId}', function () {

    })->name('chat.group');

    Route::get('/conversation/{conversationId}', function () {

    })->name('chat.conversation');

    Route::get('/settings', function () {

    })->name('settings');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
