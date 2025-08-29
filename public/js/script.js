document.addEventListener('DOMContentLoaded', () => {
    initialiser();
});



























/*
const questionaireComplet = document.querySelectorAll("fieldset");
const choixUnique = document.querySelector("#unique");
const choixMensuel = document.querySelector("#mensuel");
const etape1Next = document.querySelector("#next-unique");

document.addEventListener("DOMContentLoaded", () => {


    questionaireComplet.forEach(function (p) {
        p.classList.add("invisible");
    });
    questionaireComplet[0].classList.remove("invisible");







    function changementTime() {
        if (choixUnique.checked) {
            questionaireComplet[1].classList.remove("invisible");
            questionaireComplet[2].classList.add("invisible");

        }
        if (choixMensuel.checked) {
            questionaireComplet[1].classList.add("invisible");
            questionaireComplet[2].classList.remove("invisible");

        }
    }
    function goNext() {
        questionaireComplet[1].classList.add("invisible");
        questionaireComplet[2].classList.remove("invisible");

    }
    changementTime();
    goNext();
    etape1Next.addEventListener("click", goNext);
    choixUnique.addEventListener("change", changementTime);
    choixMensuel.addEventListener("change", changementTime);
});