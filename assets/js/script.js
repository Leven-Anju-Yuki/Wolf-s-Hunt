document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".btn.regle");
    if (button) {
        button.addEventListener("click", function () {
            console.log("Le bouton a été cliqué");
        });
    }
});
window.addEventListener("resize", setFavicon);
window.addEventListener("load", setFavicon);
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").then(
        function (registration) {
            console.log("Service Worker registration successful with scope: ", registration.scope);
        },
        function (error) {
            console.log("Service Worker registration failed: ", error);
        }
    );
}
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
    const foodImages = [
        "./assets/img/nourriture/viande.png",
        "./assets/img/nourriture/poisson.png",
        "./assets/img/nourriture/champi.png",
    ];
    const poisonImages = [
        "./assets/img/poison/champitoxique.png",
        "./assets/img/poison/viandepourri.png",
    ];
    const healingImages = ["./assets/img/remede/plante.png", "./assets/img/remede/fiole.png"];

    function updateStatusBars() {
        healthSpan.textContent = health;
        foodSpan.textContent = food;
        poisonSpan.textContent = poison;

        if (health <= 0) {
            gameOver();
        }
    }

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

    updateStatusBars();

    let gameScreenRect = gameScreen.getBoundingClientRect();
    let wolfX = gameScreenRect.width / 2 - wolf.offsetWidth / 2;
    let wolfY = gameScreenRect.height / 2 - wolf.offsetHeight / 2;

    wolf.src = wolfImg;
    wolf.style.position = "absolute";
    wolf.style.left = `${wolfX}px`;
    wolf.style.top = `${wolfY}px`;

    document.addEventListener("keydown", function (event) {
        if (!isWolfDead) {
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
            checkFoodCollision();
            decreaseFood();

            if (food < 50) {
                decreaseHealth(2);
            }

            if (poison > 50) {
                decreaseHealth(10);
            }
        }
    });

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
        location.reload();
    });

    function isCollision(rect1, rect2) {
        return !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
        );
    }

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
                updateStatusBars();
            }
        });
    }

    // Détection des appareils mobiles et tablettes
    function isMobileOrTablet() {
        return /Mobi|Android|iPad|Tablet/i.test(navigator.userAgent);
    }

    const maxFood = isMobileOrTablet() ? 5 : 10;
    const maxPoison = isMobileOrTablet() ? 5 : 10;
    const maxHealing = isMobileOrTablet() ? 2 : 5;
    const imageSize = isMobileOrTablet() ? 50 : 70; // Taille de l'image en fonction de l'appareil

    function generateFood(maxFood) {
        const foodCount = document.querySelectorAll(".food").length;
        if (foodCount < maxFood) {
            const foodItem = document.createElement("img");
            foodItem.className = "food";
            foodItem.style.position = "absolute";
            foodItem.style.width = `${imageSize}px`; // Utilisation de la taille définie
            foodItem.style.height = `${imageSize}px`; // Utilisation de la taille définie
            foodItem.src = foodImages[Math.floor(Math.random() * foodImages.length)];
            foodItem.style.top = `${Math.random() * (gameScreenRect.height - 50)}px`;
            foodItem.style.left = `${Math.random() * (gameScreenRect.width - 50)}px`;
            gameScreen.appendChild(foodItem);
        }
    }

    function generatePoison(maxPoison) {
        const poisonCount = document.querySelectorAll(".poison").length;
        if (poisonCount < maxPoison) {
            const poisonItem = document.createElement("img");
            poisonItem.className = "poison";
            poisonItem.style.position = "absolute";
            poisonItem.style.width = `${imageSize}px`; // Utilisation de la taille définie
            poisonItem.style.height = `${imageSize}px`; // Utilisation de la taille définie
            poisonItem.src = poisonImages[Math.floor(Math.random() * poisonImages.length)];
            poisonItem.style.top = `${Math.random() * (gameScreenRect.height - 50)}px`;
            poisonItem.style.left = `${Math.random() * (gameScreenRect.width - 50)}px`;
            gameScreen.appendChild(poisonItem);
        }
    }

    function generateHealing(maxHealing) {
        const healingCount = document.querySelectorAll(".healing").length;
        if (healingCount < maxHealing) {
            const healingItem = document.createElement("img");
            healingItem.className = "healing";
            healingItem.style.position = "absolute";
            healingItem.style.width = `${imageSize}px`; // Utilisation de la taille définie
            healingItem.style.height = `${imageSize}px`; // Utilisation de la taille définie
            healingItem.src = healingImages[Math.floor(Math.random() * healingImages.length)];
            healingItem.style.top = `${Math.random() * (gameScreenRect.height - 50)}px`;
            healingItem.style.left = `${Math.random() * (gameScreenRect.width - 50)}px`;
            gameScreen.appendChild(healingItem);
        }
    }

    function checkPoisonCollision() {
        const wolfRect = wolf.getBoundingClientRect();
        const poisons = document.querySelectorAll(".poison");

        poisons.forEach((poisonItem) => {
            const poisonRect = poisonItem.getBoundingClientRect();

            if (isCollision(wolfRect, poisonRect)) {
                poisonItem.remove();
                increasePoison(25);
                poisonCount++;
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
                updateStatusBars();
            }
        });
    }

    function gameLoop() {
        if (!isWolfDead) {
            generateFood(maxFood);
            generatePoison(maxPoison);
            generateHealing(maxHealing);
            checkFoodCollision();
            checkPoisonCollision();
            checkHealingCollision();
            decreaseFood();
            if (food < 50) {
                decreaseHealth(2);
            }
            if (poison > 50) {
                decreaseHealth(10);
            }
        }
        setTimeout(gameLoop, 2000); // Intervalle de génération des éléments réduit
    }

    gameLoop();

    // Détection des boutons mobiles et tablettes
    const upArrow = document.getElementById("upArrow");
    const downArrow = document.getElementById("downArrow");
    const leftArrow = document.getElementById("leftArrow");
    const rightArrow = document.getElementById("rightArrow");

    if (isMobileOrTablet()) {
        upArrow.addEventListener("click", function () {
            wolfY = Math.max(wolfY - 30, 0);
            wolf.style.top = `${wolfY}px`;
            checkFoodCollision();
            decreaseFood();
        });

        downArrow.addEventListener("click", function () {
            wolfY = Math.min(wolfY + 30, gameScreenRect.height - wolf.offsetHeight);
            wolf.style.top = `${wolfY}px`;
            checkFoodCollision();
            decreaseFood();
        });

        leftArrow.addEventListener("click", function () {
            wolfX = Math.max(wolfX - 30, 0);
            wolf.style.left = `${wolfX}px`;
            checkFoodCollision();
            decreaseFood();
        });

        rightArrow.addEventListener("click", function () {
            wolfX = Math.min(wolfX + 30, gameScreenRect.width - wolf.offsetWidth);
            wolf.style.left = `${wolfX}px`;
            checkFoodCollision();
            decreaseFood();
        });
    } else {
        document.addEventListener("keydown", function (event) {
            if (!isWolfDead) {
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
                checkFoodCollision();
                decreaseFood();

                if (food < 50) {
                    decreaseHealth(2);
                }

                if (poison > 50) {
                    decreaseHealth(10);
                }
            }
        });
    }
});
