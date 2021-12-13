document.addEventListener("DOMContentLoaded", function () {
 
    const submitForm = document.getElementById("inputBook");
 
    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });

    const searchBook = document.getElementById("searchBook");

    searchBook.addEventListener("submit", function (event) {
        event.preventDefault();
        const filterInput = document.querySelector("#searchBookTitle");
        searchBookTitle(filterInput);
    });

    if(isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener("click", function () {
    const checkCompleted = document.getElementById("inputBookIsComplete").checked;
    const spanCheckCompleted = document.getElementById("spanCheckCompleted");
    if (checkCompleted) {
        spanCheckCompleted.innerText = "Selesai dibaca";
    }
    else {
        spanCheckCompleted.innerText = "Belum Selesai dibaca";
    }
});



document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil disimpan.");
});

document.addEventListener("ondataloaded", () => {
    refreshDataFromBookShelf();
});