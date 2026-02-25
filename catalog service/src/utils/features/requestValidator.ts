import { validate, ValidationError } from "class-validator";
import { plainToInstance } from "class-transformer";

export const requestValidator = async <T extends object>(
  type: new () => T,
  body: object
): Promise<{ errors: string[] | null; input: T }> => {
  const input = plainToInstance(type, body);
  const errors: ValidationError[] = await validate(input as object);

  if (errors.length > 0) {
    const errorMessages = errors
      .map((err) => Object.values(err.constraints || {}).join(", "))
      .flat();
    return { errors: errorMessages, input };
  }

  return { errors: null, input };
};