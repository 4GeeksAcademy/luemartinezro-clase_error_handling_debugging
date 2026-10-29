import { describe, it, expect } from 'vitest';

import {
  validateEmail,
  validateUsername,
  validatePassword,
  validateForm,
  ValidationError,
} from './validators.js';

describe('validateEmail', () => {
  it('acepta un email válido', () => {
    expect(validateEmail('usuario@dominio.com')).toBe(true);
  });

  it('rechaza un email sin arroba', () => {
    expect(() => validateEmail('usuario.dominio.com')).toThrow(ValidationError);
  });

  it('rechaza un email sin dominio', () => {
    expect(() => validateEmail('usuario@')).toThrow(ValidationError);
  });

  it('rechaza un email con espacios', () => {
    expect(() => validateEmail(' usuario@dominio.com ')).toThrow(ValidationError);
  });

  it('rechaza un email con arroba duplicada', () => {
    expect(() => validateEmail('us@rio@dominio.com')).toThrow(ValidationError);
  });

  it('rechaza un email vacío', () => {
    expect(() => validateEmail('')).toThrow(ValidationError);
  });
});

describe('validateUsername', () => {
  it('acepta usuario con guion bajo y dígitos', () => {
    expect(validateUsername('usuario_123')).toBe(true);
  });

  it('acepta usuario con guiones', () => {
    expect(validateUsername('usuario-nombre')).toBe(true);
  });

  it('rechaza usuario demasiado corto', () => {
    expect(() => validateUsername('ab')).toThrow(ValidationError);
  });

  it('rechaza usuario demasiado largo', () => {
    expect(() => validateUsername('a'.repeat(21))).toThrow(ValidationError);
  });

  it('rechaza usuario con espacios', () => {
    expect(() => validateUsername('usuario nombre')).toThrow(ValidationError);
  });

  it('rechaza usuario con caracteres especiales', () => {
    expect(() => validateUsername('usuario!')).toThrow(ValidationError);
  });
});

describe('validatePassword', () => {
  it('acepta una contraseña fuerte', () => {
    expect(validatePassword('Abcd1234!')).toBe(true);
  });

  it('rechaza contraseña corta (menos de 8)', () => {
    expect(() => validatePassword('Ab1!')).toThrow(ValidationError);
  });

  it('rechaza contraseña sin mayúscula', () => {
    expect(() => validatePassword('abcd1234!')).toThrow(ValidationError);
  });

  it('rechaza contraseña sin minúscula', () => {
    expect(() => validatePassword('ABCD1234!')).toThrow(ValidationError);
  });

  it('rechaza contraseña sin dígito', () => {
    expect(() => validatePassword('Abcdefgh!')).toThrow(ValidationError);
  });

  it('rechaza contraseña sin carácter especial', () => {
    expect(() => validatePassword('Abcdefgh1')).toThrow(ValidationError);
  });
});

describe('validateForm', () => {
  it('devuelve objeto vacío para un formulario válido', () => {
    const errors = validateForm('esteban', 'esteban@example.com', 'ClaveSegura1!');
    expect(errors).toEqual({});
  });

  it('reporta errores por cada campo inválido', () => {
    const errors = validateForm('ab', 'no-es-email', 'corta');
    expect(errors.username).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(errors.password).toBeTruthy();
  });

  it('no reporta errores para campos válidos', () => {
    const errors = validateForm('esteban', 'esteban@example.com', 'ClaveSegura1!');
    expect(errors).not.toHaveProperty('email');
  });
});