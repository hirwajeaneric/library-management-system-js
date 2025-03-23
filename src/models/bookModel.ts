import { PrismaClient } from '@prisma/client';

export class BookModel {
  public prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createBook(title: string, author: string, isbn: string, totalCopies: number) {
    return this.prisma.book.create({
      data: { title, author, isbn, totalCopies, availableCopies: totalCopies }
    });
  }
}