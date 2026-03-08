<?php

namespace App\Http\Controllers;

use App\Models\Tarot;
use Illuminate\Http\Request;

class TarotController extends Controller
{
    public function index(Request $request)
    {
        $query = Tarot::query();

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $tarots = $query->orderBy('number')->get();

        return response()->json($tarots);
    }

    public function show(int $id)
    {
        $tarot = Tarot::findOrFail($id);

        return response()->json($tarot);
    }
}
