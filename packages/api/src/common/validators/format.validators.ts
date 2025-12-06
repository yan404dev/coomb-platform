import {
  registerDecorator,
  ValidationOptions,
} from "class-validator";

export function IsValidCPF(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isValidCPF",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) {
            return true;
          }

          const cpf = value.replace(/\D/g, "");

          if (cpf.length !== 11) {
            return false;
          }

          if (/^(\d)\1{10}$/.test(cpf)) {
            return false;
          }

          let sum = 0;
          for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
          }
          let remainder = 11 - (sum % 11);
          if (remainder === 10 || remainder === 11) {
            remainder = 0;
          }
          if (remainder !== parseInt(cpf.charAt(9))) {
            return false;
          }

          sum = 0;
          for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
          }
          remainder = 11 - (sum % 11);
          if (remainder === 10 || remainder === 11) {
            remainder = 0;
          }
          if (remainder !== parseInt(cpf.charAt(10))) {
            return false;
          }

          return true;
        },
        defaultMessage() {
          return "CPF inválido";
        },
      },
    });
  };
}

export function IsValidPhone(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isValidPhone",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) {
            return true;
          }

          const phone = value.replace(/\D/g, "");

          return phone.length >= 10 && phone.length <= 11;
        },
        defaultMessage() {
          return "Telefone inválido. Deve conter 10 ou 11 dígitos";
        },
      },
    });
  };
}

export function IsValidURL(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isValidURL",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) {
            return true;
          }

          try {
            const url = new URL(value);
            return url.protocol === "http:" || url.protocol === "https:";
          } catch {
            return false;
          }
        },
        defaultMessage() {
          return "URL inválida";
        },
      },
    });
  };
}
