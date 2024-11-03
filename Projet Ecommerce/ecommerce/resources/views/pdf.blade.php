<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Votre Facture</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.5;
            background-color: #f2f2f2;
        }

        h1,
        h2,
        h3 {
            color: #333;
            margin-bottom: 10px;
        }

        main {
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th,
        td {
            padding: 10px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        .article_name {
            font-weight: bold;
        }

        tfoot th {
            text-align: right;
        }

        tfoot td {
            font-weight: bold;
        }

        .delivery-message {
            margin-top: 20px;
            font-style: italic;
        }
    </style>
</head>

<body>
    <h1 style="text-align: center;">Merci d'avoir commandé sur PexExpress {{ $user }}</h1>
    <h2>Récapitulatif de votre commande</h2>
    <main>
        <p>Numéro de commande: {{ $numero }}</p>
        <article>
            <h3>Adresse de Livraison :</h3>
            <p>{{ $user }}</p>
            <p>{{ $address }}</p>
            <p>{{ $city }}</p>
            <p>{{ $country }}</p>
        </article>
        <table>
            <thead>
                <tr>
                    <th>Nom de l'article</th>
                    <th>Prix</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($panier as $key => $value)
                <tr>
                    <td class="article_name">{{ $value['name'] }}</td>
                    <td>{{ number_format($value['price'] * ((100 - $value['reduction']) / 100), 2, '.', '') }} €</td>
                </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <th>Prix HT:</th>
                    <td>{{ number_format($prices['solo'], 2, '.', '') }}€</td>
                </tr>
                <tr>
                    <th>Frais de Port:</th>
                    <td>{{ number_format($prices['shippingRate'], 2, '.', '') }}€</td>
                </tr>
                <tr>
                    <th>Total:</th>
                    <td>{{ number_format($prices['totalPrice'], 2, '.', '') }}€</td>
                </tr>
            </tfoot>
        </table>
        <h3 class="delivery-message">Votre commande devrait arriver dans les 15 prochains jours, ouvrez l'œil !</h3>
    </main>
</body>

</html>