import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

type Target = "body" | "params" | "query";

export const validate = (schema: ZodSchema, target: Target = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = target === "body" ? req.body : target === "params" ? req.params : req.query;

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        message: "Datos inválidos",
        errors: parsed.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
    }

    if (target === "body") req.body = parsed.data;
    if (target === "params") (req as any).params = parsed.data;
    if (target === "query") (req as any).query = parsed.data;

    return next();
  };
};