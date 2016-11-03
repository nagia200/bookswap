# bookswap
MEAN stack web application with authentication (via PassportJS) for borrowing and lending books to friends. 

## About
BookSwap is an app that:
* Shows you which friends own which books
* Prevents you from losing a book because you can't remember who borrowed it
* Prevents you from purchasing a book that a friend already owns
* Promotes literacy, reusing, and frugality

## Details
The user can register an account and log in once an account has been created. Once logged in, the user can add books that they are willing to lend to their Bookshelf. The Bookshelf of each user lists the book title, author, and whether it's available for borrowing or not.
Each book on the Bookshelf has its own page that includes a comments section and buttons for requesting the book (if it's available) and adding it to the user's Wish List. Adding comments are allowed for logged in users only.

## In Progress
This app in currently in progress. The bulk of the back-end is built, but some features, such as a Wish List for each user, confirmation of deleting books/comments, and Google Custom Search for easily adding books (and book images) are still being implemented. Ideally, there will be an About page for each user for contacting. The front-end design was neglected a little during the course of this project, so this will be worked on as well.

## Screenshots
![Home page](screenshots/homepage.png)
> Home page (user is logged in)
![Adding a book](screenshots/adding_book.png)
> Adding a book
![Book page](screenshots/book_page.png)
> Individual book page
