// Feature: validación de formularios — lógica pura, fácil de testear.

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_SPECIAL = new Set("!@#$%^&*()-_=+[]{};:,.<>?/\\|~`");

export function validateEmail(email) {
  if (!email.trim()) {
    throw new ValidationError('El email es obligatorio');
  }
  if (email !== email.trim()) {
    throw new ValidationError('El email no puede contener espacios');
  }
  if (!EMAIL_REGEX.test(email)) {
    throw new ValidationError('El email no tiene un formato válido');
  }
  return true;
}

export function validateUsername(username) {
  if (!username.trim()) {
    throw new ValidationError('El nombre de usuario es obligatorio');
  }
  if (username.length < USERNAME_MIN_LENGTH) {
    throw new ValidationError(
      `El nombre de usuario debe tener al menos ${USERNAME_MIN_LENGTH} caracteres`
    );
  }
  if (username.length > USERNAME_MAX_LENGTH) {
    throw new ValidationError(
      `El nombre de usuario no puede superar ${USERNAME_MAX_LENGTH} caracteres`
    );
  }
  if (!USERNAME_REGEX.test(username)) {
    throw new ValidationError(
      'Solo se permiten letras, números, guiones y guiones bajos (caracteres válidos: a-z, 0-9, -, _)'
    );
  }
  return true;
}

export function validatePassword(password) {
  if (!password) {
    throw new ValidationError('La contraseña es obligatoria');
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new ValidationError(
      `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`
    );
  }
  if (!/[A-Z]/.test(password)) {
    throw new ValidationError('La contraseña debe tener al menos una mayúscula');
  }
  if (!/[a-z]/.test(password)) {
    throw new ValidationError('La contraseña debe tener al menos una minúscula');
  }
  if (!/[0-9]/.test(password)) {
    throw new ValidationError('La contraseña debe tener al menos un número');
  }
  if (![...password].some((c) => PASSWORD_SPECIAL.has(c))) {
    throw new ValidationError('La contraseña debe tener al menos un carácter especial');
  }
  return true;
}

// Devuelve { campo: mensaje } por cada campo inválido; {} si todo es válido.
export function validateForm(username, email, password) {
  const errors = {};
  const checks = [
    ['username', validateUsername, username],
    ['email', validateEmail, email],
    ['password', validatePassword, password],
  ];
  for (const [field, rule, value] of checks) {
    try {
      rule(value);
    } catch (err) {
      if (err instanceof ValidationError) {
        errors[field] = err.message;
      } else {
        throw err;
      }
    }
  }
  return errors;
}