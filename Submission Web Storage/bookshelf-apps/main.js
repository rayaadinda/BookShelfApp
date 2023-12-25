document.addEventListener("DOMContentLoaded", function () {
  console.log("Script executed");
  const inputBookForm = document.getElementById("inputBook");
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");

  inputBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  function addBook() {
    const inputBookTitle = document.getElementById("inputBookTitle").value;
    const inputBookAuthor = document.getElementById("inputBookAuthor").value;
    const inputBookYear = document.getElementById("date").value;
    const inputBookIsComplete = document.getElementById("inputBookIsComplete").checked;

    const inputDate = new Date(inputBookYear);

    if (!isNaN(inputDate.getFullYear())) {
      
      const newBook = {
        id: generateId(),
        title: inputBookTitle,
        author: inputBookAuthor,
        year: inputDate.getFullYear(),
        isComplete: inputBookIsComplete,
      };

      const bookElement = createBookElement(newBook);
      if (inputBookIsComplete) {
        addToCompleteBookshelf(newBook);
      } else {
        addToIncompleteBookshelf(newBook);
      }

      updateDataToStorage();
      inputBookForm.reset();
    } else {
      
      console.error("Invalid date input");
    }
  }

  function addToIncompleteBookshelf(book) {
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const bookElement = createBookElement(book, 'incomplete');
    incompleteBookshelfList.appendChild(bookElement);
  }

  function addToCompleteBookshelf(book) {
    const completeBookshelfList = document.getElementById("completeBookshelfList");
    const bookElement = createBookElement(book, 'complete');
    completeBookshelfList.appendChild(bookElement);
  }

  function removeFromIncompleteBookshelf(bookId) {
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const bookElement = findBookById(bookId, 'incompleteBookshelfList');
    incompleteBookshelfList.removeChild(bookElement);
  }

  function removeFromCompleteBookshelf(bookId) {
    const completeBookshelfList = document.getElementById("completeBookshelfList");
    const bookElement = findBookById(bookId, 'completeBookshelfList');
    completeBookshelfList.removeChild(bookElement);
  }

  function createBookElement(book, shelf) {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book_item");
    bookElement.dataset.id = book.id;
    bookElement.innerHTML = `
      <h3>${book.title}</h3>
      <p>Penulis :${book.author}</p>
      <p>Tahun :${book.year}</p>
    `;

    const actionButton = document.createElement('button');
    if (shelf === 'incomplete') {
      actionButton.classList.add('check-button');
      actionButton.addEventListener('click', function () {
        moveBook(book, 'complete');
      });
      const trashButton = document.createElement('button');
      trashButton.classList.add('trash1-button');
      trashButton.addEventListener('click', function () {
        removeBook(book.id);
      });

      bookElement.appendChild(trashButton);
    } else if (shelf === 'complete') {
      actionButton.classList.add('undo-button');
      actionButton.addEventListener('click', function () {
        moveBook(book, 'incomplete');
      });

      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');
      trashButton.addEventListener('click', function () {
        removeBook(book.id);
      });

      bookElement.appendChild(trashButton);
    }

    if (actionButton) {
      bookElement.appendChild(actionButton);
    }

    return bookElement;
  }

  function moveBook(book, targetShelf) {
    if (targetShelf === 'complete') {
      addToCompleteBookshelf(book);
      removeFromIncompleteBookshelf(book.id);
    } else if (targetShelf === 'incomplete') {
      addToIncompleteBookshelf(book);
      removeFromCompleteBookshelf(book.id);
    }

    updateDataToStorage();
  }

  function generateId() {
    return Math.floor(Math.random() * 1e9).toString();
  }

  function updateDataToStorage() {
    const incompleteBookshelf = Array.from(document.getElementById("incompleteBookshelfList").getElementsByClassName('book_item')).map((item) => bookElementToObject(item))
    const completeBookshelf = Array.from(document.getElementById("completeBookshelfList").getElementsByClassName('book_item')).map((item) => bookElementToObject(item))

    const data = {
      incomplete: incompleteBookshelf,
      complete: completeBookshelf,
    };

    localStorage.setItem('bookshelfData', JSON.stringify(data));
  }

  function findBookById(bookId, shelfId) {
    const shelf = document.getElementById(shelfId);
    const bookElements = shelf.getElementsByClassName('book_item');
    for (const element of bookElements) {
      if (element.dataset.id === bookId) {
        return element;
      }
    }
    return null;
  }

  function removeBook(bookId) {
    removeFromCompleteBookshelf(bookId);
    updateDataToStorage();
  }

  function bookElementToObject(bookElement) {
    const title = bookElement.querySelector('h3').textContent;
    const author = bookElement.querySelector('.book_item p:nth-child(2)').textContent;
    const year = parseInt(bookElement.querySelector('.book_item p:nth-child(3)').textContent);
    const isComplete = bookElement.classList.contains('complete');

    return {
      id: bookElement.dataset.id,
      title,
      author,
      year: parseInt(year), 
      isComplete,
    };
  }


  loadBookshelfDataFromStorage();

  function loadBookshelfDataFromStorage() {
    const storedData = localStorage.getItem('bookshelfData');
    if (storedData) {
      const data = JSON.parse(storedData);
      if (data) {
    
        if (data.incomplete) {
          data.incomplete.forEach(book => addToIncompleteBookshelf(book));
        }

  
        if (data.complete) {
          data.complete.forEach(book => addToCompleteBookshelf(book));
        }
      }
    }
  }
});
