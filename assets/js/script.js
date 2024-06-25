document.addEventListener('DOMContentLoaded', function () {
    const wolf = document.getElementById('wolf');
    const gameScreen = document.getElementById('game-screen');

    // Position initiale du loup (centre de l'écran)
    const gameScreenRect = gameScreen.getBoundingClientRect();
    let wolfX = gameScreenRect.width / 2 - wolf.offsetWidth / 2;
    let wolfY = gameScreenRect.height / 2 - wolf.offsetHeight / 2;

    wolf.style.left = `${wolfX}px`;
    wolf.style.top = `${wolfY}px`;

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
    });

    // Mettre à jour les dimensions de l'écran de jeu lors du redimensionnement de la fenêtre
    window.addEventListener('resize', function () {
        const newGameScreenRect = gameScreen.getBoundingClientRect();
        gameScreenRect.width = newGameScreenRect.width;
        gameScreenRect.height = newGameScreenRect.height;

        // Recentrer le loup après redimensionnement
        wolfX = Math.min(wolfX, gameScreenRect.width - wolf.offsetWidth);
        wolfY = Math.min(wolfY, gameScreenRect.height - wolf.offsetHeight);
        wolf.style.left = `${wolfX}px`;
        wolf.style.top = `${wolfY}px`;
    });
});
