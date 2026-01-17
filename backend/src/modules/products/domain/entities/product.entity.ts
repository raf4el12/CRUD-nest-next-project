export class Product {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly description: string | null,
    readonly price: number,
    readonly image: string | null,
    readonly isAvailable: boolean,
    readonly deletedAt: Date | null,
    readonly categoryId: number | null,
    readonly createdAt: Date,
    readonly updatedAt: Date | null,
  ) {}
}
