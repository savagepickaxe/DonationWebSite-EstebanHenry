"use strict";
let etapeActuelle = 1;
let boutonPrecedent;
let boutonSuivant;
const questionaireComplet = document.querySelectorAll("fieldset");
/*
* Fonction pour initialiser le formulaire
*/
function initialiserFormulaire() {
    questionaireComplet.forEach(function (p) {
        p.classList.add("invisible");
    });
    questionaireComplet[0].classList.remove("invisible");
    questionaireComplet[1].classList.remove("invisible");
}
/*
* Fonction pour changer d'étape
*/
function changerEtape(etapeSuivante) {
    questionaireComplet.forEach(function (p, index) {
        p.classList.toggle("invisible", index > 0 && index !== etapeSuivante);
    });
}
/*
* Fonction pour aller à l'étape précédente
*/
function goPrecedent() {
    if (etapeActuelle > 1) {
        etapeActuelle--;
        changerEtape(etapeActuelle);
        if (etapeActuelle === 1) {
            boutonPrecedent.classList.toggle("invisible", true);
        }
        boutonSuivant.classList.toggle("invisible", false);
    }
}
/*
* Fonction pour aller à l'étape suivante
*/
function goSuivant() {
    if (etapeActuelle < questionaireComplet.length - 1) {
        etapeActuelle++;
        changerEtape(etapeActuelle);
        boutonPrecedent.classList.toggle("invisible", false);
        if (etapeActuelle === questionaireComplet.length - 1) {
            boutonSuivant.classList.toggle("invisible", true);
        }
    }
}
/*
* Initialisation du formulaire et des boutons
*/
document.addEventListener("DOMContentLoaded", () => {
    initialiserFormulaire();
    const questionaireComplet = document.querySelectorAll("fieldset");
    boutonPrecedent = document.querySelector("#precedent-unique");
    boutonSuivant = document.querySelector("#next-unique");
    if (boutonPrecedent) {
        boutonPrecedent.addEventListener("click", goPrecedent);
    }
    if (boutonSuivant) {
        boutonSuivant.addEventListener("click", goSuivant);
    }
});
