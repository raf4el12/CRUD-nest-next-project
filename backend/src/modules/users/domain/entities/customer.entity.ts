export class Customer {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly points: number,
    public readonly level: string,
    public readonly newsletter: boolean,
    public readonly shippingAddress: string | null,
    public readonly billingAddress: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
