<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
Route::get('/', function () {
    return view('welcome');
});

Auth::routes(['verify' => true]);

Route::get('profile', [App\Http\Controllers\ProfileController::class, 'index'])->name('profile')->middleware('verified');

Route::post('/profile/update',[App\Http\Controllers\ProfileController::class,'update'])->name('profile.update');

Route::get('/annonce/add',[App\Http\Controllers\AnnoncesController::class,'index'])->name('annonce.add');

Route::post('/annonce/add/active',[App\Http\Controllers\AnnoncesController::class,'add']);

Route::get('/annonce/modify/{id}', [App\Http\Controllers\AnnoncesController::class, 'update']);

Route::get('/annonce/delete/{id}', [App\Http\Controllers\AnnoncesController::class, 'delete']);

Route::get('home/images/{id}', [App\Http\Controllers\HomeController::class, 'getImages']);

Route::post('/home/search/', [App\Http\Controllers\HomeController::class, 'search']);

Route::get('/message', [App\Http\Controllers\MessageController::class, 'index'])->name('messagerie');

Route::get('/message/{id}', [App\Http\Controllers\MessageController::class, 'send']);

Route::get('/message/get/{id}', [App\Http\Controllers\MessageController::class, 'get']);

Route::post('/message/post', [App\Http\Controllers\MessageController::class, 'postMessage']);

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home')->middleware('verified');