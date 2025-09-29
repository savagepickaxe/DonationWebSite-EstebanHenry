let etapeActuelle = 0;
let boutonPrecedent: HTMLButtonElement | null;
let boutonSuivant: HTMLButtonElement | null;
let messages = {} as erreursJSON;
let autreRadio: HTMLInputElement | null = null;
let autreInput: HTMLInputElement | null = null;
const articleFooter = document.createElement("footer");
const questionaireComplet = document.querySelectorAll("fieldset");
const imagesBackground = document.querySelectorAll(".imagesBackground li");

interface messageErreur {
    vide?: string;
    pattern?: string;
    type?: string;
}
interface erreursJSON {
    [fieldName: string]: messageErreur;
}


/*
* Fonction pour initialiser le formulaire
*/
function initialiserFormulaire(): void {
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
function goPrecedent(): void {
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
function goSuivant(event: Event): void {

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
            boutonSuivant?.classList.add("invisible");
        }
        else {
            boutonSuivant?.classList.remove("invisible");
        }
    }
}
/*
* Fonction pour changer d'étape
*/
function changerEtape(etapeSuivante: number): void {


    questionaireComplet.forEach(function (p, index) {
        p.classList.toggle("invisible", index >= 0 && index !== etapeSuivante);
        // console.log("etapeSuivante " + etapeSuivante + " index " + index);
        if (etapeSuivante > index) {
            validerEtape(index);
        }
    });
    questionaireComplet[etapeSuivante].appendChild(articleFooter);

    if (etapeSuivante === questionaireComplet.length - 1) {
        mettreAJourResume();
    }
}
/*
* Fonction pour mettre à jour le résumé
*/
function mettreAJourResume(): void {
    const typeDonation = document.querySelector('input[name="type-donation"]:checked') as HTMLInputElement;
    const montantDonation = document.querySelector('input[name="montant-donation"]:checked') as HTMLInputElement;
    const autreMontant = document.getElementById("autre-input") as HTMLInputElement;
    const nomDonateur = document.getElementById("nom") as HTMLInputElement;
    const emailDonateur = document.getElementById("courriel") as HTMLInputElement;
    const compagnieDonateur = document.getElementById("entreprise") as HTMLInputElement;

    const resumeType = document.getElementById("resume-type") as HTMLSpanElement;
    const resumeMontant = document.getElementById("resume-montant") as HTMLSpanElement;
    const resumeNom = document.getElementById("resume-nom") as HTMLSpanElement;
    const resumeCompagnie = document.getElementById("resume-compagnie") as HTMLSpanElement;
    const resumeEmail = document.getElementById("resume-email") as HTMLSpanElement;
    const resumePaiement = document.getElementById("resume-paiement") as HTMLSpanElement;

    if (typeDonation) {
        resumeType.innerText = typeDonation.value;
    }
    if (montantDonation) {
        if (montantDonation.value === "autre") {
            resumeMontant.innerText = autreMontant.value + " $";
        } else {
            resumeMontant.innerText = montantDonation.value + " $";
        }
    }
    if (nomDonateur) {
        resumeNom.innerText = nomDonateur.value;
    }
    if (emailDonateur) {
        resumeEmail.innerText = emailDonateur.value;
    }
    if (compagnieDonateur) {
        resumeCompagnie.innerText = compagnieDonateur.value ? compagnieDonateur.value : "Aucune";
    }
}
async function obtenirMessages(): Promise<void> {
    const reponse = await fetch('objJSONMessages.json')
    messages = await reponse.json();
    console.log(messages, " messages obtenusYAUNMESAGE");

}
/*
* Fonction pour valider les champs
*/
function validerChamp(champ: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
    let valide = false;
    let idChamp = champ.id;
    const idMessageErreur = "erreur-" + idChamp; // erreur-email
    const erreurElement = document.getElementById(idMessageErreur) as HTMLDivElement;

    if (champ.validity.valueMissing && messages[idChamp].vide) {
        valide = false;
        erreurElement.innerText = messages[idChamp].vide;
    } else if (champ.validity.typeMismatch && messages[idChamp].type) {
        valide = false;
        erreurElement.innerText = messages[idChamp].type;
    } else if (champ.validity.patternMismatch && messages[idChamp].pattern) {
        valide = false;
        erreurElement.innerText = messages[idChamp].pattern;
    } else {
        valide = true;
        erreurElement.innerText = "";
    }
    return valide;
}
/*
* Fonction pour valider une étape
*/
function validerEtape(etape: number): boolean {
    let etapeValide = true;
    const champs = questionaireComplet[etape].querySelectorAll("input, select, textarea");
    champs.forEach((champ) => {
        if (champ.hasAttribute("data-validation") && champ.getAttribute("data-validation") === "ignore") {
            return; // ignorer ce champ
        }
        console.log(champ);
        const estValide = validerChamp(champ as HTMLInputElement);
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
function creerBoutons(): void {

    boutonPrecedent = document.createElement("button");
    boutonPrecedent.type = "button";
    boutonPrecedent.id = "precedent-unique";
    boutonPrecedent.textContent = "Précédent";

    boutonSuivant = document.createElement("button");
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
            } else {
                autreInput.style.display = "none";
                autreInput.value = ""; // reset si pas sélectionné
            }
        });
    });
}
/*
* Fonction pour initialiser la navigation par étapes
*/
function initialiserNavigationEtapes(): void {
    const liensEtapes = document.querySelectorAll<HTMLAnchorElement>("[data-etape]");
    liensEtapes.forEach((lien) => {
        lien.addEventListener("click", changementEtapeDirecte);
    });
}
/*
* Fonction pour changer d'étape en cliquant sur les liens
*/
function changementEtapeDirecte(event: Event): void {
    event.preventDefault();
    const elementClique = event.currentTarget as HTMLAnchorElement;
    const numeroClique = parseInt(elementClique.dataset.etape || "0", 10) - 1;
    console.log(numeroClique)
    if (numeroClique > etapeActuelle) {
        return
    }
    etapeActuelle = numeroClique;
    changerEtape(etapeActuelle);
    imagesBackground.forEach((img, index) => {
        img.classList.toggle("active", index === etapeActuelle);
    }
    );
    if (etapeActuelle === 0) {
        boutonPrecedent?.classList.add("invisible");
    } else {
        boutonPrecedent?.classList.remove("invisible");
    }
    if (etapeActuelle === questionaireComplet.length - 1) {
        boutonSuivant?.classList.add("invisible");
    }
    else {
        boutonSuivant?.classList.remove("invisible");
    }
}

/*
* Initialisation du formulaire et des boutons
*/
document.addEventListener("DOMContentLoaded", () => {
    creerBoutons();
    questionaireComplet[0].appendChild(articleFooter);
    initialiserFormulaire();
    obtenirMessages();
    initialiserNavigationEtapes();
});