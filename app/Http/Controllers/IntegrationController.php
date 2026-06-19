<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Integration;
use App\Services\ActivityLogService;

class IntegrationController extends Controller
{
    public function index()
    {
        $integrations = Integration::all();
        
        return Inertia::render('Integrations/Index', [
            'integrations' => $integrations
        ]);
    }

    public function storeOrUpdate(Request $request)
    {
        $validated = $request->validate([
            'platform' => 'required|string',
            'api_key' => 'required|string',
            'store_url' => 'required|string',
            'auto_sync' => 'required|boolean'
        ]);

        $integration = Integration::where('platform', $validated['platform'])->first();

        if ($integration) {
            $integration->update($validated);
            ActivityLogService::log('integration_updated', "Updated integration settings for {$validated['platform']}");
            return back()->with('success', 'Integration updated successfully.');
        } else {
            Integration::create($validated);
            ActivityLogService::log('integration_created', "Created new integration for {$validated['platform']}");
            return back()->with('success', 'Integration connected successfully.');
        }
    }

    public function destroy($id)
    {
        $integration = Integration::findOrFail($id);
        $platform = $integration->platform;
        $integration->delete();
        
        ActivityLogService::log('integration_deleted', "Disconnected integration for {$platform}");
        return back()->with('success', 'Integration disconnected.');
    }
}
