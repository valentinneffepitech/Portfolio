#!/bin/bash

# Installer les dépendances PHP avec Composer
echo "Installation des dépendances PHP..."
cd ecommerce
composer install
php artisan migrate
cd..

# Installer les dépendances JavaScript avec npm
echo "Installation des dépendances JavaScript..."
cd frontend
npm install
cd ..

echo "Création de la base de données"
php ecommerce/artisan migrate

echo "Installation terminée."