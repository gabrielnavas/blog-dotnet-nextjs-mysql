export class UnauthorizedException extends Error {
  constructor(message: string = 'Você não está autorizado para fazer isso.') {
    super(message);
  }
}

export class BadRequestException extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundException extends Error {
  constructor(message: string) {
    super(message);
  }
}
