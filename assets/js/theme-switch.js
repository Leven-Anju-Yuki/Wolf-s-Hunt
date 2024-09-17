document.addEventListener("DOMContentLoaded", function() {
    const lightFavicon = document.getElementById("favicon-light");
    const darkFavicon = document.getElementById("favicon-dark");

    function switchFavicon(theme) {
        if (theme === "dark") {
            darkFavicon.setAttribute("rel", "icon");
            lightFavicon.setAttribute("rel", "alternate icon");
        } else {
            lightFavicon.setAttribute("rel", "icon");
            darkFavicon.setAttribute("rel", "alternate icon");
        }
    }

    function getPreferredTheme() {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        switchFavicon(theme);
    }

    applyTheme(getPreferredTheme());

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        const newTheme = e.matches ? "dark" : "light";
        applyTheme(newTheme);
    });
});
