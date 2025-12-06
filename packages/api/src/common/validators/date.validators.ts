import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";

export function IsValidDateRange(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isValidDateRange",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(_value: any, args: ValidationArguments) {
          const obj = args.object as any;
          const startDate = obj.startDate;
          const endDate = obj.endDate;
          const current = obj.current;

          if (!startDate) {
            return false;
          }

          if (current) {
            return true;
          }

          if (!endDate) {
            return false;
          }

          const start = new Date(startDate);
          const end = new Date(endDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (start >= end) {
            return false;
          }

          if (end > today) {
            return false;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const obj = args.object as any;
          const current = obj.current;

          if (current) {
            return "Data de término não pode ser informada quando 'atual' está marcado";
          }

          if (!obj.endDate) {
            return "Data de término é obrigatória quando 'atual' não está marcado";
          }

          if (new Date(obj.startDate) >= new Date(obj.endDate)) {
            return "Data de início deve ser anterior à data de término";
          }

          if (new Date(obj.endDate) > new Date()) {
            return "Data de término não pode ser no futuro";
          }

          return "Período inválido";
        },
      },
    });
  };
}

export function IsNotFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isNotFutureDate",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) {
            return true;
          }

          const date = new Date(value);
          const today = new Date();
          today.setHours(23, 59, 59, 999);

          return date <= today;
        },
        defaultMessage() {
          return "Data não pode ser no futuro";
        },
      },
    });
  };
}

