// Attendre que le DOM soit complètement chargé avant d'exécuter le code
document.addEventListener("DOMContentLoaded", function() {

    // Fonction pour définir la favicon en fonction de la taille de l'écran
    function setFavicon() {
        var faviconPc = document.getElementById("favicon-pc"); // Sélectionner la favicon pour PC
        var faviconMobile = document.getElementById("favicon-mobile"); // Sélectionner la favicon pour mobile

        // Si la largeur de la fenêtre est inférieure ou égale à 768px
        if (window.innerWidth <= 768) {
            faviconPc.remove(); // Retirer la favicon pour PC
            document.head.appendChild(faviconMobile); // Ajouter la favicon pour mobile
        } else {
            faviconMobile.remove(); // Retirer la favicon pour mobile
            document.head.appendChild(faviconPc); // Ajouter la favicon pour PC
        }
    }

    // Appeler la fonction setFavicon lors du redimensionnement de la fenêtre
    window.addEventListener("resize", setFavicon);
    // Appeler la fonction setFavicon lors du chargement de la page
    window.addEventListener("load", setFavicon);

    // Vérifier si le navigateur supporte les Service Workers
    if ("serviceWorker" in navigator) {
        // Enregistrer le Service Worker
        navigator.serviceWorker.register("/sw.js").then(
            function(registration) {
                console.log("Service Worker registration successful with scope: ", registration.scope);
            },
            function(error) {
                console.log("Service Worker registration failed: ", error);
            }
        );
    }

    // Variable pour stocker l'événement beforeinstallprompt
    let deferredPrompt;
    // Sélectionner le bouton d'installation
    const installButton = document.getElementById("installButton");

    // Écouter l'événement beforeinstallprompt
    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault(); // Empêcher l'affichage automatique de l'invite d'installation
        deferredPrompt = e; // Stocker l'événement
        installButton.style.display = "block"; // Afficher le bouton d'installation
    });

    // Écouter le clic sur le bouton d'installation
    installButton.addEventListener("click", () => {
        if (deferredPrompt) {
            deferredPrompt.prompt(); // Afficher l'invite d'installation
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === "accepted") {
                    console.log("User accepted the A2HS prompt"); // L'utilisateur a accepté l'installation
                } else {
                    console.log("User dismissed the A2HS prompt"); // L'utilisateur a refusé l'installation
                }
                deferredPrompt = null; // Réinitialiser l'événement
                installButton.style.display = "none"; // Masquer le bouton d'installation
            });
        }
    });

    // Écouter l'événement appinstalled
    window.addEventListener("appinstalled", () => {
        console.log("PWA was installed"); // La PWA a été installée
    });
});
