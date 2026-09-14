const { createApp } = require("./app");

const PORT = Number.parseInt(process.env.PORT, 10) || 5000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`LinkForge API listening on port ${PORT}`);
});
