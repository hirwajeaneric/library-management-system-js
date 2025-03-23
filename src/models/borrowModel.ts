import { PrismaClient, BorrowStatus } from '@prisma/client';

export class BorrowModel {
  public prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async borrowBook(userId: number, bookId: number) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks
    return this.prisma.$transaction(async (tx) => {
      const userBorrows = await tx.borrowRecord.count({
        where: { userId, status: BorrowStatus.BORROWED }
      });
      if (userBorrows >= 3) throw new Error('Max borrow limit reached');

      const book = await tx.book.findUnique({ where: { id: bookId } });
      if (!book || book.availableCopies <= 0) throw new Error('Book unavailable');

      await tx.book.update({
        where: { id: bookId },
        data: { availableCopies: book.availableCopies - 1 }
      });

      return tx.borrowRecord.create({
        data: { userId, bookId, dueDate, status: BorrowStatus.BORROWED }
      });
    });
  }

  async returnBook(recordId: number) {
    return this.prisma.$transaction(async (tx) => {
      const record = await tx.borrowRecord.findUnique({ where: { id: recordId } });
      if (!record || record.status !== BorrowStatus.BORROWED) throw new Error('Invalid borrow record');

      const now = new Date();
      const status = record.dueDate < now ? BorrowStatus.OVERDUE : BorrowStatus.RETURNED;

      await tx.book.update({
        where: { id: record.bookId },
        data: { availableCopies: { increment: 1 } }
      });

      return tx.borrowRecord.update({
        where: { id: recordId },
        data: { returnDate: now, status }
      });
    });
  }

  async getUserHistory(userId: number, page: number, size: number) {
    return this.prisma.borrowRecord.findMany({
      where: { userId },
      skip: page * size,
      take: size,
      orderBy: { borrowDate: 'desc' }
    });
  }
}