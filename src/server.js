import "dotenv/config"
import app from "./app.js";

app.listen(process.env.PORT, () => {
    console.log(` ==> Listening on http://localhost:${process.env.PORT}/`)
  });