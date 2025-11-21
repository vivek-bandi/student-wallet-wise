# System Analysis and UML Diagrams
## Student Wallet Wise - Expense Tracker Application

---

## 6.1 Use Case Diagram

```plantuml
@startuml
left to right direction
skinparam packageStyle rectangle

actor Student as student
actor "Unauthenticated User" as guest

rectangle "Student Wallet Wise System" {
  ' Guest Use Cases
  usecase "View Home Page" as UC1
  usecase "Register Account" as UC2
  usecase "Login" as UC3
  
  ' Student Use Cases
  usecase "View Dashboard" as UC4
  usecase "Add Expense" as UC5
  usecase "Edit Expense" as UC6
  usecase "Delete Expense" as UC7
  usecase "View Expenses" as UC8
  usecase "Filter by Category" as UC9
  usecase "Sort Expenses" as UC10
  usecase "Set Budget" as UC11
  usecase "View Budget Status" as UC12
  usecase "Manage Categories" as UC13
  usecase "Add Category" as UC14
  usecase "View Statistics" as UC15
  usecase "View Spending Trends" as UC16
  usecase "Setup Recurring Expense" as UC17
  usecase "Manage Recurring Expenses" as UC18
  usecase "Logout" as UC19
  usecase "Export Data" as UC20
}

' Guest connections
guest --> UC1
guest --> UC2
guest --> UC3

' Student connections
student --> UC4
student --> UC5
student --> UC6
student --> UC7
student --> UC8
student --> UC9
student --> UC10
student --> UC11
student --> UC12
student --> UC13
student --> UC14
student --> UC15
student --> UC16
student --> UC17
student --> UC18
student --> UC19
student --> UC20

' Relationships
UC8 ..> UC9 : <<include>>
UC8 ..> UC10 : <<include>>
UC12 ..> UC11 : <<extends>>
UC13 ..> UC14 : <<include>>
UC15 ..> UC16 : <<include>>

@enduml
```

---

## 6.2 Class Diagram

```plantuml
@startuml
skinparam classAttributeIconSize 0

class User {
  - _id: ObjectId
  - email: string
  - passwordHash: string
  - name: string
  - createdAt: Date
  --
  + register(): Promise<User>
  + login(): Promise<string>
  + validatePassword(password: string): boolean
  + generateAuthToken(): string
}

class Expense {
  - _id: ObjectId
  - userId: ObjectId
  - description: string
  - category: string
  - amount: number
  - date: Date
  - createdAt: Date
  --
  + create(): Promise<Expense>
  + update(): Promise<Expense>
  + delete(): Promise<void>
  + findByUser(userId: ObjectId): Promise<Expense[]>
  + findByCategory(category: string): Promise<Expense[]>
  + findByDateRange(start: Date, end: Date): Promise<Expense[]>
}

class Budget {
  - _id: ObjectId
  - userId: ObjectId
  - month: string
  - amount: number
  - createdAt: Date
  --
  + create(): Promise<Budget>
  + update(): Promise<Budget>
  + findByUserAndMonth(userId: ObjectId, month: string): Promise<Budget>
  + getBudgetStatus(): Promise<Object>
}

class Category {
  - _id: ObjectId
  - userId: ObjectId
  - name: string
  - createdAt: Date
  --
  + create(): Promise<Category>
  + delete(): Promise<void>
  + findByUser(userId: ObjectId): Promise<Category[]>
  + isUnique(name: string): boolean
}

class RecurringExpense {
  - _id: ObjectId
  - userId: ObjectId
  - description: string
  - category: string
  - amount: number
  - interval: enum
  - startDate: Date
  - nextRun: Date
  - active: boolean
  - createdAt: Date
  --
  + create(): Promise<RecurringExpense>
  + update(): Promise<RecurringExpense>
  + deactivate(): Promise<void>
  + processRecurring(): Promise<void>
  + calculateNextRun(): Date
}

class AuthMiddleware {
  --
  + authenticate(req, res, next): void
  + verifyToken(token: string): Object
}

class ExpenseController {
  --
  + getExpenses(req, res): Promise<void>
  + createExpense(req, res): Promise<void>
  + updateExpense(req, res): Promise<void>
  + deleteExpense(req, res): Promise<void>
  + getExpensesByCategory(req, res): Promise<void>
}

class BudgetController {
  --
  + getBudget(req, res): Promise<void>
  + setBudget(req, res): Promise<void>
  + getBudgetStatus(req, res): Promise<void>
}

class CategoryController {
  --
  + getCategories(req, res): Promise<void>
  + createCategory(req, res): Promise<void>
  + deleteCategory(req, res): Promise<void>
}

class StatsController {
  --
  + getMonthlyStats(req, res): Promise<void>
  + getCategoryBreakdown(req, res): Promise<void>
  + getSpendingTrends(req, res): Promise<void>
}

' Relationships
User "1" -- "*" Expense : owns
User "1" -- "*" Budget : sets
User "1" -- "*" Category : creates
User "1" -- "*" RecurringExpense : manages

ExpenseController ..> Expense : uses
ExpenseController ..> AuthMiddleware : uses
BudgetController ..> Budget : uses
BudgetController ..> AuthMiddleware : uses
CategoryController ..> Category : uses
CategoryController ..> AuthMiddleware : uses
StatsController ..> Expense : uses
StatsController ..> Budget : uses
StatsController ..> AuthMiddleware : uses

@enduml
```

---

## 6.3 Sequence Diagram - User Registration

```plantuml
@startuml
actor Student
participant "React App" as Frontend
participant "Express Server" as Backend
participant "Auth Controller" as AuthCtrl
participant "User Model" as UserModel
database "MongoDB" as DB

Student -> Frontend: Fill registration form
activate Frontend

Frontend -> Frontend: Validate input
Frontend -> Backend: POST /api/auth/register\n{email, password, name}
activate Backend

Backend -> AuthCtrl: register(req, res)
activate AuthCtrl

AuthCtrl -> AuthCtrl: Validate request data
AuthCtrl -> UserModel: Check if user exists
activate UserModel

UserModel -> DB: findOne({email})
activate DB
DB --> UserModel: null (user not found)
deactivate DB

UserModel --> AuthCtrl: User doesn't exist
deactivate UserModel

AuthCtrl -> AuthCtrl: Hash password with bcrypt

AuthCtrl -> UserModel: Create new user
activate UserModel

UserModel -> DB: save(user)
activate DB
DB --> UserModel: Created user document
deactivate DB

UserModel --> AuthCtrl: User created
deactivate UserModel

AuthCtrl -> AuthCtrl: Generate JWT token
AuthCtrl --> Backend: {token, user}
deactivate AuthCtrl

Backend --> Frontend: 201 Created\n{token, user}
deactivate Backend

Frontend -> Frontend: Store token in localStorage
Frontend -> Frontend: Redirect to dashboard
Frontend --> Student: Registration successful
deactivate Frontend

@enduml
```

---

## 6.4 Sequence Diagram - Add Expense

```plantuml
@startuml
actor Student
participant "React App" as Frontend
participant "Auth Middleware" as Auth
participant "Express Server" as Backend
participant "Expense Controller" as ExpenseCtrl
participant "Expense Model" as ExpenseModel
database "MongoDB" as DB

Student -> Frontend: Enter expense details
activate Frontend

Frontend -> Frontend: Validate form data
Frontend -> Backend: POST /api/expenses\nAuthorization: Bearer token\n{description, category, amount, date}
activate Backend

Backend -> Auth: Verify JWT token
activate Auth
Auth -> Auth: Decode token
Auth --> Backend: User authenticated (userId)
deactivate Auth

Backend -> ExpenseCtrl: createExpense(req, res)
activate ExpenseCtrl

ExpenseCtrl -> ExpenseCtrl: Validate expense data
ExpenseCtrl -> ExpenseModel: Create expense
activate ExpenseModel

ExpenseModel -> DB: save({userId, description, category, amount, date})
activate DB
DB --> ExpenseModel: Expense document created
deactivate DB

ExpenseModel --> ExpenseCtrl: Expense saved
deactivate ExpenseModel

ExpenseCtrl --> Backend: {expense}
deactivate ExpenseCtrl

Backend --> Frontend: 201 Created\n{expense}
deactivate Backend

Frontend -> Frontend: Update expense list
Frontend -> Frontend: Recalculate totals
Frontend --> Student: Expense added successfully
deactivate Frontend

@enduml
```

---

## 6.5 Sequence Diagram - View Budget Status

```plantuml
@startuml
actor Student
participant "React App" as Frontend
participant "Auth Middleware" as Auth
participant "Express Server" as Backend
participant "Budget Controller" as BudgetCtrl
participant "Budget Model" as BudgetModel
participant "Expense Model" as ExpenseModel
database "MongoDB" as DB

Student -> Frontend: Navigate to Dashboard
activate Frontend

Frontend -> Backend: GET /api/budgets/status?month=2024-01\nAuthorization: Bearer token
activate Backend

Backend -> Auth: Verify JWT token
activate Auth
Auth --> Backend: User authenticated (userId)
deactivate Auth

Backend -> BudgetCtrl: getBudgetStatus(req, res)
activate BudgetCtrl

BudgetCtrl -> BudgetModel: findOne({userId, month})
activate BudgetModel
BudgetModel -> DB: findOne query
activate DB
DB --> BudgetModel: Budget document
deactivate DB
BudgetModel --> BudgetCtrl: budget
deactivate BudgetModel

BudgetCtrl -> ExpenseModel: aggregate expenses for month
activate ExpenseModel
ExpenseModel -> DB: aggregate query
activate DB
DB --> ExpenseModel: Total spent
deactivate DB
ExpenseModel --> BudgetCtrl: totalSpent
deactivate ExpenseModel

BudgetCtrl -> BudgetCtrl: Calculate remaining\n= budget - spent
BudgetCtrl -> BudgetCtrl: Calculate percentage\n= (spent/budget) * 100

BudgetCtrl --> Backend: {budget, spent, remaining, percentage}
deactivate BudgetCtrl

Backend --> Frontend: 200 OK\n{budget, spent, remaining, percentage}
deactivate Backend

Frontend -> Frontend: Render budget visualization
Frontend --> Student: Display budget status
deactivate Frontend

@enduml
```

---

## 6.6 Activity Diagram - Expense Management Flow

```plantuml
@startuml
start

:User opens application;

if (User authenticated?) then (no)
  :Redirect to login page;
  :User enters credentials;
  :Authenticate user;
  if (Valid credentials?) then (no)
    :Show error message;
    stop
  else (yes)
    :Generate JWT token;
    :Store token in localStorage;
  endif
else (yes)
  :Verify token;
endif

:Load dashboard;

fork
  :Fetch expenses;
fork again
  :Fetch budget data;
fork again
  :Fetch categories;
fork again
  :Calculate statistics;
end fork

:Display dashboard;

repeat
  :User performs action;
  
  if (Action type?) then (Add Expense)
    :Show expense form;
    :User fills details;
    :Validate input;
    if (Valid?) then (yes)
      :Submit to API;
      :Save to database;
      :Update UI;
    else (no)
      :Show validation errors;
    endif
    
  elseif (Set Budget) then
    :Show budget form;
    :User enters amount;
    :Validate amount;
    if (Valid?) then (yes)
      :Submit to API;
      :Save budget;
      :Update UI;
    else (no)
      :Show error;
    endif
    
  elseif (View Statistics) then
    :Fetch statistics data;
    :Calculate trends;
    :Generate charts;
    :Display statistics;
    
  elseif (Filter/Sort) then
    :Apply filters;
    :Sort expenses;
    :Update expense list;
    
  elseif (Manage Categories) then
    :Show categories;
    if (Add or Delete?) then (Add)
      :Create new category;
      :Save to database;
    else (Delete)
      :Confirm deletion;
      :Remove category;
    endif
    
  else (Logout)
    :Clear localStorage;
    :Redirect to home;
    stop
  endif

repeat while (Continue using app?) is (yes)

:Logout;

stop

@enduml
```

---

## 6.7 Component Diagram

```plantuml
@startuml
package "Frontend Layer" {
  [React Application] as ReactApp
  
  package "Pages" {
    [Home Page] as Home
    [Login Page] as Login
    [Register Page] as Register
    [Dashboard] as Dashboard
    [Statistics] as Stats
  }
  
  package "Components" {
    [Expense Form] as ExpenseForm
    [Expense List] as ExpenseList
    [Budget Widget] as BudgetWidget
    [Category Manager] as CategoryMgr
    [Charts] as Charts
  }
  
  package "Context" {
    [Auth Context] as AuthContext
    [Expense Context] as ExpenseContext
  }
  
  package "Services" {
    [API Service] as APIService
    [Auth Service] as AuthService
  }
}

package "Backend Layer" {
  [Express Server] as Express
  
  package "Routes" {
    [Auth Routes] as AuthRoutes
    [Expense Routes] as ExpenseRoutes
    [Budget Routes] as BudgetRoutes
    [Category Routes] as CategoryRoutes
    [Stats Routes] as StatsRoutes
  }
  
  package "Middleware" {
    [Auth Middleware] as AuthMW
    [Error Handler] as ErrorMW
  }
  
  package "Controllers" {
    [Auth Controller] as AuthController
    [Expense Controller] as ExpenseController
    [Budget Controller] as BudgetController
    [Category Controller] as CategoryController
    [Stats Controller] as StatsController
  }
  
  package "Models" {
    [User Model] as UserModel
    [Expense Model] as ExpenseModel
    [Budget Model] as BudgetModel
    [Category Model] as CategoryModel
    [Recurring Expense Model] as RecurringModel
  }
  
  package "Config" {
    [Database Config] as DBConfig
    [Environment Config] as EnvConfig
  }
}

database "MongoDB" {
  [Users Collection] as UsersDB
  [Expenses Collection] as ExpensesDB
  [Budgets Collection] as BudgetsDB
  [Categories Collection] as CategoriesDB
  [Recurring Expenses Collection] as RecurringDB
}

' Frontend Internal Connections
ReactApp --> Home
ReactApp --> Login
ReactApp --> Register
ReactApp --> Dashboard
Dashboard --> ExpenseForm
Dashboard --> ExpenseList
Dashboard --> BudgetWidget
Dashboard --> CategoryMgr
Dashboard --> Stats
Stats --> Charts

ReactApp --> AuthContext
ReactApp --> ExpenseContext
AuthContext --> AuthService
ExpenseContext --> APIService
APIService --> Express
AuthService --> Express

' Backend Internal Connections
Express --> AuthRoutes
Express --> ExpenseRoutes
Express --> BudgetRoutes
Express --> CategoryRoutes
Express --> StatsRoutes

AuthRoutes --> AuthMW
ExpenseRoutes --> AuthMW
BudgetRoutes --> AuthMW
CategoryRoutes --> AuthMW
StatsRoutes --> AuthMW

AuthRoutes --> AuthController
ExpenseRoutes --> ExpenseController
BudgetRoutes --> BudgetController
CategoryRoutes --> CategoryController
StatsRoutes --> StatsController

AuthController --> UserModel
ExpenseController --> ExpenseModel
BudgetController --> BudgetModel
CategoryController --> CategoryModel
StatsController --> ExpenseModel
StatsController --> BudgetModel

Express --> ErrorMW
Express --> DBConfig
DBConfig --> EnvConfig

' Database Connections
UserModel --> UsersDB
ExpenseModel --> ExpensesDB
BudgetModel --> BudgetsDB
CategoryModel --> CategoriesDB
RecurringModel --> RecurringDB

@enduml
```

---

## 6.8 Deployment Diagram

```plantuml
@startuml
node "Client Device" {
  [Web Browser] as Browser
}

node "Vercel (Frontend Host)" {
  [React Application\n(Static Files)] as ReactApp
}

node "Render (Backend Host)" {
  [Node.js Runtime] as NodeJS
  [Express Server] as ExpressServer
  
  NodeJS --> ExpressServer
}

cloud "MongoDB Atlas" {
  database "MongoDB Cluster" as MongoDB {
    [users]
    [expenses]
    [budgets]
    [categories]
    [recurringExpenses]
  }
}

package "External Services" {
  [JWT Authentication] as JWT
  [bcrypt Password Hashing] as bcrypt
}

' Connections
Browser --> ReactApp : HTTPS
Browser --> ExpressServer : HTTPS\nREST API
ReactApp --> ExpressServer : API Calls
ExpressServer --> MongoDB : TCP/IP\nMongoDB Protocol
ExpressServer --> JWT : Token Generation
ExpressServer --> bcrypt : Password Hashing

note right of ReactApp
  - Static hosting
  - CDN delivery
  - Environment: Production
end note

note right of ExpressServer
  - Port: 5000
  - Environment: Production
  - CORS enabled
  - API Base: /api
end note

note bottom of MongoDB
  - Cloud hosted
  - Automated backups
  - Scalable storage
end note

@enduml
```

---

## 6.9 State Diagram - User Authentication State

```plantuml
@startuml
[*] --> Unauthenticated

Unauthenticated --> Registering : Click Register
Unauthenticated --> LoggingIn : Click Login

Registering --> Unauthenticated : Cancel
Registering --> Validating : Submit Form
Validating --> Registering : Validation Failed
Validating --> CreatingAccount : Valid Data

CreatingAccount --> ErrorState : Server Error
CreatingAccount --> Authenticated : Account Created

LoggingIn --> Unauthenticated : Cancel
LoggingIn --> Authenticating : Submit Credentials
Authenticating --> LoggingIn : Invalid Credentials
Authenticating --> Authenticated : Valid Credentials

Authenticated --> Active : Token Valid
Active --> RefreshingToken : Token Expiring Soon
RefreshingToken --> Active : Token Refreshed
RefreshingToken --> Unauthenticated : Refresh Failed

Active --> Unauthenticated : Logout
Active --> SessionExpired : Token Expired
SessionExpired --> Unauthenticated : Return to Login

ErrorState --> Unauthenticated : Retry

note right of Authenticated
  JWT token stored
  User data loaded
end note

note right of Active
  Can access:
  - Dashboard
  - Expenses
  - Budget
  - Statistics
end note

@enduml
```

---

## 6.10 State Diagram - Expense Management State

```plantuml
@startuml
[*] --> ViewingExpenses

ViewingExpenses --> AddingExpense : Click Add
ViewingExpenses --> EditingExpense : Click Edit
ViewingExpenses --> DeletingExpense : Click Delete
ViewingExpenses --> FilteringExpenses : Apply Filter
ViewingExpenses --> SortingExpenses : Apply Sort

AddingExpense --> ValidatingInput : Submit Form
ValidatingInput --> AddingExpense : Validation Error
ValidatingInput --> SavingExpense : Valid Input

SavingExpense --> ViewingExpenses : Save Successful
SavingExpense --> ErrorState : Save Failed

EditingExpense --> ValidatingInput : Update Form
EditingExpense --> ViewingExpenses : Cancel

DeletingExpense --> ConfirmingDelete : Show Confirmation
ConfirmingDelete --> DeletingFromDB : Confirm
ConfirmingDelete --> ViewingExpenses : Cancel

DeletingFromDB --> ViewingExpenses : Delete Successful
DeletingFromDB --> ErrorState : Delete Failed

FilteringExpenses --> ViewingExpenses : Filter Applied
SortingExpenses --> ViewingExpenses : Sort Applied

ErrorState --> ViewingExpenses : Dismiss Error

note right of ViewingExpenses
  Display list of expenses
  with current filters/sorts
end note

note right of ValidatingInput
  Check:
  - Amount > 0
  - Category exists
  - Date valid
  - Description present
end note

@enduml
```

---

## 6.11 Entity Relationship Diagram

```plantuml
@startuml
entity "User" as user {
  * _id : ObjectId <<PK>>
  --
  * email : String <<unique>>
  * passwordHash : String
  * name : String
  * createdAt : Date
}

entity "Expense" as expense {
  * _id : ObjectId <<PK>>
  --
  * userId : ObjectId <<FK>>
  * description : String
  * category : String
  * amount : Number
  * date : Date
  * createdAt : Date
}

entity "Budget" as budget {
  * _id : ObjectId <<PK>>
  --
  * userId : ObjectId <<FK>>
  * month : String
  * amount : Number
  * createdAt : Date
}

entity "Category" as category {
  * _id : ObjectId <<PK>>
  --
  * userId : ObjectId <<FK>>
  * name : String
  * createdAt : Date
}

entity "RecurringExpense" as recurring {
  * _id : ObjectId <<PK>>
  --
  * userId : ObjectId <<FK>>
  * description : String
  * category : String
  * amount : Number
  * interval : Enum
  * startDate : Date
  * nextRun : Date
  * active : Boolean
  * createdAt : Date
}

user ||--o{ expense : "has many"
user ||--o{ budget : "sets"
user ||--o{ category : "creates"
user ||--o{ recurring : "manages"

note right of user
  Primary entity
  Authentication required
end note

note bottom of expense
  Core transaction record
  Linked to categories
end note

note bottom of budget
  Monthly budget tracking
  Unique per user per month
end note

note bottom of recurring
  Automated expense creation
  Intervals: daily, weekly, monthly
end note

@enduml
```

---

## System Architecture Overview

### 6.12 Technology Stack

**Frontend:**
- React 18 with TypeScript
- Vite as build tool
- Tailwind CSS for styling
- React Router for navigation
- Context API for state management
- Axios for API communication

**Backend:**
- Node.js with Express.js
- TypeScript for type safety
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing

**Deployment:**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

### 6.13 API Endpoints

**Authentication Endpoints:**
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

**Expense Endpoints:**
- GET `/api/expenses` - Get all expenses (filtered, sorted)
- POST `/api/expenses` - Create new expense
- PUT `/api/expenses/:id` - Update expense
- DELETE `/api/expenses/:id` - Delete expense

**Budget Endpoints:**
- GET `/api/budgets` - Get budget for month
- POST `/api/budgets` - Set budget
- GET `/api/budgets/status` - Get budget status with spending

**Category Endpoints:**
- GET `/api/categories` - Get all categories
- POST `/api/categories` - Create category
- DELETE `/api/categories/:id` - Delete category

**Statistics Endpoints:**
- GET `/api/stats/monthly` - Get monthly statistics
- GET `/api/stats/category` - Get category breakdown
- GET `/api/stats/trends` - Get spending trends

**Recurring Expense Endpoints:**
- GET `/api/recurring` - Get all recurring expenses
- POST `/api/recurring` - Create recurring expense
- PUT `/api/recurring/:id` - Update recurring expense
- DELETE `/api/recurring/:id` - Delete recurring expense

---

## 6.14 Security Measures

1. **Authentication**: JWT-based authentication with secure token storage
2. **Password Security**: bcrypt hashing with salt rounds
3. **Authorization**: Middleware to verify user access to resources
4. **Input Validation**: Server-side validation for all inputs
5. **CORS**: Configured CORS for cross-origin requests
6. **Environment Variables**: Sensitive data stored in environment variables
7. **HTTPS**: Secure communication in production
8. **Database Security**: MongoDB connection with authentication

---

## 6.15 Database Indexes

```javascript
// User Collection
{ email: 1 } // Unique index for fast login lookup

// Expense Collection
{ userId: 1, date: -1 } // Compound index for user expenses sorted by date

// Budget Collection
{ userId: 1, month: 1 } // Unique compound index

// Category Collection
{ userId: 1, name: 1 } // Unique compound index

// RecurringExpense Collection
{ userId: 1, active: 1 } // Index for active recurring expenses
```

---

## Notes

To visualize these PlantUML diagrams:
1. Use online tools like PlantText (www.planttext.com)
2. Use VS Code with PlantUML extension
3. Use IntelliJ IDEA with PlantUML plugin
4. Use command-line PlantUML with Java

Each diagram provides a different perspective of the Student Wallet Wise system, helping understand the architecture, data flow, user interactions, and system components.
