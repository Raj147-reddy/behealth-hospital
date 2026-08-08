const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// ======================================
// PORT
// ======================================
const PORT = process.env.PORT || 5000;

// ======================================
// JWT SECRET
// ======================================
const JWT_SECRET =
  process.env.JWT_SECRET || "behealth_secret_key_change_this";

// ======================================
// DATABASE
// ======================================
console.log("DB USER:", process.env.DB_USER);
console.log("DB HOST:", process.env.DB_HOST);
console.log("DB NAME:", process.env.DB_NAME);
console.log("DB PORT:", process.env.DB_PORT);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// ======================================
// CORS
// ======================================
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ======================================
// JSON
// ======================================
app.use(express.json());

// ======================================
// HOME
// ======================================
app.get("/", (req, res) => {
  res.json({
    message: "BeHealth Hospital Backend Running",
  });
});

// ======================================
// DATABASE TEST
// ======================================
app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "PostgreSQL connected successfully",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// ======================================
// TEST API
// ======================================
app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working successfully",
  });
});

app.post("/api/test", (req, res) => {
  console.log("Data received from frontend:");
  console.log(req.body);

  res.json({
    message: "POST request received successfully",
    data: req.body,
  });
});

// ======================================
// REGISTER
// ======================================
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  console.log("Register request received");
  console.log("Name:", name);
  console.log("Email:", email);

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required",
    });
  }

  try {
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    console.log("New user registered successfully");

    res.status(201).json({
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Registration database error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ======================================
// LOGIN
// ======================================
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("================================");
  console.log("LOGIN REQUEST");
  console.log("Email:", email);
  console.log("================================");

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  try {
    const result = await pool.query(
      `SELECT
        id,
        name,
        email,
        password,
        is_admin
       FROM users
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      console.log("User not found");

      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      console.log("Incorrect password");

      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        is_admin: user.is_admin,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    console.log("Login successful");
    console.log("User ID:", user.id);

    res.json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
      },
    });
  } catch (error) {
    console.error("Login database error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ======================================
// AUTHENTICATION MIDDLEWARE
// ======================================
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authorization token required",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Invalid authorization format",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    console.log(
      "Authenticated user ID:",
      decoded.id
    );

    next();
  } catch (error) {
    console.error("JWT verification error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
      });
    }

    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

// ======================================
// PROFILE
// ======================================
app.get(
  "/api/profile",
  authenticateToken,
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT
          id,
          name,
          email,
          is_admin
         FROM users
         WHERE id = $1`,
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({
        message: "Profile access successful",
        user: result.rows[0],
      });
    } catch (error) {
      console.error(
        "Profile database error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// ======================================
// CREATE APPOINTMENT
// ======================================
app.post(
  "/api/appointments",
  authenticateToken,
  async (req, res) => {
    const {
      name,
      email,
      phone,
      department,
      problem,
    } = req.body;

    console.log(
      "Appointment request received"
    );

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Department:", department);
    console.log(
      "Logged-in User ID:",
      req.user.id
    );

    if (
      !name ||
      !email ||
      !phone ||
      !department
    ) {
      return res.status(400).json({
        message:
          "Name, email, phone and department are required",
      });
    }

    try {
      const result = await pool.query(
        `INSERT INTO appointments
        (
          name,
          email,
          phone,
          department,
          problem,
          user_id
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
          id,
          name,
          email,
          phone,
          department,
          problem,
          user_id,
          status,
          created_at`,
        [
          name,
          email,
          phone,
          department,
          problem || null,
          req.user.id,
        ]
      );

      console.log(
        "Appointment created successfully"
      );

      res.status(201).json({
        message:
          "Appointment booked successfully",
        appointment: result.rows[0],
      });
    } catch (error) {
      console.error(
        "Appointment database error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// ======================================
// MY APPOINTMENTS
// ======================================
app.get(
  "/api/my-appointments",
  authenticateToken,
  async (req, res) => {
    console.log(
      "My appointments request received"
    );

    console.log(
      "Logged-in User ID:",
      req.user.id
    );

    try {
      const result = await pool.query(
        `SELECT
          id,
          name,
          email,
          phone,
          department,
          problem,
          user_id,
          status,
          created_at
         FROM appointments
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [req.user.id]
      );

      console.log(
        "Appointments found:",
        result.rows.length
      );

      res.json({
        message:
          "Appointments fetched successfully",
        appointments: result.rows,
      });
    } catch (error) {
      console.error(
        "My appointments database error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// ======================================
// CANCEL APPOINTMENT
// ======================================
app.put(
  "/api/appointments/:id/cancel",
  authenticateToken,
  async (req, res) => {
    const appointmentId = req.params.id;

    console.log(
      "Cancel appointment request"
    );

    try {
      const result = await pool.query(
        `UPDATE appointments
         SET status = 'Cancelled'
         WHERE id = $1
         AND user_id = $2
         AND status = 'Pending'
         RETURNING
           id,
           name,
           email,
           phone,
           department,
           problem,
           user_id,
           status,
           created_at`,
        [
          appointmentId,
          req.user.id,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message:
            "Appointment not found or cannot be cancelled",
        });
      }

      res.json({
        message:
          "Appointment cancelled successfully",
        appointment: result.rows[0],
      });
    } catch (error) {
      console.error(
        "Cancel appointment database error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// ======================================
// ADMIN AUTHENTICATION
// ======================================
async function authenticateAdmin(
  req,
  res,
  next
) {
  const authHeader =
    req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message:
        "Authorization token required",
    });
  }

  const token =
    authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message:
        "Invalid authorization format",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    const result = await pool.query(
      `SELECT
        id,
        name,
        email,
        is_admin
       FROM users
       WHERE id = $1`,
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = result.rows[0];

    if (user.is_admin !== true) {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    req.user = user;

    console.log(
      "Admin authenticated:",
      user.email
    );

    next();
  } catch (error) {
    console.error(
      "Admin authentication error:",
      error
    );

    if (
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        message: "Token expired",
      });
    }

    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

// ======================================
// ADMIN - GET ALL APPOINTMENTS
// ======================================
app.get(
  "/api/admin/appointments",
  authenticateAdmin,
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT
          id,
          name,
          email,
          phone,
          department,
          problem,
          user_id,
          status,
          created_at
         FROM appointments
         ORDER BY created_at DESC`
      );

      console.log(
        "Admin appointments found:",
        result.rows.length
      );

      res.json({
        message:
          "Admin appointments fetched successfully",
        appointments: result.rows,
      });
    } catch (error) {
      console.error(
        "Admin appointments database error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// ======================================
// ADMIN - UPDATE APPOINTMENT STATUS
// ======================================
app.put(
  "/api/admin/appointments/:id/status",
  authenticateAdmin,
  async (req, res) => {
    const appointmentId =
      req.params.id;

    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Completed",
      "Cancelled",
    ];

    if (
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        message:
          "Invalid appointment status",
      });
    }

    try {
      const result = await pool.query(
        `UPDATE appointments
         SET status = $1
         WHERE id = $2
         RETURNING
           id,
           name,
           email,
           phone,
           department,
           problem,
           user_id,
           status,
           created_at`,
        [
          status,
          appointmentId,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message:
            "Appointment not found",
        });
      }

      console.log(
        "Appointment status updated:",
        appointmentId,
        status
      );

      res.json({
        message:
          "Appointment status updated successfully",
        appointment: result.rows[0],
      });
    } catch (error) {
      console.error(
        "Admin status update database error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// ======================================
// START SERVER
// ======================================
app.listen(PORT, () => {
  console.log(
    "================================"
  );

  console.log(
    `Server running on port ${PORT}`
  );

  console.log(
    "================================"
  );
});

