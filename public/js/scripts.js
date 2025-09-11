"use strict";
let etapeActuelle = 0;
let boutonPrecedent;
let boutonSuivant;
let messages = {};
const questionaireComplet = document.querySelectorAll("fieldset");
/*
* Fonction pour initialiser le formulaire
*/
function initialiserFormulaire() {
    questionaireComplet.forEach(function (p) {
        p.classList.add("invisible");
    });
    questionaireComplet[0].classList.remove("invisible");
}
/*
* Fonction pour aller à l'étape précédente
*/
function goPrecedent() {
    if (etapeActuelle > 0) {
        etapeActuelle--;
        changerEtape(etapeActuelle);
        if (etapeActuelle === 0) {
            boutonPrecedent?.classList.toggle("invisible", true);
        }
        boutonSuivant?.classList.toggle("invisible", false);
    }
}
/*
* Fonction pour aller à l'étape suivante
*/
function goSuivant(event) {
    event.preventDefault();
    const etapeValide = validerEtape(etapeActuelle);
    if (!etapeValide) {
        return;
    }
    if (etapeActuelle < questionaireComplet.length - 1) {
        etapeActuelle++;
        changerEtape(etapeActuelle);
        boutonPrecedent?.classList.toggle("invisible", false);
        if (etapeActuelle === questionaireComplet.length - 1) {
            boutonSuivant?.classList.toggle("invisible", true);
        }
    }
}
/*
* Fonction pour changer d'étape
*/
function changerEtape(etapeSuivante) {
    questionaireComplet.forEach(function (p, index) {
        p.classList.toggle("invisible", index >= 0 && index !== etapeSuivante);
        // console.log("etapeSuivante " + etapeSuivante + " index " + index);
        if (etapeSuivante > index) {
            validerEtape(index);
            // console.log("validation etape " + index);
        }
    });
}
async function obtenirMessages() {
    const reponse = await fetch('objJSONMessages.json');
    messages = await reponse.json();
    console.log(messages, " messages obtenusYAUNMESAGE");
}
function validerChamp(champ) {
    let valide = false;
    let idChamp = champ.id;
    const idMessageErreur = "erreur-" + idChamp; // erreur-email
    const erreurElement = document.getElementById(idMessageErreur);
    if (champ.validity.valueMissing && messages[idChamp].vide) {
        valide = false;
        erreurElement.innerText = messages[idChamp].vide;
    }
    else if (champ.validity.typeMismatch && messages[idChamp].type) {
        valide = false;
        erreurElement.innerText = messages[idChamp].type;
    }
    else if (champ.validity.patternMismatch && messages[idChamp].pattern) {
        valide = false;
        erreurElement.innerText = messages[idChamp].pattern;
    }
    else {
        valide = true;
    }
    return valide;
}
function validerEtape(etape) {
    let etapeValide = true;
    const champs = questionaireComplet[etape].querySelectorAll("input, select, textarea");
    champs.forEach((champ) => {
        const estValide = validerChamp(champ);
        console.log("champ " + champ.id + " estValide ", estValide);
        if (!estValide) {
            etapeValide = false;
        }
    });
    if (!etapeValide) {
        questionaireComplet[etape].classList.add("erreur");
    }
    else {
        questionaireComplet[etape].classList.remove("erreur");
    }
    return etapeValide;
}
/*
* Initialisation du formulaire et des boutons
*/
document.addEventListener("DOMContentLoaded", () => {
    initialiserFormulaire();
    obtenirMessages();
    boutonPrecedent = document.querySelector("#precedent-unique");
    boutonSuivant = document.querySelector("#next-unique");
    if (boutonPrecedent) {
        boutonPrecedent.addEventListener("click", goPrecedent);
    }
    if (boutonSuivant) {
        boutonSuivant.addEventListener("click", goSuivant);
    }
});
