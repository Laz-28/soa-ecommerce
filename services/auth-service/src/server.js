require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 4001;

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing from the environment");
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(
    `Auth Service running on http://localhost:${PORT}`
  );
});