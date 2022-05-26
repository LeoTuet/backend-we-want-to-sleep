import { Counter } from "prom-client";

export const loginCounter = new Counter({
  name: "login_attempts",
  help: "Number of calls to the login endpoint",
});
