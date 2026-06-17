<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice - {{ $order->order_number }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            color: #333;
            font-size: 14px;
            line-height: 1.6;
        }
        .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
        }
        table {
            width: 100%;
            line-height: inherit;
            text-align: left;
            border-collapse: collapse;
        }
        .header-table td {
            padding-bottom: 20px;
        }
        .title {
            font-size: 45px;
            line-height: 45px;
            color: #111;
            font-weight: bold;
        }
        .company-details {
            text-align: right;
            color: #555;
        }
        .customer-info {
            margin-top: 20px;
            margin-bottom: 40px;
        }
        .items-table {
            margin-top: 20px;
        }
        .items-table th {
            background: #eee;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
            padding: 10px;
        }
        .items-table td {
            border-bottom: 1px solid #eee;
            padding: 10px;
        }
        .items-table td.right, .items-table th.right {
            text-align: right;
        }
        .total-row td {
            border-top: 2px solid #333;
            font-weight: bold;
            font-size: 16px;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            color: #777;
            font-size: 12px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            background: #eee;
            color: #333;
        }
        .badge.completed { background: #d4edda; color: #155724; }
        .badge.pending { background: #fff3cd; color: #856404; }
        .badge.cancelled { background: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <div class="invoice-box">
        <table class="header-table">
            <tr>
                <td class="title">
                    INVOICE
                </td>
                <td class="company-details">
                    <strong>Injaazh Enterprise</strong><br>
                    123 Business Avenue<br>
                    Dhaka, Bangladesh<br>
                    contact@injaazh.com
                </td>
            </tr>
        </table>

        <table class="customer-info">
            <tr>
                <td>
                    <strong>Billed To:</strong><br>
                    {{ $order->customer->name ?? 'Walk-in Customer' }}<br>
                    {{ $order->customer->email ?? '' }}<br>
                    {{ $order->customer->phone ?? '' }}<br>
                    {{ $order->customer->address ?? '' }}
                </td>
                <td style="text-align: right;">
                    <strong>Invoice #:</strong> {{ $order->order_number }}<br>
                    <strong>Created:</strong> {{ \Carbon\Carbon::parse($order->created_at)->format('F d, Y') }}<br>
                    <strong>Status:</strong> <span class="badge {{ strtolower($order->status) }}">{{ $order->status }}</span>
                </td>
            </tr>
        </table>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Item Description</th>
                    <th class="right">Price</th>
                    <th class="right">Qty</th>
                    <th class="right">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td>{{ $item['name'] }}</td>
                    <td class="right">${{ number_format($item['price'], 2) }}</td>
                    <td class="right">{{ $item['quantity'] }}</td>
                    <td class="right">${{ number_format($item['price'] * $item['quantity'], 2) }}</td>
                </tr>
                @endforeach
                
                <tr>
                    <td colspan="3" class="right" style="padding-top: 20px;"><strong>Subtotal:</strong></td>
                    <td class="right" style="padding-top: 20px;">${{ number_format($order->total_amount, 2) }}</td>
                </tr>
                <tr class="total-row">
                    <td colspan="3" class="right">Grand Total:</td>
                    <td class="right">${{ number_format($order->total_amount, 2) }}</td>
                </tr>
            </tbody>
        </table>

        <div class="footer">
            Thank you for your business!<br>
            If you have any questions about this invoice, please contact us.
        </div>
    </div>
</body>
</html>
