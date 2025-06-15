const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/api/users/:id", (req, res) => {
  res.json({
    id: req.params.id,
    name: "Michelle",
    email: "michelle@example.com",
  });
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
