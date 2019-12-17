interface ErrorDescriptor {
  code: number | string;
  message: string;
  description: string;
}

interface MainError extends ErrorDescriptor {
  errors: ErrorDescriptor[];
}

export abstract class BusinessException extends Error {
  constructor(private readonly status: number, private readonly code: string, public readonly message: string, private readonly errors?) {
    super();
  }

  public getStatus(): number {
    return this.status;
  }

  public getCode(): string {
    return this.code;
  }

  public getMessage(): string {
    return this.message;
  }

  public getErrors() {
    return this.errors;
  }

  public toHttpException() {
    const envelop = {
      code: this.code,
      message: this.message,
      errors: this.errors,
    };
    return envelop;
  }
}
