<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $order->order_number }}</title>
    <style>
        body { font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 0; }
        .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); font-size: 16px; line-height: 24px; }
        .invoice-box table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; }
        .invoice-box table td { padding: 5px; vertical-align: top; }
        .invoice-box table tr td:nth-child(n+2) { text-align: right; }
        .invoice-box table tr.top table td { padding-bottom: 20px; }
        .invoice-box table tr.top table td.title { font-size: 45px; line-height: 45px; color: #333; }
        .invoice-box table tr.information table td { padding-bottom: 40px; }
        .invoice-box table tr.heading td { background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; }
        .invoice-box table tr.details td { padding-bottom: 20px; }
        .invoice-box table tr.item td { border-bottom: 1px solid #eee; }
        .invoice-box table tr.item.last td { border-bottom: none; }
        .invoice-box table tr.total td:nth-child(4) { border-top: 2px solid #eee; font-weight: bold; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .store-title { font-size: 24px; font-weight: bold; color: #6D28D9; }
        .footer { margin-top: 50px; text-align: center; color: #777; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="invoice-box">
        <table cellpadding="0" cellspacing="0">
            <tr class="top">
                <td colspan="4">
                    <table>
                        <tr>
                            <td class="title">
                                <div class="store-title">{{ $settings['store_name'] ?? 'Antigravity POS' }}</div>
                            </td>
                            <td>
                                Invoice #: {{ $order->order_number }}<br>
                                Created: {{ $order->created_at->format('M d, Y h:i A') }}<br>
                                Status: {{ $order->status }}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr class="information">
                <td colspan="4">
                    <table>
                        <tr>
                            <td>
                                {{ $settings['store_address'] ?? '123 Business Road' }}<br>
                                Phone: {{ $settings['store_phone'] ?? 'N/A' }}<br>
                                Email: {{ $settings['store_email'] ?? 'N/A' }}
                            </td>
                            <td>
                                <strong>Customer:</strong><br>
                                {{ $order->customer->name ?? 'Walk-in Customer' }}<br>
                                {{ $order->customer->phone ?? '' }}<br>
                                {{ $order->customer->email ?? '' }}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr class="heading">
                <td>Item</td>
                <td>Price</td>
                <td>Quantity</td>
                <td>Total</td>
            </tr>

            @php $subtotal = 0; $currency = $settings['currency_symbol'] ?? '$'; @endphp
            @foreach($order->items as $item)
            @php $lineTotal = $item['price'] * $item['quantity']; $subtotal += $lineTotal; @endphp
            <tr class="item {{ $loop->last ? 'last' : '' }}">
                <td>{{ $item['name'] ?? 'Product' }}</td>
                <td>{{ $currency }}{{ number_format($item['price'], 2) }}</td>
                <td>{{ $item['quantity'] }}</td>
                <td>{{ $currency }}{{ number_format($lineTotal, 2) }}</td>
            </tr>
            @endforeach

            @php 
                $taxRate = $settings['tax_rate'] ?? 0;
                $taxAmount = $subtotal * ($taxRate / 100);
            @endphp

            @if($taxRate > 0)
            <tr class="total">
                <td></td>
                <td></td>
                <td>Subtotal:</td>
                <td>{{ $currency }}{{ number_format($subtotal, 2) }}</td>
            </tr>
            <tr class="total">
                <td></td>
                <td></td>
                <td>Tax ({{ $taxRate }}%):</td>
                <td>{{ $currency }}{{ number_format($taxAmount, 2) }}</td>
            </tr>
            @endif

            <tr class="total">
                <td></td>
                <td></td>
                <td>Total Amount:</td>
                <td>{{ $currency }}{{ number_format($order->total_amount, 2) }}</td>
            </tr>
        </table>
        
        <div class="footer">
            Thank you for your business!<br>
            {{ $settings['store_name'] ?? 'Antigravity POS' }}
        </div>
    </div>
</body>
</html>
