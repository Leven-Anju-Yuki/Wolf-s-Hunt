document.addEventListener('DOMContentLoaded', function () {
    const wolf = document.getElementById('wolf');
    const gameScreen = document.getElementById('game-screen');

    // Initialisation des barres
    let health = 100;
    let food = 100;
    let poison = 0;

    const healthSpan = document.getElementById('health');
    const foodSpan = document.getElementById('food');
    const poisonSpan = document.getElementById('poison');

    // Mise à jour des barres
    function updateStatusBars() {
        healthSpan.textContent = health;
        foodSpan.textContent = food;
        poisonSpan.textContent = poison;
    }

    // Exemple de mise à jour de la barre d'empoisonnement
    function increasePoison(amount) {
        poison += amount;
        if (poison > 100) poison = 100;
        updateStatusBars();
    }

    function decreasePoison(amount) {
        poison -= amount;
        if (poison < 0) poison = 0;
        updateStatusBars();
    }

    // Appeler cette fonction pour mettre à jour les barres au démarrage
    updateStatusBars();

    // Position initiale du loup (centre de l'écran)
    let gameScreenRect = gameScreen.getBoundingClientRect();
    let wolfX = gameScreenRect.width / 2 - wolf.offsetWidth / 2;
    let wolfY = gameScreenRect.height / 2 - wolf.offsetHeight / 2;

    wolf.style.left = `${wolfX}px`;
    wolf.style.top = `${wolfY}px`;

    // Fonction pour détecter la collision entre le loup et la nourriture
    function checkFoodCollision() {
        const wolfRect = wolf.getBoundingClientRect();
        const foods = document.querySelectorAll('.food');

        foods.forEach(food => {
            const foodRect = food.getBoundingClientRect();

            if (isCollision(wolfRect, foodRect)) {
                // Le loup a mangé la nourriture
                food.remove(); // Supprimer l'élément visuel de nourriture
                food.style.top = '-100px'; // Déplacer la nourriture hors de l'écran (optionnel)
                food.style.left = '-100px'; // Déplacer la nourriture hors de l'écran (optionnel)

                // Augmenter la nourriture et la santé du loup
                food += 10;
                if (food > 100) food = 100; // Limiter la nourriture à 100

                health += 10;
                if (health > 100) health = 100; // Limiter la santé à 100

                // Mettre à jour visuellement les barres de nourriture et de santé
                updateStatusBars();

                console.log('Le loup a mangé de la nourriture. Nourriture actuelle : ', food);
            }
        });
    }

    // Déplacement du loup avec les touches du clavier
    document.addEventListener('keydown', function (event) {
        const step = 10;
        switch (event.key) {
            case 'ArrowUp':
                wolfY = Math.max(wolfY - step, 0);
                break;
            case 'ArrowDown':
                wolfY = Math.min(wolfY + step, gameScreenRect.height - wolf.offsetHeight);
                break;
            case 'ArrowLeft':
                wolfX = Math.max(wolfX - step, 0);
                break;
            case 'ArrowRight':
                wolfX = Math.min(wolfX + step, gameScreenRect.width - wolf.offsetWidth);
                break;
        }
        wolf.style.left = `${wolfX}px`;
        wolf.style.top = `${wolfY}px`;

        // Faire diminuer la barre de nourriture à chaque mouvement du loup
        decreaseFood();
        
        // Vérifier la collision avec la nourriture après chaque déplacement
        checkFoodCollision();

        // Vérifier si la barre de nourriture est inférieure à 50 et réduire la santé si nécessaire
        if (food < 50) {
            decreaseHealth(5); // Diminuer la santé de 5 points
        }

        // Vérifier si la santé du loup est épuisée
        if (health <= 0) {
            gameOver(); // Déclencher la fin de partie
        }
    });

    // Fonction pour faire diminuer la barre de nourriture
    function decreaseFood() {
        food -= 1;
        if (food < 0) food = 0; // Limiter la nourriture à 0
        updateStatusBars(); // Mettre à jour visuellement la barre de nourriture

        // Faire baisser la santé lorsque la nourriture atteint 50
        if (food < 50) {
            decreaseHealth(5); // Diminuer la santé de 5 points
        }
    }

    // Fonction pour faire diminuer la barre de santé
    function decreaseHealth(amount) {
        health -= amount;
        if (health < 0) health = 0; // Limiter la santé à 0
        updateStatusBars(); // Mettre à jour visuellement la barre de santé

        // Vérifier si la santé du loup est épuisée
        if (health <= 0) {
            gameOver(); // Déclencher la fin de partie
        }
    }

    // Fonction pour gérer la fin de partie
    function gameOver() {
        // Afficher une modal ou un message indiquant que le loup est mort
        alert("Le loup est mort !");

        // Réinitialiser le jeu en rechargeant la page
        location.reload();
    }

    // Fonction utilitaire pour vérifier la collision entre deux éléments
    function isCollision(rect1, rect2) {
        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    }

    // Générer de la nourriture de manière aléatoire
    function generateFood() {
        const foodCount = document.querySelectorAll('.food').length;
        if (foodCount < 6) {
            const food = document.createElement('div');
            food.className = 'food';
            food.style.position = 'absolute';
            food.style.width = '50px';
            food.style.height = '50px';
            food.style.backgroundColor = 'green'; // Exemple de style, vous pouvez ajouter une image ici
            food.style.top = `${Math.random() * (gameScreenRect.height - 50)}px`;
            food.style.left = `${Math.random() * (gameScreenRect.width - 50)}px`;
            gameScreen.appendChild(food);
        }
    }

    setInterval(generateFood, 3000); // Générer de la nourriture toutes les 3 secondes
});
