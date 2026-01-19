export class Profile {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly phone: string | null,
    public readonly photo: string | null,
    public readonly documentType: string | null,
    public readonly documentNumber: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
