export class ErrorGeneral extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

export class BadRequest extends ErrorGeneral {
  constructor(message: string, status = 400) {
    super(message, status);
  }
}
