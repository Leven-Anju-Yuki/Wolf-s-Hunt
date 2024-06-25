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

    // Diminuer la nourriture de 1 en 1 lors du déplacement du loup
    function decreaseFood() {
        food = Math.max(food - 1, 0);
        if (food < 50) {
            health = Math.max(health - 5, 0);
        }
        updateStatusBars();

        if (health === 0) {
            // Afficher la modal de mort du loup
            $('#deathModal').modal('show');
        }
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

        // Appel à la fonction pour diminuer la nourriture à chaque déplacement du loup
        decreaseFood();
    });

    // Mettre à jour les dimensions de l'écran de jeu lors du redimensionnement de la fenêtre
    window.addEventListener('resize', function () {
        gameScreenRect = gameScreen.getBoundingClientRect();

        // Recentrer le loup après redimensionnement
        wolfX = Math.min(wolfX, gameScreenRect.width - wolf.offsetWidth);
        wolfY = Math.min(wolfY, gameScreenRect.height - wolf.offsetHeight);
        wolf.style.left = `${wolfX}px`;
        wolf.style.top = `${wolfY}px`;
    });

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

    // Vérifier la collision entre le loup et un élément de nourriture
    function isCollision(wolf, food) {
        const wolfRect = wolf.getBoundingClientRect();
        const foodRect = food.getBoundingClientRect();

        return !(
            wolfRect.top > foodRect.bottom ||
            wolfRect.bottom < foodRect.top ||
            wolfRect.left > foodRect.right ||
            wolfRect.right < foodRect.left
        );
    }

    // Recharger le jeu lorsque la modal de mort du loup est fermée
    $('#deathModal').on('hidden.bs.modal', function () {
        // Réinitialiser les variables de jeu
        health = 100;
        food = 100;
        poison = 0;
        updateStatusBars();

        // Réinitialiser la position du loup
        wolfX = gameScreenRect.width / 2 - wolf.offsetWidth / 2;
        wolfY = gameScreenRect.height / 2 - wolf.offsetHeight / 2;
        wolf.style.left = `${wolfX}px`;
        wolf.style.top = `${wolfY}px`;

        // Supprimer tous les éléments de nourriture
        const foods = document.querySelectorAll('.food');
        foods.forEach(food => food.remove());

        // Redémarrer la génération de nourriture
        generateFood();
    });

    // Redémarrer le jeu en cliquant sur le bouton "Recommencer"
    document.getElementById('restartGameBtn').addEventListener('click', function () {
        $('#deathModal').modal('hide');
    });

});
