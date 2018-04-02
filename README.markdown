# Wave Software Development Challenge
Applicants for the [Software developer](https://wave.bamboohr.co.uk/jobs/view.php?id=1) role at Wave must complete the following challenge, and submit a solution prior to the onsite interview. 

The purpose of this exercise is to create something that we can work on together during the onsite. We do this so that you get a chance to collaborate with Wavers during the interview in a situation where you know something better than us (it's your code, after all!) 

... see [original readme description](https://github.com/wvchallenges/se-challenge-expenses) here.

# Setup

1. install dependencies of this node package
1. create Schema in MySQL
    * Inside MySQL CLI run:
    * `CREATE DATABASE nastajus_wvchallenge_db;`
    * `CREATE USER 'nastajus_wvchallenge_user'@'localhost' IDENTIFIED BY 'nastajus_wvchallenge_pass';`
    * `GRANT ALL PRIVILEGES ON *.* TO 'nastajus_wvchallenge_user'@'localhost' WITH GRANT OPTION;`
    * test db connection works by running `/index.js` without error, proving this connects
1. run [sequelize-cli](https://github.com/sequelize/cli#sequelizecli---) migration
    * `node_modules/.bin/sequelize db:migrate`

* optional data clean up
    * `node_modules/.bin/sequelize db:migrate`
    * `node_modules/.bin/sequelize db:migrate:undo`
    * `node_modules/.bin/sequelize db:seed:all`
    * ~~`node_modules/.bin/sequelize db:seed:undo`    *(TBD)*~~

# RESTful API

### **currently**

    GET /
show landing page, with browse button

    POST /test
upload CSV file submission. replies with merely text "test response"

### **considering**

    GET  /employee
    GET  /employee/empId
    POST /employee
    POST /employee/empId
    GET  /employee/empId/expenses
    GET  /employee/empId/expenses/expId

.

    POST /expenses
file upload of expenses in known CSV format.

    GET /expenses
show all expenses *(TBD perhaps paginate)*

# Demonstration Thought Process

Everything below this point is extraneous details beyond the requirements specified in the Wave Challenge.  It is included to demonstrate my thinking process when designing an application, with references linked justifying decisions made where meaningful.

## Requirements Summary:
* Upload this [CSV](https://github.com/wvchallenges/se-challenge-expenses/blob/master/data_example.csv) file via form entry.
* Persist to a relational database.
* Display per-month total of one of the fields.
* Easy to setup application.

## Evaluation:
1. Were models/entities and other components easily identifiable to the reviewer?
1. What design decisions did you make when designing your models/entities? Why (i.e. were they explained?)
1. Did you separate any concerns in your application? Why or why not?
1. Does your solution use appropriate datatypes for the problem as described?


## Target Evolving Answers
1. Having chosen to implement this in Nodejs despite a Java background, the nature of nested JavasScript function calls when designing the MVP seems quite flat & non-modular to me. For example nesting validation logic inside the middleware callback, or having all possible HTTP Request endpoints in one file seems unusual to me. *TBD: I'd like to revisit to attempt a greater logical separation, such as with `module.exports`. Initially I'll begin with a single `index.js` file to centralize in, expand into additional modules when passing by*.
1. Employees & Expenses seem like a very logical initial separation, followed by some higher level abstraction such as Reports. Since monthly totals could potentially always be recalculated, it could be argued as unnecessary to persist those results, however performance at scale would benefit from storing those results. *TBD: I want to establish a basic relationship with unique identifiers such as auto-incrementing integers, so an expense must reference an existing employee.*
    1. **a design decision regarding business logic, but not regarding models/entities themselves**: Initially the front-end will handle HTTP requests from the simple yet limiting `<form method="POST" ..>` instead of using the more versatile `XMLHttpRequest` object in dozens of lines of code. *TBD: Ideally I'd like to work past the limited requirements of merely displaying the results of the expenses uploaded, by providing in-page editing directly, per-expense. In which case, it would permit a wider Restful API of full CRUD, supporting GET POST PUT and DELETE.*
1. *TBD*
1. Absolutely!


## Lessons Learned
### JavaScript
* Initially I began with assumptions of JavaScript I didn't realize I had, until I began trying to treat it in familar ways like Java. For example I assumed variable references would *pass by reference*, which is typically not the case. However I've learned I can achieve that affect with arrays [here](https://stackoverflow.com/questions/5865094/how-can-i-store-reference-to-a-variable-within-an-array), so I intend to leverage that in my designs.
* *TBD: Perhaps discuss implementation equivalent of a static variable counter from Java as applied in a JavaScript context, such as mentioned [here](https://stackoverflow.com/questions/1535631/static-variables-in-javascript). However I've realized I don't need to initialize it in the application layer, that solely the database should be responsible for generating unique IDs, so I may just discard this section.*
* *TBD: Padding trick with `.slice( negative )` [here](http://www.codigomanso.com/en/2010/07/simple-javascript-formatting-zero-padding/).*

### Node
* *TBD: Possibly discuss any of: package management (?), any libraries (?), any IDE-specific things (like Webstorm's Typescript Language Service) (?), any general TypeScript-specific things (like needing a matching `@types/libxyz` version to your library) (?).*

### Databases
* *TBD: Table names are case-sensitive depending on your system, per [here](https://stackoverflow.com/questions/2009005/are-column-and-table-name-case-sensitive-in-mysql), noticed while setting up Sequelize & double-checking.*



## Decisions Made
### JavaScript
* Considered using **[chaining](https://schier.co/blog/2013/11/14/method-chaining-in-javascript.html)**, but decided to design for now using a single method `Loggable.print()` over chaining multiple smaller methods, as advised by the [rule of threes](https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming)) and to keep as lightweight as possible for reading.
* Chose to accept slight performance hit by nesting `Employee.build` inside `expenseItemsFile.forEach`, due to the simplicity. This causes every row to hit the database individually, instead of in bulk all at once. Ideally this would be reversed by using **promises**.
* *TBD: Verify convention of capitalization of constants [here](https://en.wikipedia.org/wiki/Naming_convention_(programming)#JavaScript).*
* *TBD: Applied convention that when constructing instances of objects with `new` the function should be named beginning with a capital letter.*
* *TBD: Applied correct standard of adding properties to object by iterating and checking for `hasOwnProperty` as shown [here](https://stackoverflow.com/questions/500504/why-is-using-for-in-with-array-iteration-a-bad-idea/4261096#4261096).*
* *TBD: Used an **[IIFE](https://stackoverflow.com/questions/8228281/what-is-the-function-construct-in-javascript)** in a **named function** `appendLogFile` inside `print`*

### Design
* Originally I planned to use a low level library like `knex`, to avoid learning unnecessary abstraction layer. However when I realized the model would not be clearly exposed through the main server language, JavaScript, I moved onto learning an ORM library like `Sequelize`. My original intention to stick with purely familiar SQL queries somewhat breaks one of the wave challenge requirements to easily show the model, perhaps for only my own subjective requirement that this project be setup as much as possible via a single interface, namely `npm`/`node`/`JavaScript`. I am appreciating the ease provided by this level of abstraction.

* *TBD: Chose to use node library `mkdirp` to make empty folders like `/uploads`, `/logs`, instead of providing configuration instructions to create empty folders, to avoid imposing effort expended at configuring setup, at the cost of including yet another library which might potentiall interfere later. Absence of these empty folders throws an exception otherwise. If Git permitted storing empty folders I would rely on that instead.*
* *TBD: In my personal projects, I tend to put extra comments & extra implementation samples when I'm initially implementing, then subsequently deleting the more irrelevant ones on the next commit, as part of some other larger work item. I use this as a way of documenting my thought process. For production repositories I do this less or not at all.*