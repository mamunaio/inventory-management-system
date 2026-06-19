<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Receipt {{ $order->order_number }}</title>
    <style>
        @page { margin: 0; }
        body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
            width: 80mm;
            margin: 0 auto;
            padding: 5mm;
            color: #000;
            background: #fff;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .font-bold { font-weight: bold; }
        .mb-1 { margin-bottom: 2mm; }
        .mb-2 { margin-bottom: 4mm; }
        .mb-4 { margin-bottom: 8mm; }
        .divider { border-top: 1px dashed #000; margin: 2mm 0; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 1mm 0; vertical-align: top; }
        .header-store { font-size: 16px; font-weight: bold; text-transform: uppercase; }
        .btn-print {
            display: block;
            width: 100%;
            padding: 10px;
            margin-top: 20px;
            background: #38BDF8;
            color: white;
            text-align: center;
            text-decoration: none;
            font-family: sans-serif;
            border-radius: 5px;
            border: none;
            cursor: pointer;
        }
        @media print {
            .no-print { display: none; }
            body { padding: 0; }
        }
    </style>
</head>
<body onload="window.print()">

    <div class="text-center mb-2">
        <div class="header-store">{{ $settings['store_name'] ?? 'Antigravity POS' }}</div>
        <div>{{ $settings['store_address'] ?? '123 Tech Street, Silicon Valley' }}</div>
        <div>Phone: {{ $settings['store_phone'] ?? '+1 234 567 890' }}</div>
    </div>

    <div class="divider"></div>

    <div class="mb-2">
        <div><span class="font-bold">Receipt:</span> {{ $order->order_number }}</div>
        <div><span class="font-bold">Date:</span> {{ $order->created_at->format('d M Y h:i A') }}</div>
        <div><span class="font-bold">Customer:</span> {{ $order->customer ? $order->customer->name : 'Walk-in Customer' }}</div>
        <div><span class="font-bold">Cashier:</span> {{ auth()->user()->name ?? 'Staff' }}</div>
    </div>

    <div class="divider"></div>

    <table class="mb-2">
        <thead>
            <tr class="font-bold">
                <th class="text-left">Item</th>
                <th class="text-center">Qty</th>
                <th class="text-right">Price</th>
                <th class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
            <tr>
                <td class="text-left" style="width: 45%;">{{ $item['name'] }}</td>
                <td class="text-center" style="width: 15%;">{{ $item['quantity'] }}</td>
                <td class="text-right" style="width: 20%;">${{ number_format($item['price'], 2) }}</td>
                <td class="text-right" style="width: 20%;">${{ number_format($item['price'] * $item['quantity'], 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="divider"></div>

    <table class="mb-2 font-bold" style="font-size: 14px;">
        <tr>
            <td class="text-left">TOTAL</td>
            <td class="text-right">${{ number_format($order->total_amount, 2) }}</td>
        </tr>
    </table>

    <div class="divider"></div>

    <div class="text-center mb-4">
        <div>Thank you for your purchase!</div>
        <div>Please visit again.</div>
    </div>

    <button class="btn-print no-print" onclick="window.print()">Print Receipt</button>

</body>
</html>
