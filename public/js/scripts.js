"use strict";
let etapeActuelle = 0;
let boutonPrecedent;
let boutonSuivant;
let messages = {};
let autreRadio = null;
let autreInput = null;
const articleFooter = document.createElement("footer");
const questionaireComplet = document.querySelectorAll("fieldset");
const imagesBackground = document.querySelectorAll(".imagesBackground li");
/*
* Fonction pour initialiser le formulaire
*/
function initialiserFormulaire() {
    imagesBackground.forEach(function (img, index) {
        img.classList.toggle("active", index == 0);
    });
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
        imagesBackground.forEach(function (img, index) {
            img.classList.toggle("active", index === etapeActuelle);
        });
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
        imagesBackground.forEach(function (img, index) {
            img.classList.toggle("active", index === etapeActuelle);
        });
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
        }
    });
    questionaireComplet[etapeSuivante].appendChild(articleFooter);
}
async function obtenirMessages() {
    const reponse = await fetch('objJSONMessages.json');
    messages = await reponse.json();
    console.log(messages, " messages obtenusYAUNMESAGE");
}
/*
* Fonction pour valider les champs
*/
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
/*
* Fonction pour valider une étape
*/
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
    return etapeValide;
}
/*
* Fonction pour créer les boutons
*/
function creerBoutons() {
    const boutonPrecedent = document.createElement("button");
    boutonPrecedent.type = "button";
    boutonPrecedent.id = "precedent-unique";
    boutonPrecedent.textContent = "Précédent";
    const boutonSuivant = document.createElement("button");
    boutonSuivant.type = "button";
    boutonSuivant.id = "next-unique";
    boutonSuivant.textContent = "Suivant";
    articleFooter.appendChild(boutonPrecedent);
    articleFooter.appendChild(boutonSuivant);
    boutonPrecedent.addEventListener("click", goPrecedent);
    boutonSuivant.addEventListener("click", goSuivant);
    const autreRadio = document.getElementById("autre-montant");
    const autreInput = document.getElementById("autre-input");
    // cacher au départ
    if (autreInput) {
        autreInput.style.display = "none";
    }
    // quand on change de radio
    document.querySelectorAll('input[name="montant-donation"]').forEach(radio => {
        radio.addEventListener("change", () => {
            if (autreRadio.checked) {
                autreInput.style.display = "inline-block";
            }
            else {
                autreInput.style.display = "none";
                autreInput.value = ""; // reset si pas sélectionné
            }
        });
    });
}
/*
* Initialisation du formulaire et des boutons
*/
document.addEventListener("DOMContentLoaded", () => {
    creerBoutons();
    questionaireComplet[0].appendChild(articleFooter);
    initialiserFormulaire();
    obtenirMessages();
});
