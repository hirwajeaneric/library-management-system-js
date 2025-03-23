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
    br.due_date
FROM "BorrowRecord" br
JOIN "User" u ON br."userId" = u.id
JOIN "Book" b ON br."bookId" = b.id
WHERE br.status = 'BORROWED'
AND br.due_date < CURRENT_TIMESTAMP;