<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Votre Email</title>
</head>

<body>
    <h1>Merci d'avoir commandé sur PexExpress {{$data['user']}}</h1>
    <h2>Récapitulatif de votre commande</h2>
    <main>
        <p>Numéro de commande: {{$data['numero']}}</p>
        <article>
            <h3>Adresse de Livraison :</h3>
            {{$data['user']}}<br />
            {{$data['address']}}<br />
            {{$data['city']}}<br />
            {{$data['country']}}
        </article>
        <h3>Votre facture est disponible dans votre espace client !</h3>
        <h4>Votre commande devrait arriver dans les 15 prochains jours, ouvrez l'oeil!</h4>
    </main>
</body>

</html>