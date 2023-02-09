import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as DateFNS from 'date-fns';

@ValidatorConstraint()
class IsValidDateConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return DateFNS.isValid(new Date(value));
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} must be a valid date. E.g. 2022-12-31`;
  }
}

export const IsValidDate = (validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsValidDateConstraint,
    });
  };
};
