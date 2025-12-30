// js/core/errors.js
export class AppError extends Error {
  constructor(message, meta = {}) {
    super(message);
    this.name = 'AppError';
    this.meta = meta;
  }
}

export class MigrationError extends AppError {
  constructor(message, meta) {
    super(message);
    this.name = 'MigrationError';
    this.meta = meta;
  }
}
