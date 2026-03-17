import Ajv, { ErrorObject } from "ajv";
import { Static, TSchema } from "@sinclair/typebox";
import { Request, Response, NextFunction, RequestHandler } from "express";

const ajv = new Ajv({
    allErrors: true,
    coerceTypes: true,
    removeAdditional: false,
});

const formatErrors = (errors: ErrorObject[] | null | undefined): string[] => {
    if (!errors) return ["Validation failed"];
    return errors.map((error) => {
        const path = error.instancePath || "body";
        return `${path} ${error.message ?? "is invalid"}`.trim();
    });
};

export const validateSchema = <T extends TSchema>(schema: T, input: unknown) => {
    const validate = ajv.compile(schema);
    const isValid = validate(input);

    if (!isValid) {
        return {
            ok: false as const,
            errors: formatErrors(validate.errors),
        };
    }

    return {
        ok: true as const,
        data: input as Static<T>,
    };
};

export const validateRequest = <T extends TSchema>(schema: T): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = validateSchema(schema, req.body);
        if (!result.ok) {
            return res.status(400).json({ errors: result.errors });
        }

        req.body = result.data;
        next();
    };
};