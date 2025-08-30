export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    // Replace with parsed data (sanitized)
    req.body = parsed.body ?? req.body;
    req.params = parsed.params ?? req.params;
    req.query = parsed.query ?? req.query;
    next();
  } catch (e) {
    return res.status(400).json({
      message: "Validation error",
      issues: e.errors?.map((x) => ({ path: x.path.join("."), message: x.message })),
    });
  }
};
