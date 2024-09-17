document.addEventListener("DOMContentLoaded", function () {
    const wolf = document.getElementById("wolf");
    const gameScreen = document.getElementById("game-screen");
    const deathModal = new bootstrap.Modal(document.getElementById("deathModal"), {
        keyboard: false,
    });
    const restartGameBtn = document.getElementById("restartGameBtn");

    let health = 200;
    let food = 400;
    let poison = 0;
    let isWolfDead = false;

    const healthSpan = document.getElementById("health");
    const foodSpan = document.getElementById("food");
    const poisonSpan = document.getElementById("poison");

    let startTime = Date.now();
    let foodCount = 0;
    let poisonCount = 0;
    let healingCount = 0;

    const wolfImg = "./assets/img/loup.webp";
    const deadWolfImg = "./assets/img/loup mort.png";
    const bearImg = "./assets/img/ours.png";

    const foodImages = [
        "./assets/img/nourriture/viande.png",
        "./assets/img/nourriture/poisson.png",
        "./assets/img/nourriture/champi.png",
    ];
    const poisonImages = [
        "./assets/img/poison/champitoxique.png",
        "./assets/img/poison/viandepourri.png",
    ];
    const healingImages = [
        "./assets/img/remede/plante.png",
        "./assets/img/remede/fiole.png",
    ];

    // Fonction pour mettre à jour les barres de statut (santé, nourriture, poison)
    function updateStatusBars() {
        healthSpan.textContent = health;
        foodSpan.textContent = food;
        poisonSpan.textContent = poison;

        // Si la santé tombe à 0, le jeu est fini
        if (health <= 0) {
            gameOver();
        }
    }

    updateStatusBars();

    // Détermination de la taille pour PC et mobile
    const isMobile = /Mobi|Android|iPad|Tablet/i.test(navigator.userAgent);
    const wolfSize = isMobile ? 70 : 100;
    const bearSize = isMobile ? 80 : 120;
    const bearSpeed = isMobile ? 80 : 150; // Vitesse plus rapide pour l'ours sur mobile

    // Initialisation du loup
    let gameScreenRect = gameScreen.getBoundingClientRect();
    let wolfX = gameScreenRect.width / 2 - wolfSize / 2;
    let wolfY = gameScreenRect.height / 2 - wolfSize / 2;

    wolf.src = wolfImg;
    wolf.style.position = "absolute";
    wolf.style.width = `${wolfSize}px`;
    wolf.style.height = `${wolfSize}px`;
    wolf.style.left = `${wolfX}px`;
    wolf.style.top = `${wolfY}px`;

    // Déplacement du loup avec les touches fléchées
    document.addEventListener("keydown", function (event) {
        if (!isWolfDead) {
            const step = 30;
            switch (event.key) {
                case "ArrowUp":
                    wolfY = Math.max(wolfY - step, 0);
                    break;
                case "ArrowDown":
                    wolfY = Math.min(wolfY + step, gameScreenRect.height - wolfSize);
                    break;
                case "ArrowLeft":
                    wolfX = Math.max(wolfX - step, 0);
                    break;
                case "ArrowRight":
                    wolfX = Math.min(wolfX + step, gameScreenRect.width - wolfSize);
                    break;
            }
            wolf.style.left = `${wolfX}px`;
            wolf.style.top = `${wolfY}px`;
            checkFoodCollision();
            decreaseFood();

            if (food < 50) {
                decreaseHealth(2); // Le loup perd de la santé si la nourriture est trop basse
            }

            if (poison > 50) {
                decreaseHealth(10); // Le loup perd plus de santé si le poison est trop élevé
            }
        }
    });

    // Réduit la nourriture et met à jour les barres de statut
    function decreaseFood() {
        if (!isWolfDead) {
            food -= 1;
            if (food < 0) food = 0;
            updateStatusBars();
            if (food < 50) {
                decreaseHealth(2);
            }
        }
    }

    // Réduit la santé et met à jour les barres de statut
    function decreaseHealth(amount) {
        if (!isWolfDead) {
            health -= amount;
            if (health < 0) health = 0;
            updateStatusBars();
            if (health <= 0) {
                gameOver();
            }
        }
    }

    // Fonction pour afficher le modal de fin de jeu
    function gameOver() {
        isWolfDead = true;
        const endTime = Date.now();
        const gameTime = Math.floor((endTime - startTime) / 1000);
        document.getElementById("gameTime").textContent = gameTime;
        document.getElementById("foodCount").textContent = foodCount;
        document.getElementById("poisonCount").textContent = poisonCount;
        document.getElementById("healingCount").textContent = healingCount;

        wolf.src = deadWolfImg;
        deathModal.show();
    }

    // Redémarre le jeu en réinitialisant les variables
    restartGameBtn.addEventListener("click", function () {
        isWolfDead = false;
        health = 200;
        food = 400;
        poison = 0;
        foodCount = 0;
        poisonCount = 0;
        healingCount = 0;
        startTime = Date.now();

        wolf.src = wolfImg;
        updateStatusBars();
        deathModal.hide();
        location.reload(); // Recharger la page pour réinitialiser le jeu
    });

    // Fonction pour vérifier si deux éléments se touchent
    function isCollision(rect1, rect2) {
        return !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
        );
    }

    // Vérifie les collisions entre le loup et la nourriture
    function checkFoodCollision() {
        const wolfRect = wolf.getBoundingClientRect();
        const foods = document.querySelectorAll(".food");

        foods.forEach((foodItem) => {
            const foodRect = foodItem.getBoundingClientRect();

            if (isCollision(wolfRect, foodRect)) {
                foodItem.remove();
                food += 40;
                if (food > 400) food = 400;
                health += 15;
                if (health > 200) health = 200;
                foodCount++;
                console.log("Le loup a mangé de la nourriture.");
                updateStatusBars();
            }
        });
    }

    // Génère des éléments de nourriture, poison et soins
    function generateFood(maxFood) {
        const foodCount = document.querySelectorAll(".food").length;
        if (foodCount < maxFood) {
            const foodItem = document.createElement("img");
            foodItem.className = "food";
            foodItem.style.position = "absolute";
            foodItem.style.width = `70px`;
            foodItem.style.height = `70px`;
            foodItem.src = foodImages[Math.floor(Math.random() * foodImages.length)];
            foodItem.style.top = `${Math.random() * (gameScreenRect.height - wolfSize)}px`;
            foodItem.style.left = `${Math.random() * (gameScreenRect.width - wolfSize)}px`;
            gameScreen.appendChild(foodItem);
        }
    }

    function generatePoison(maxPoison) {
        const poisonCount = document.querySelectorAll(".poison").length;
        if (poisonCount < maxPoison) {
            const poisonItem = document.createElement("img");
            poisonItem.className = "poison";
            poisonItem.style.position = "absolute";
            poisonItem.style.width = `70px`;
            poisonItem.style.height = `70px`;
            poisonItem.src = poisonImages[Math.floor(Math.random() * poisonImages.length)];
            poisonItem.style.top = `${Math.random() * (gameScreenRect.height - wolfSize)}px`;
            poisonItem.style.left = `${Math.random() * (gameScreenRect.width - wolfSize)}px`;
            gameScreen.appendChild(poisonItem);
        }
    }

    function generateHealing(maxHealing) {
        const healingCount = document.querySelectorAll(".healing").length;
        if (healingCount < maxHealing) {
            const healingItem = document.createElement("img");
            healingItem.className = "healing";
            healingItem.style.position = "absolute";
            healingItem.style.width = `70px`;
            healingItem.style.height = `70px`;
            healingItem.src = healingImages[Math.floor(Math.random() * healingImages.length)];
            healingItem.style.top = `${Math.random() * (gameScreenRect.height - wolfSize)}px`;
            healingItem.style.left = `${Math.random() * (gameScreenRect.width - wolfSize)}px`;
            gameScreen.appendChild(healingItem);
        }
    }

    // Fonction pour vérifier les collisions de poison et de soins
    function checkPoisonCollision() {
        const wolfRect = wolf.getBoundingClientRect();
        const poisons = document.querySelectorAll(".poison");

        poisons.forEach((poisonItem) => {
            const poisonRect = poisonItem.getBoundingClientRect();

            if (isCollision(wolfRect, poisonRect)) {
                poisonItem.remove();
                increasePoison(25);
                poisonCount++;
                console.log("Le loup a mangé du poison.");
                updateStatusBars();
            }
        });
    }

    function checkHealingCollision() {
        const wolfRect = wolf.getBoundingClientRect();
        const healings = document.querySelectorAll(".healing");

        healings.forEach((healingItem) => {
            const healingRect = healingItem.getBoundingClientRect();

            if (isCollision(wolfRect, healingRect)) {
                healingItem.remove();
                decreasePoison(20);
                healingCount++;
                console.log("Le loup a utilisé des soins.");
                updateStatusBars();
            }
        });
    }

    // Ajoute de la génération et des vérifications à intervalle régulier
    setInterval(() => {
        generateFood(8); // 10 nourritures max
        generatePoison(10); // 10 poisons max
        generateHealing(5); // 5 soins max
        checkPoisonCollision();
        checkHealingCollision();
    }, 1000);

    // Mécanique du poison
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

    // Déplacement et interactions de l'ours
    const bear = document.createElement("img");
    bear.id = "bear";
    bear.src = bearImg;
    gameScreen.appendChild(bear);

    let bearX = Math.random() * (gameScreen.offsetWidth - bearSize);
    let bearY = Math.random() * (gameScreen.offsetHeight - bearSize);
    const bearStep = bearSpeed; // Vitesse de déplacement de l'ours

    bear.style.position = "absolute";
    bear.style.width = `${bearSize}px`;
    bear.style.height = `${bearSize}px`;
    bear.style.left = `${bearX}px`;
    bear.style.top = `${bearY}px`;

    // Déplace l'ours dans une direction aléatoire
    function moveBear() {
        const directions = ["up", "down", "left", "right"];
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];

        switch (randomDirection) {
            case "up":
                bearY = Math.max(bearY - bearStep, 0);
                break;
            case "down":
                bearY = Math.min(bearY + bearStep, gameScreen.offsetHeight - bearSize);
                break;
            case "left":
                bearX = Math.max(bearX - bearStep, 0);
                break;
            case "right":
                bearX = Math.min(bearX + bearStep, gameScreen.offsetWidth - bearSize);
                break;
        }

        bear.style.left = `${bearX}px`;
        bear.style.top = `${bearY}px`;

        checkBearCollisions(); // Vérifie les collisions de l'ours
    }

    // Vérifie les collisions entre l'ours et les éléments
    function checkBearCollisions() {
        const bearRect = bear.getBoundingClientRect();
        const wolfRect = wolf.getBoundingClientRect();

        // Collision entre l'ours et le loup
        if (isCollision(bearRect, wolfRect)) {
            decreaseHealth(20); // L'ours inflige des dégâts au loup
            console.log("L'ours a touché le loup et lui a infligé des dégâts.");
        }

        // Collision entre l'ours et la nourriture
        const foods = document.querySelectorAll(".food");
        foods.forEach((foodItem) => {
            const foodRect = foodItem.getBoundingClientRect();
            if (isCollision(bearRect, foodRect)) {
                foodItem.remove(); // L'ours mange la nourriture
                console.log("L'ours a mangé de la nourriture.");
            }
        });

        // Collision entre l'ours et les soins
        const healings = document.querySelectorAll(".healing");
        healings.forEach((healingItem) => {
            const healingRect = healingItem.getBoundingClientRect();
            if (isCollision(bearRect, healingRect)) {
                healingItem.remove(); // L'ours mange les soins
                console.log("L'ours a mangé un soin.");
            }
        });
    }

    // Déplace l'ours toutes les secondes
    setInterval(moveBear, 1000);
});
