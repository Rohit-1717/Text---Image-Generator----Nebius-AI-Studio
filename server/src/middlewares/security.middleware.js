// src/middlewares/security.middleware.js
import helmet from "helmet";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

export const securityMiddlewares = (app) => {
  app.disable("x-powered-by");

  app.use(
    helmet({
      // Defaults are good for APIs
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  // Prevent HTTP param pollution
  app.use(hpp());

  // Sanitize NoSQL injection
  app.use(mongoSanitize());

  // Sanitize XSS
  app.use(xss());
};
