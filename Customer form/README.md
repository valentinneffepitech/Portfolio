Objectifs: 

- Créer un formulaire d'inscription avec de l'AJAX afin d'éviter les rafraichissement de page.

Lancer le projet:
- Tout d'abord importer la base de données depuis customer_form.sql
-> mysql -u 'username' -p 'database_name' < customer_form.sql
- Commencer par "cd customer_form" puis "npm install" afin d'installer React et la librairie Lucide
- Aller dans le dossier backend et créer un fichier .env 
-> Il doit contenir les variables suivantes:
DBUSER: nom d'utilisateur de la base de données
DBPASS: mot de passe de l'utilisateur
DBNAME: nom de la base de données
DBHOST: l'adresse ou est située la base de donnée (par exemple: 127.0.0.1 ou localhost)

Technologies et compétences utilisées:

- ReactJS (Pour plus rapidement gérer la génération des inputs et les données récupérer du PHP)
-> Pour le lancer "cd customer_form" puis "npm run dev"

-Lucide : librairie JS qui permet de générer des icones

-PHP : Réaliser les calls à la base de données et traiter les requêtes recues
->"cd backend"
->lancer php avec "php -S localhost:3001"

=>les calls seront dirigés vers cette adresse