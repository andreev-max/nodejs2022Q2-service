import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsIdNullOrString(
  property?: string | null,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsIdNullOrString',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        defaultMessage: ({ property }) => {
          return `${property} should be valid uuid or null`;
        },
        validate(value: any) {
          return (
            (typeof value === 'string' && value.length > 0) || value === null
          );
        },
      },
    });
  };
}
