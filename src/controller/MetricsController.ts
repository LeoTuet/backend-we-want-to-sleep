import { register } from "prom-client";
import { asyncHandler } from "./../utils/AsyncHandler";

export default {
  getAllMetrics: asyncHandler(async (req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  }),
};
