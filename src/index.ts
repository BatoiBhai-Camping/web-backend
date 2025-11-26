import "dotenv/config";
import { app } from "./app.js";

app.listen(process.env.PORT || 3001, () => {
  console.log(
    `http://localhost:${process.env.PORT || 3001}/api/v1/health-status`,
  );
});
