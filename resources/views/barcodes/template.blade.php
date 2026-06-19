<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Barcode - {{ $product->name }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .page {
            width: 100%;
            padding: 10px;
        }
        .barcode-container {
            width: 30%;
            float: left;
            margin: 1%;
            padding: 10px;
            text-align: center;
            border: 1px dashed #ccc;
            box-sizing: border-box;
            height: 120px;
            page-break-inside: avoid;
        }
        .product-name {
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .product-price {
            font-size: 10px;
            margin-bottom: 5px;
        }
        .barcode-image {
            margin: 0 auto;
        }
        .barcode-image img {
            width: 90%;
            height: 40px;
        }
        .barcode-number {
            font-size: 9px;
            letter-spacing: 2px;
            margin-top: 2px;
        }
        /* Clearfix */
        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }
    </style>
</head>
<body>
    <div class="page clearfix">
        @for($i = 0; $i < $count; $i++)
            <div class="barcode-container">
                <div class="product-name">{{ Str::limit($product->name, 20) }}</div>
                <div class="product-price">${{ number_format($product->price, 2) }}</div>
                <div class="barcode-image">
                    {!! \Milon\Barcode\Facades\DNS1DFacade::getBarcodeHTML($product->barcode ?? $product->sku, 'C128', 1.5, 40) !!}
                </div>
                <div class="barcode-number">{{ $product->barcode ?? $product->sku }}</div>
            </div>
        @endfor
    </div>
</body>
</html>
