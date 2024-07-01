document.addEventListener("DOMContentLoaded", function () {
    const wolf = document.getElementById("wolf");
    const gameScreen = document.getElementById("game-screen");
    const deathModal = new bootstrap.Modal(document.getElementById("deathModal"), {
        keyboard: false,
    });
    const restartGameBtn = document.getElementById("restartGameBtn");

    // Initialisation des barres
    let health = 200;
    let food = 400;
    let poison = 0;
    let isWolfDead = false; // Ajout de la variable pour suivre l'état du loup

    const healthSpan = document.getElementById("health");
    const foodSpan = document.getElementById("food");
    const poisonSpan = document.getElementById("poison");

    // Suivi du temps de jeu et des événements
    let startTime = Date.now();
    let foodCount = 0;
    let poisonCount = 0;
    let healingCount = 0;

    // Chargement des images
    const wolfImg = "./assets/img/loup.webp"; // Image du loup
    const deadWolfImg = "./assets/img/loup mort.png"; // Image du loup mort
    const foodImages = [
        "./assets/img/nourriture/viande.png",
        "./assets/img/nourriture/poisson.png",
        "./assets/img/nourriture/champi.png",
    ]; // Images de nourriture
    const poisonImages = [
        "./assets/img/poison/champitoxique.png",
        "./assets/img/poison/viandepourri.png",
    ]; // Images de poison
    const healingImages = ["./assets/img/remede/plante.png", "./assets/img/remede/fiole.png"]; // Images de soins

    // Mise à jour des barres
    function updateStatusBars() {
        healthSpan.textContent = health;
        foodSpan.textContent = food;
        poisonSpan.textContent = poison;

        if (health <= 0) {
            gameOver();
        }
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

    wolf.src = wolfImg;
    wolf.style.position = "absolute";
    wolf.style.left = `${wolfX}px`;
    wolf.style.top = `${wolfY}px`;

    // Déplacement du loup avec les touches du clavier
    document.addEventListener("keydown", function (event) {
        if (!isWolfDead) {
            // Le loup ne peut se déplacer que s'il n'est pas mort
            const step = 30;
            switch (event.key) {
                case "ArrowUp":
                    wolfY = Math.max(wolfY - step, 0);
                    break;
                case "ArrowDown":
                    wolfY = Math.min(wolfY + step, gameScreenRect.height - wolf.offsetHeight);
                    break;
                case "ArrowLeft":
                    wolfX = Math.max(wolfX - step, 0);
                    break;
                case "ArrowRight":
                    wolfX = Math.min(wolfX + step, gameScreenRect.width - wolf.offsetWidth);
                    break;
            }
            wolf.style.left = `${wolfX}px`;
            wolf.style.top = `${wolfY}px`;
            // Écouter les clics sur les flèches de contrôle mobile
            document.getElementById("upArrow").addEventListener("click", function () {
                moveWolf("up");
            });
            document.getElementById("downArrow").addEventListener("click", function () {
                moveWolf("down");
            });
            document.getElementById("leftArrow").addEventListener("click", function () {
                moveWolf("left");
            });
            document.getElementById("rightArrow").addEventListener("click", function () {
                moveWolf("right");
            });
            // Détection des appareils mobiles
            if (/Mobi|Android/i.test(navigator.userAgent)) {
                document.getElementById("mobile-controls").style.display = "flex";
            } else {
                document.getElementById("mobile-controls").style.display = "none";
            }
            // Vérifier la collision avec la nourriture après chaque déplacement
            checkFoodCollision();

            // Faire diminuer la barre de nourriture à chaque mouvement du loup
            decreaseFood();

            // Vérifier si la barre de nourriture est inférieure à 50 et réduire la santé si nécessaire
            if (food < 50) {
                decreaseHealth(2); // Diminuer la santé de 2 points
            }

            // Vérifier si la barre de poison est supérieure à 50 et réduire la santé si nécessaire
            if (poison > 50) {
                decreaseHealth(10); // Diminuer la santé de 10 points
            }
        }
    });

    // Fonction pour faire diminuer la barre de nourriture
    function decreaseFood() {
        if (!isWolfDead) {
            // La nourriture diminue seulement si le loup est vivant
            food -= 1;
            if (food < 0) food = 0; // Limiter la nourriture à 0
            updateStatusBars(); // Mettre à jour visuellement la barre de nourriture

            // Faire baisser la santé lorsque la nourriture atteint 50
            if (food < 50) {
                decreaseHealth(2); // Diminuer la santé de 2 points
            }
        }
    }

    // Fonction pour faire diminuer la barre de santé
    function decreaseHealth(amount) {
        if (!isWolfDead) {
            // La santé diminue seulement si le loup est vivant
            health -= amount;
            if (health < 0) health = 0; // Limiter la santé à 0
            updateStatusBars(); // Mettre à jour visuellement la barre de santé

            // Vérifier si la santé du loup est épuisée
            if (health <= 0) {
                gameOver(); // Déclencher la fin de partie
            }
        }
    }

    // Fonction pour gérer la fin de partie
    function gameOver() {
        isWolfDead = true; // Le loup est maintenant mort
        const endTime = Date.now();
        const gameTime = Math.floor((endTime - startTime) / 1000);
        document.getElementById("gameTime").textContent = gameTime;
        document.getElementById("foodCount").textContent = foodCount;
        document.getElementById("poisonCount").textContent = poisonCount;
        document.getElementById("healingCount").textContent = healingCount;

        wolf.src = deadWolfImg; // Changer l'image du loup à l'image du loup mort

        deathModal.show(); // Afficher la modal de fin de partie
    }

    // Réinitialiser le jeu en fermant la modal
    restartGameBtn.addEventListener("click", function () {
        isWolfDead = false; // Réinitialiser le statut du loup
        health = 200;
        food = 400;
        poison = 0;
        foodCount = 0;
        poisonCount = 0;
        healingCount = 0;
        startTime = Date.now();

        wolf.src = wolfImg; // Réinitialiser l'image du loup

        updateStatusBars();
        deathModal.hide();
        location.reload(); // Recharger la page pour réinitialiser complètement le jeu
    });

    // Fonction utilitaire pour vérifier la collision entre deux éléments
    function isCollision(rect1, rect2) {
        return !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
        );
    }

    // Fonction pour détecter la collision entre le loup et la nourriture
    function checkFoodCollision() {
        const wolfRect = wolf.getBoundingClientRect();
        const foods = document.querySelectorAll(".food");

        foods.forEach((foodItem) => {
            const foodRect = foodItem.getBoundingClientRect();

            if (isCollision(wolfRect, foodRect)) {
                // Le loup a mangé la nourriture
                foodItem.remove(); // Supprimer l'élément visuel de nourriture

                // Augmenter la nourriture et la santé du loup
                food += 40;
                if (food > 400) food = 400; // Limiter la nourriture à 400

                health += 15;
                if (health > 200) health = 200; // Limiter la santé à 200

                foodCount++;

                // Mettre à jour visuellement les barres de nourriture et de santé
                updateStatusBars();

                console.log("Le loup a mangé de la nourriture. Nourriture actuelle : ", food);
            }
        });
    }

    // Générer de la nourriture de manière aléatoire avec des images différentes
    function generateFood() {
        const foodCount = document.querySelectorAll(".food").length;
        if (foodCount < 10) {
            const foodItem = document.createElement("img");
            foodItem.className = "food";
            foodItem.style.position = "absolute";
            foodItem.style.width = "70px";
            foodItem.style.height = "70px";
            foodItem.src = foodImages[Math.floor(Math.random() * foodImages.length)]; // Choisi une image aléatoire
            foodItem.style.top = `${Math.random() * (gameScreenRect.height - 50)}px`;
            foodItem.style.left = `${Math.random() * (gameScreenRect.width - 50)}px`;
            gameScreen.appendChild(foodItem);
        }
    }

    // Générer du poison de manière aléatoire avec une image fixe
    function generatePoison() {
        const poisonCount = document.querySelectorAll(".poison").length;
        if (poisonCount < 10) {
            const poisonItem = document.createElement("img");
            poisonItem.className = "poison";
            poisonItem.style.position = "absolute";
            poisonItem.style.width = "70px";
            poisonItem.style.height = "70px";
            poisonItem.src = poisonImages[Math.floor(Math.random() * poisonImages.length)]; // Choisi une image aléatoire
            poisonItem.style.top = `${Math.random() * (gameScreenRect.height - 50)}px`;
            poisonItem.style.left = `${Math.random() * (gameScreenRect.width - 50)}px`;
            gameScreen.appendChild(poisonItem);
        }
    }

    // Générer des soins de manière aléatoire avec des images différentes
    function generateHealing() {
        const healingCount = document.querySelectorAll(".healing").length;
        if (healingCount < 3) {
            const healingItem = document.createElement("img");
            healingItem.className = "healing";
            healingItem.style.position = "absolute";
            healingItem.style.width = "70px";
            healingItem.style.height = "70px";
            healingItem.src = healingImages[Math.floor(Math.random() * healingImages.length)]; // Choisir une image aléatoire
            healingItem.style.top = `${Math.random() * (gameScreenRect.height - 50)}px`;
            healingItem.style.left = `${Math.random() * (gameScreenRect.width - 50)}px`;
            gameScreen.appendChild(healingItem);
        }
    }

    // Fonction pour détecter la collision entre le loup et le poison
    function checkPoisonCollision() {
        const wolfRect = wolf.getBoundingClientRect();
        const poisons = document.querySelectorAll(".poison");

        poisons.forEach((poisonItem) => {
            const poisonRect = poisonItem.getBoundingClientRect();

            if (isCollision(wolfRect, poisonRect)) {
                // Le loup a touché du poison
                poisonItem.remove(); // Supprimer l'élément visuel de poison

                // Augmenter la barre de poison
                increasePoison(25);

                poisonCount++;

                updateStatusBars();

                console.log("Le loup a touché du poison. Empoisonnement actuel : ", poison);
            }
        });
    }

    // Fonction pour détecter la collision entre le loup et les soins
    function checkHealingCollision() {
        const wolfRect = wolf.getBoundingClientRect();
        const healings = document.querySelectorAll(".healing");

        healings.forEach((healingItem) => {
            const healingRect = healingItem.getBoundingClientRect();

            if (isCollision(wolfRect, healingRect)) {
                // Le loup a touché un soin
                healingItem.remove(); // Supprimer l'élément visuel de soin

                // Diminuer la barre de poison et augmenter la santé
                decreasePoison(25);
                health += 15;
                if (health > 200) health = 200; // Limiter la santé à 200

                healingCount++;

                updateStatusBars();

                console.log(
                    "Le loup a touché un soin. Santé actuelle : ",
                    health,
                    " Empoisonnement actuel : ",
                    poison
                );
            }
        });
    }

    // Générer de la nourriture, de poison et des soins de manière périodique
    setInterval(generateFood, 3000); // Générer de la nourriture toutes les 3 secondes
    setInterval(generatePoison, 1000); // Générer du poison toutes les 1 seconde
    setInterval(generateHealing, 7000); // Générer des soins toutes les 7 secondes

    // Vérifier les collisions de poison et de soins
    setInterval(checkPoisonCollision, 100); // Vérifier les collisions de poison toutes les 100ms
    setInterval(checkHealingCollision, 100); // Vérifier les collisions de soins toutes les 100ms
});
