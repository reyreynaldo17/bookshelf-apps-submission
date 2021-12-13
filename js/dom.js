const INCOMPLETE_BOOK_SHELF_LIST = "incompleteBookshelfList";
const COMPLETED_BOOK_SHELF_LIST = "completeBookshelfList";
const BOOKSHELF_BOOK_ID = "bookId";

function makeBookShelf(title, author, year, isCompleted) {
 
    const bookTitle = document.createElement("h2");
    bookTitle.classList.add("bookTitle");
    bookTitle.innerText = title;
 
    const bookAuthor = document.createElement("h3");
    bookAuthor.classList.add("bookAuthor");
    bookAuthor.innerText = author;
    
    const bookYear = document.createElement("p");
    bookYear.classList.add("bookYear");
    bookYear.innerText = year;

    const textContainer = document.createElement("article");
    textContainer.classList.add("book_item");   
    textContainer.append(bookTitle, bookAuthor, bookYear);
 
    const container = document.createElement("div");
    container.classList.add("item", "shadow")
    container.append(textContainer);

    if(isCompleted){     
        container.append(
            createUndoButton(),
            createTrashButton());
    } else {
        container.append(
            createCheckButton(),
            createTrashButton());
    }
    return container;
}

function addBook() {
    const bookIncomplete = document.getElementById(INCOMPLETE_BOOK_SHELF_LIST);
    const bookCompleted = document.getElementById(COMPLETED_BOOK_SHELF_LIST);

    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const checkCompleted = document.getElementById("inputBookIsComplete").checked;


    const bookShelf = makeBookShelf(bookTitle, bookAuthor, bookYear, checkCompleted);
    const bookShelfObject = composeBooksObject(bookTitle, bookAuthor, bookYear, checkCompleted);

    bookShelf[BOOKSHELF_BOOK_ID] = bookShelfObject.id;
    books.push(bookShelfObject);
    if (checkCompleted) {
        bookCompleted.append(bookShelf);
    } else {
        bookIncomplete.append(bookShelf);
    }
    
    updateDataToStorage();
}

function addBookToCompleted(taskElement) {
    const bookCompleted = document.getElementById(COMPLETED_BOOK_SHELF_LIST);
    
    const bookTitle = taskElement.querySelector(".bookTitle").innerText;
    const bookAuthor = taskElement.querySelector(".bookAuthor").innerText;
    const bookYear = taskElement.querySelector(".bookYear").innerText;

    const newBookShelf = makeBookShelf(bookTitle, bookAuthor, bookYear, true);

    const bookShelf = findBook(taskElement[BOOKSHELF_BOOK_ID]);
    bookShelf.isCompleted = true;
    newBookShelf[BOOKSHELF_BOOK_ID] = bookShelf.id;

    bookCompleted.append(newBookShelf);
    taskElement.remove();

    updateDataToStorage();
} 

function UndoBookFromCompleted(taskElement) {
    const bookIncomplete = document.getElementById(INCOMPLETE_BOOK_SHELF_LIST);
    const bookTitle = taskElement.querySelector(".bookTitle").innerText;
    const bookAuthor = taskElement.querySelector(".bookAuthor").innerText;
    const bookYear = taskElement.querySelector(".bookYear").innerText;

    const newBookShelf = makeBookShelf(bookTitle, bookAuthor, bookYear, false);
    
    const bookShelf = findBook(taskElement[BOOKSHELF_BOOK_ID]);
    bookShelf.isCompleted = false;
    newBookShelf[BOOKSHELF_BOOK_ID] = bookShelf.id;

    bookIncomplete.append(newBookShelf);
    taskElement.remove();

    updateDataToStorage();
} 

function removeBookFromCompleted(taskElement) {
    const bookPosition = findBookIndex(taskElement[BOOKSHELF_BOOK_ID]);
    books.splice(bookPosition, 1);

    taskElement.remove();
    updateDataToStorage();
}

function createButton(buttonTypeClass , eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
        event.stopPropagation();
    });
    return button;
}

function createCheckButton() {
    return createButton("check-button", function(event){
        const bookTitle = event.target.parentElement.querySelector(".bookTitle").innerText
        if (confirm("Apakah anda sudah selesai membaca buku '" + bookTitle + "' ?")) {
            addBookToCompleted(event.target.parentElement);
        }
    });
}

function createTrashButton() {
    return createButton("trash-button", function(event){
        const bookTitle = event.target.parentElement.querySelector(".bookTitle").innerText
        if (confirm("Apakah anda yakin ingin menghapus buku '" + bookTitle + "' ?")) {
            removeBookFromCompleted(event.target.parentElement);
        }
    });
}

function createUndoButton() {
    return createButton("undo-button", function(event){
        const bookTitle = event.target.parentElement.querySelector(".bookTitle").innerText
        if (confirm("Apakah anda yakin ingin membaca kembali buku '" + bookTitle + "' ?")) {
            UndoBookFromCompleted(event.target.parentElement);
        }
    });
}

function searchBookTitle(bookTitle) {
    const text = bookTitle.value.toLowerCase();
    const bookItems = document.querySelectorAll(".item");
    bookItems.forEach((book) => {
      const itemText = book.textContent.toLowerCase();
  
      if (itemText.indexOf(text) !== -1) {
        book.setAttribute("style", "display: flex");
      } else {
        book.setAttribute("style", "display: none !important");
      }
    });
}

function refreshDataFromBookShelf() {
    const bookIncomplete = document.getElementById(INCOMPLETE_BOOK_SHELF_LIST);
    let bookCompleted = document.getElementById(COMPLETED_BOOK_SHELF_LIST);

    for (book of books) {
        const newBookShelf = makeBookShelf(book.title, book.author, book.year, book.isCompleted);
        newBookShelf[BOOKSHELF_BOOK_ID] = book.id;

        if(book.isCompleted){
            bookCompleted.append(newBookShelf);
        } else {
            bookIncomplete.append(newBookShelf);
        }
    }
}