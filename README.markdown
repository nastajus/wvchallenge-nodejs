# Wave Software Development Challenge
Applicants for the [Software developer](https://wave.bamboohr.co.uk/jobs/view.php?id=1) role at Wave must complete the following challenge, and submit a solution prior to the onsite interview. 

The purpose of this exercise is to create something that we can work on together during the onsite. We do this so that you get a chance to collaborate with Wavers during the interview in a situation where you know something better than us (it's your code, after all!) 

... see [original readme description](https://github.com/wvchallenges/se-challenge-expenses) here.

# Setup

1. Have [Git installed](https://git-scm.com/downloads) and [clone this repository](https://help.github.com/articles/cloning-a-repository/).
1. Have [Node installed](https://nodejs.org/en/download/) then get dependencies of this node package
    * Inside this folder run: 
    * `npm install` 
1. Have [MySQL installed](https://dev.mysql.com/downloads/installer/) and create Schema:
    * Inside MySQL CLI run:
    * `CREATE DATABASE nastajus_wvchallenge_db;`
    * `CREATE USER 'nastajus_wvchallenge_user'@'localhost' IDENTIFIED BY 'nastajus_wvchallenge_pass';`
    * `GRANT ALL PRIVILEGES ON *.* TO 'nastajus_wvchallenge_user'@'localhost' WITH GRANT OPTION;`
    * test db connection works by running `/index.js` without error, proving this connects
1. run [sequelize-cli](https://github.com/sequelize/cli#sequelizecli---) migration
    * Inside this folder run:
    * `node_modules/.bin/sequelize db:migrate`

# Useful commands

* optional clean up commands:
    * `node_modules/.bin/sequelize db:migrate`
    * `node_modules/.bin/sequelize db:migrate:undo`
    * `node_modules/.bin/sequelize db:seed:all`
    * ~~`node_modules/.bin/sequelize db:seed:undo`    *(TBD)*~~

* reset all tables  with this all-in-one command (my favourite):
    * `node_modules/.bin/sequelize db:migrate:undo; node_modules/.bin/sequelize db:migrate:undo; node_modules/.bin/sequelize db:migrate;`
        * **migrate:undo** - done twice, since there's two migration files.
        * **migrate** - done once, since it applies them all.

# RESTful API

### **currently**

    GET  /
show landing page, with browse button

    POST /api/file
file upload of expenses in known CSV format. redirects to `/api/employees`

    GET  /api/employee
list all employees

    GET  /api/employee/:empId/expenses
list all expenses for a specific employee ID

    GET  /api/expenses
list all expenses 

    GET  /api/expenses/dates
list expense summaries grouped by month (potentially rename)

    GET  /api/expenses/dates/:year/:month
lists an aggregation of expenses per selected month

    GET  /api/expenses/category/:urlEncodedCategory
list all expenses with matching category

    GET  /api/expenses/description/:urlEncodedDescription
list all expenses with matching description

*NOTE: endpoints that use `:identifiers` can be accessed sometimes via clicking certain column fields.*


### **considering**
    POST /api/employee
    POST /api/employee/:empId
    GET  /api/employee/:empId
    GET  /api/employee/:empId/expenses/:expId

*NOTE: None of these are required.*

# Opinion on Challenge

Having worked with all these technologies & concepts [for several years at Paymentus](https://www.linkedin.com/in/nastajus/), I simply hadn't put them all together until now, from beginning to end. It was a very rewarding process overall. To keep things interesting I decided to jump head-first into an area I had less experience with and yet conceivably would deploy faster: Node.js. With the bulk of that experience in Java, it was a fun experience, where I resolved many challenges.

Learned a variety of technologies: node package management, various JavaScript coding quirks & it's various built-in libraries, some differences between IDEs Jetbrains WebStorm vs. Microsoft's VSCode, that TypeScript resolves down regular JavaScript and can enhance IDE static checking but not dynamic checking, how promises have evolved from libraries into defacto language constructs over the last few years, and probably dozens of other details.

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


## Explanations:
1. Absolutely!
1. Employees & Expenses seem like a very logical initial separation. I considered following with a higher level abstraction such as Reports, but recalculating this on-demand seems sufficient for now. The value in persisting such results with a small data set isn't worthwhile, however performance at scale could benefit from storing those results. I have established a basic relationship with unique identifiers such as auto-incrementing integers, so an expense must reference an existing employee.
1. **Folders:** I tried to follow standard hierarchical layouts to isolate various files. Many subfolders were either imposed or conventionally used due to each library's design. Sometime I didn't know where to ideally put things, so I just made a root-level sub-folder to isolate them. **Code:** The root `/index.js` was too large so I isolated some of the Routers into separate files. Any endpoint accessing just an `:identifier` was put into the same file.
1. Absolutely!


## Lessons Learned
### JavaScript
* Initially I began with assumptions of JavaScript I didn't realize I had, until I began trying to treat it in familiar ways like Java. For example I assumed variable references would *pass by reference*, which is typically not the case. However I've learned I can achieve that affect with arrays [here](https://stackoverflow.com/questions/5865094/how-can-i-store-reference-to-a-variable-within-an-array), so I intend to leverage that in my designs.
* Having chosen to implement this in Nodejs despite a Java background, the nature of nested JavasScript function calls when designing the MVP seems quite flat & non-modular to me. For example nesting validation logic inside the middleware callback, or having all possible HTTP Request endpoints in one file seems unusual to me.
* Used a padding trick with `.slice( negative )` from [here](http://www.codigomanso.com/en/2010/07/simple-javascript-formatting-zero-padding/).

### Databases
* The middleware driver/library selected to connect to the underlying database affects your code significantly. The core body implementations of all routers are just massive blocks of Sequelize API code.
* Table names are case-sensitive depending on your system, per [here](https://stackoverflow.com/questions/2009005/are-column-and-table-name-case-sensitive-in-mysql), noticed while setting up Sequelize & double-checking.



## Decisions Made

### JavaScript
* Considered using **[chaining](https://schier.co/blog/2013/11/14/method-chaining-in-javascript.html)**, but decided to design for now using a single method `Loggable.print()` over chaining multiple smaller methods, as advised by the [rule of threes](https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming)) and to keep as lightweight as possible for reading. 
    * Considered again to use **chaining** so I could perform mutations on objects to factor out often-repeating code in my various router queries like `toLocaleString`, but I [didn't arrive at](https://stackoverflow.com/questions/14034180/why-is-extending-native-objects-a-bad-practice) a satisfactory justification for extending `String` object to my own whims. 
* Chose to accept slight performance hit by nesting `Employee.build` inside `expenseItemsFile.forEach`, due to the simplicity. This causes every row to hit the database individually, instead of in bulk all at once. Ideally this would be reversed by using **promises**.
    * This has led to the occasional async error being thrown: `Unhandled rejection SequelizeUniqueConstraintError: Validation error`, causing the loss of those few data points during upload. *(TODO: fix obviously.)*
* Applied correct standard of adding properties to object by iterating and checking for `hasOwnProperty` as shown [here](https://stackoverflow.com/questions/500504/why-is-using-for-in-with-array-iteration-a-bad-idea/4261096#4261096).
* Used an **[IIFE](https://stackoverflow.com/questions/8228281/what-is-the-function-construct-in-javascript)** in a **named function** `appendLogFile` inside `print`

### Database
* Made `employee.name` be a unique key requirement with `unique: true`, and to lookup existing employee name and if found, access the matching employee ID `employee.empId` to reuse. Ideally I'd use an aggregate of the unique keys of both employee name and employee address, but it's not immediately obvious to me how to do this in Sequelize, so I'm not bothering.
* Used ORM's API as much as was reasonably possible, until the complexity of the query became too obtuse to bother with. Used **raw query** instead to access `/expenses/dates` on a monthly basis. Ideally mixing different levels of abstraction such as this would be minimized for long-term maintainability, however for an MVP prototype this is fine.
* Originally considered generating unique IDs in-JavaScript, but quickly discarded that idea. The database should be solely responsible for that. Briefly experimented with creating a static variable counter from Java as applied in a JavaScript context, such as mentioned [here](https://stackoverflow.com/questions/1535631/static-variables-in-javascript).

### Templating
* The path that references the CSS file needed to be statically accessible, since some templates would render at different directory depths. Designated with `app.use(express.static(path.resolve('./styles')));` and referenced in-EJS templates with `/styles.css` as if directly from the base URL.

### Design
* Chose to prevent duplicate employees from hitting database, but allow duplicate expenses from file upload. For a coding challenge, it wasn't worth going into deeper business rules.  I simply wanted to demonstrate awareness of such a requirement. A proper solution might also include logic to prevent expense duplicates.
* Originally I planned to use a low level library like `knex`, to avoid learning unnecessary abstraction layer. However when I realized the model would not be clearly exposed through the main server language, JavaScript, I moved onto learning an ORM library like `Sequelize`. My original intention to stick with purely familiar SQL queries somewhat breaks one of the wave challenge requirements to easily show the model, perhaps for only my own subjective requirement that this project be setup as much as possible via a single interface, namely `npm`/`node`/`JavaScript`. I am appreciating the ease provided by this level of abstraction.
* Chose to use a [template engine](https://expressjs.com/en/guide/using-template-engines.html) so I could iterate through data returned from queries to present in a simple table format. Chose [EJS](http://www.embeddedjs.com/) since it was the most familiar.
* Minimal front-end.
* Minimal libraries. 
* Originally planned to have the front-end issue HTTP requests from the simple yet limiting `<form method="POST" ..>` only instead of using the more versatile `XMLHttpRequest` object in potentially dozens of lines of code. If this project were to continue, I'd merely displaying the results of the expenses uploaded, by providing in-page editing directly, per-expense, per-employee, etc. In which case, it would permit a wider Restful API of full CRUD, supporting GET POST PUT and DELETE.

### Coding
* Interestingly, I've resorted to formatting database output in two different ways. I'd very much prefer to standardize into either using fully the Sequelize API, or fully using native JavaScript, but both have proven uncooperative. At least these are both done on the backend. (TODO: normalize these).
    * One by modifying `attribute` parameters like so: `[sequelize.fn('date_format', sequelize.col('date'), '%Y-%m-%d'), 'date']]`
    * The other by modifying with raw JavaScript like so: `expense.preTaxAmount = expense.preTaxAmount.toLocaleString('en-US', { minimumFractionDigits: 2 });`
