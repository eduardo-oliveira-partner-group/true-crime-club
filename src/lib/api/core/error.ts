export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string | number,
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}
