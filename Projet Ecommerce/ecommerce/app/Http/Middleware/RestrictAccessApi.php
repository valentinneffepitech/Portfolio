<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RestrictAccessApi
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $allowedOrigin = 'http://localhost:3000';

        if ($request->header('Origin') === $allowedOrigin) {
            return $next($request);
        }

        abort(403, 'Forbidden - Access restricted to localhost:3000 only.');
    }
}
