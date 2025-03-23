# Library Management System (JS)

A TypeScript-based library management system using Express.js and PostgreSQL.

## Features

- Roles: ADMIN, LIBRARIAN, USER
- Borrowing: Max 3 books, 2-week deadline
- Tracking: Borrow/return activities
- Views: Borrow summary, overdue books
- Best Practices: Error handling, logging, protected routes

## Tech Stack

- Node.js 18+
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Express Validator
- JWT (cookie-based auth)

## Prerequisites

- Node.js: `node -v`
- PostgreSQL: `psql --version`
- npm: `npm -v`

## Setup

1. **Clone**:
   ```bash
   git clone <repository-url>
   cd library-management-system-js
   ```
2. **Install**
   ```bash
   npm install
   ```
3. **Set Up PostgreSQL**

   - Create `library_db`

   ```sql
   CREATE DATABASE library_db;
   ```

   - Run Prisma migration

   ```bash
   npx prisma migrate dev --name init
   ```

   - Populate initial data (run `psql -U postgres -d library_db`)

   ```sql
   INSERT INTO "User" (username, password, email, role, "createdAt", "updatedAt") VALUES
   ('admin', '$2a$10$XURP2l.4./lYRRsZPKIuO.lnXvI8eS8yQ3bM0eG5z4z5z5z5z5z5z', 'admin@example.com', 'ADMIN', NOW(), NOW()),
   ('librarian', '$2a$10$XURP2l.4./lYRRsZPKIuO.lnXvI8eS8yQ3bM0eG5z4z5z5z5z5z5z', 'librarian@example.com', 'LIBRARIAN', NOW(), NOW()),
   ('user1', '$2a$10$XURP2l.4./lYRRsZPKIuO.lnXvI8eS8yQ3bM0eG5z4z5z5z5z5z5z', 'user1@example.com', 'USER', NOW(), NOW()),
   ('user2', '$2a$10$XURP2l.4./lYRRsZPKIuO.lnXvI8eS8yQ3bM0eG5z4z5z5z5z5z5z', 'user2@example.com', 'USER', NOW(), NOW());

   INSERT INTO "Book" (title, author, isbn, "totalCopies", "availableCopies", "createdAt", "updatedAt") VALUES
   ('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 5, 4, NOW(), NOW()),
   ('To Kill a Mockingbird', 'Harper Lee', '9780446310789', 3, 2, NOW(), NOW()),
   ('1984', 'George Orwell', '9780451524935', 4, 3, NOW(), NOW()),
   ('Pride and Prejudice', 'Jane Austen', '9780141439518', 6, 5, NOW(), NOW());

   INSERT INTO "BorrowRecord" ("userId", "bookId", "borrowDate", "dueDate", "returnDate", status, "createdAt", "updatedAt") VALUES
   (3, 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '12 days', NULL, 'BORROWED', NOW(), NOW()),
   (4, 2, NOW() - INTERVAL '5 days', NOW() + INTERVAL '9 days', NULL, 'BORROWED', NOW(), NOW()),
   (3, 3, NOW() - INTERVAL '20 days', NOW() - INTERVAL '6 days', NULL, 'BORROWED', NOW(), NOW()),
   (4, 4, NOW() - INTERVAL '10 days', NOW() + INTERVAL '4 days', NOW() - INTERVAL '2 days', 'RETURNED', NOW(), NOW());
   ```

   - Create views (run `src/prisma/views.sql`)

   ```bash
   psql -U postgres -d library_db -f src/prisma/views.sql
   ```

4. Configure `.env`

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/library_db?schema=public"
JWT_SECRET="your-secret-key"
```

5. **Run**:

```bash
npm run dev
```

## Endpoints

- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Add Book: `POST /api/books` (LIBRARIAN)
- Borrow: `POST /api/borrow/borrow?userId=1&bookId=1` (LIBRARIAN)
- Return: `POST /api/borrow/return/:recordId` (LIBRARIAN)
- History: `GET /api/user/history?userId=1&page=0&size=10` (USER)
- Summary: `GET /api/borrow/summary` (LIBRARIAN)
- Overdue: `GET /api/borrow/overdue` (LIBRARIAN)

## Structure

```text
prisma/
src/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
└── index.ts
```

## Troubleshooting

- DB Connection: Check `.env` credentials.
- Auth: Ensure cookies are sent with requests.

## Contributing

Fork, branch, commit, push, PR

## Contact

- Jean Eric Hirwa
- hirwajeric@gmail.com

---

## Final Steps

1. **Insert the Data**:

   - Copy the SQL statements into your PostgreSQL client and execute them in order (`User`, `Book`, `BorrowRecord`).

   ```sql
   INSERT INTO "User" (username, password, email, role, "createdAt", "updatedAt") VALUES
   ('admin', '$2a$10$XURP2l.4./lYRRsZPKIuO.lnXvI8eS8yQ3bM0eG5z4z5z5z5z5z5z', 'admin@example.com', 'ADMIN', NOW(), NOW()),
   ('librarian', '$2a$10$XURP2l.4./lYRRsZPKIuO.lnXvI8eS8yQ3bM0eG5z4z5z5z5z5z5z', 'librarian@example.com', 'LIBRARIAN', NOW(), NOW()),
   ('user1', '$2a$10$XURP2l.4./lYRRsZPKIuO.lnXvI8eS8yQ3bM0eG5z4z5z5z5z5z5z', 'user1@example.com', 'USER', NOW(), NOW()),
   ('user2', '$2a$10$XURP2l.4./lYRRsZPKIuO.lnXvI8eS8yQ3bM0eG5z4z5z5z5z5z5z', 'user2@example.com', 'USER', NOW(), NOW());

   INSERT INTO "Book" (title, author, isbn, "totalCopies", "availableCopies", "createdAt", "updatedAt") VALUES
   ('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 5, 4, NOW(), NOW()),
   ('To Kill a Mockingbird', 'Harper Lee', '9780446310789', 3, 2, NOW(), NOW()),
   ('1984', 'George Orwell', '9780451524935', 4, 3, NOW(), NOW()),
   ('Pride and Prejudice', 'Jane Austen', '9780141439518', 6, 5, NOW(), NOW());

    INSERT INTO "BorrowRecord" ("userId", "bookId", "borrowDate", "dueDate", "returnDate", status, "createdAt", "updatedAt") VALUES
    -- Active borrow (user1 borrowed Gatsby, due in future)
    (3, 1, NOW() - INTERVAL '2 days', NOW() + INTERVAL '12 days', NULL, 'BORROWED', NOW(), NOW()),
    -- Active borrow (user2 borrowed Mockingbird, due in future)
    (4, 2, NOW() - INTERVAL '5 days', NOW() + INTERVAL '9 days', NULL, 'BORROWED', NOW(), NOW()),
    -- Overdue borrow (user1 borrowed 1984, past due)
    (3, 3, NOW() - INTERVAL '20 days', NOW() - INTERVAL '6 days', NULL, 'BORROWED', NOW(), NOW()),
    -- Returned borrow (user2 returned Prejudice)
    (4, 4, NOW() - INTERVAL '10 days', NOW() + INTERVAL '4 days', NOW() - INTERVAL '2 days', 'RETURNED', NOW(), NOW());
   ```

2. **Run `views.sql`**:

   - Execute the view creation script after the data is inserted.

   ```sql
   CREATE VIEW user_borrow_summary AS
       SELECT
           u.id AS user_id,
           u.username,
           COUNT(br.id) AS borrowed_count
       FROM "User" u
       LEFT JOIN "BorrowRecord" br
           ON u.id = br."userId"
           AND br.status = 'BORROWED'
       GROUP BY u.id, u.username;

   CREATE VIEW overdue_books AS
       SELECT
           br.id AS record_id,
           u.id AS user_id,
           u.username,
           b.id AS book_id,
           b.title,
           br."dueDate" AS due_date
       FROM "BorrowRecord" br
       JOIN "User" u ON br."userId" = u.id
       JOIN "Book" b ON br."bookId" = b.id
       WHERE br.status = 'BORROWED'
       AND br."dueDate" < CURRENT_TIMESTAMP;
   ```

3. **Start the App**:
   - Run `npm run dev` and test the endpoints (e.g., login with `admin:password123`, then use the cookie for protected routes).

This starting data provides a functional baseline to test all features, including borrowing limits, overdue tracking, and summary views! Let me know if you need adjustments or additional data.
