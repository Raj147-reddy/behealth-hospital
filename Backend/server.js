// ======================================================
// BEHEALTH HOSPITAL - COMPLETE BACKEND SERVER
// ======================================================

const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();

// ======================================================
// ENVIRONMENT
// ======================================================

const PORT = process.env.PORT || 5000;

// IMPORTANT:
// JWT_SECRET MUST be configured in Render Environment Variables
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("ERROR: JWT_SECRET is missing on Render");
  process.exit(1);
}

// ======================================================
// DATABASE
// ======================================================

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL error:", error);
});

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================================================
// TEST ROUTE
// ======================================================

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      message: "BeHealth Hospital API is running",
      database: "connected",
    });
  } catch (error) {
    console.error("Health check error:", error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

// ======================================================
// JWT AUTHENTICATION
// ======================================================

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  console.log("================================");
  console.log("AUTHENTICATION REQUEST");
  console.log("Request:", req.method, req.originalUrl);
  console.log("AUTH HEADER EXISTS:", !!authHeader);

  if (authHeader) {
    console.log(
      "AUTH HEADER:",
      authHeader.substring(0, 35) + "..."
    );
  } else {
    console.log("AUTH HEADER: NONE");
  }

  console.log(
    "JWT SECRET LENGTH:",
    JWT_SECRET.length
  );

  // --------------------------------------------------
  // CHECK AUTHORIZATION HEADER
  // --------------------------------------------------

  if (!authHeader) {
    console.log(
      "ERROR: Authorization header missing"
    );

    console.log("================================");

    return res.status(401).json({
      message: "Authorization token required",
    });
  }

  // --------------------------------------------------
  // CHECK BEARER FORMAT
  // --------------------------------------------------

  const parts = authHeader.trim().split(/\s+/);

  console.log(
    "AUTH HEADER PARTS:",
    parts.length
  );

  console.log(
    "AUTH TYPE:",
    parts[0]
  );

  if (
    parts.length !== 2 ||
    parts[0] !== "Bearer"
  ) {
    console.log(
      "ERROR: Invalid authorization format"
    );

    console.log("================================");

    return res.status(401).json({
      message: "Invalid authorization format",
    });
  }

  const token = parts[1];

  console.log(
    "TOKEN LENGTH:",
    token.length
  );

  console.log(
    "TOKEN PREVIEW:",
    token.substring(0, 25) + "..."
  );

  // --------------------------------------------------
  // VERIFY JWT
  // --------------------------------------------------

  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    console.log(
      "JWT VERIFICATION SUCCESSFUL"
    );

    console.log(
      "DECODED USER ID:",
      decoded.id
    );

    console.log(
      "DECODED EMAIL:",
      decoded.email
    );

    console.log(
      "TOKEN EXPIRATION:",
      decoded.exp
    );

    console.log("================================");

    req.user = decoded;

    next();
  } catch (error) {
    console.error("================================");
    console.error(
      "JWT VERIFICATION FAILED"
    );

    console.error(
      "ERROR NAME:",
      error.name
    );

    console.error(
      "ERROR MESSAGE:",
      error.message
    );

    console.error("================================");

    return res.status(401).json({
      message: "Invalid token",
      error: error.name,
    });
  }
}

// ======================================================
// REGISTER
// ======================================================

app.post("/api/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const existingUser =
      await pool.query(
        `SELECT id
         FROM users
         WHERE LOWER(email) = LOWER($1)`,
        [normalizedEmail]
      );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const result =
      await pool.query(
        `INSERT INTO users
          (name, email, password)
         VALUES
          ($1, $2, $3)
         RETURNING
          id,
          name,
          email,
          is_admin`,
        [
          name.trim(),
          normalizedEmail,
          hashedPassword,
        ]
      );

    res.status(201).json({
      message: "Registration successful",
      user: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Register error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// ======================================================
// LOGIN
// ======================================================

app.post("/api/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const result =
      await pool.query(
        `SELECT
          id,
          name,
          email,
          password,
          is_admin
         FROM users
         WHERE LOWER(email) = LOWER($1)`,
        [normalizedEmail]
      );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    const user = result.rows[0];

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    // --------------------------------------------------
    // CREATE JWT
    // IMPORTANT:
    // SAME JWT_SECRET IS USED FOR SIGN AND VERIFY
    // --------------------------------------------------

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.log(
      "================================"
    );

    console.log(
      "JWT CREATED"
    );

    console.log(
      "USER ID:",
      user.id
    );

    console.log(
      "USER EMAIL:",
      user.email
    );

    console.log(
      "JWT SECRET LENGTH:",
      JWT_SECRET.length
    );

    console.log(
      "TOKEN LENGTH:",
      token.length
    );

    console.log(
      "================================"
    );

    res.json({
      message: "Login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// ======================================================
// GET CURRENT USER
// ======================================================

app.get(
  "/api/profile",
  authenticateToken,
  async (req, res) => {
    try {
      const result =
        await pool.query(
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
        user: result.rows[0],
      });
    } catch (error) {
      console.error(
        "Profile error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// ======================================================
// BOOK APPOINTMENT
// ======================================================

app.post(
  "/api/appointments",
  authenticateToken,
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        department,
        problem,
      } = req.body;

      if (
        !name ||
        !email ||
        !phone ||
        !department ||
        !problem
      ) {
        return res.status(400).json({
          message:
            "Please fill all appointment fields",
        });
      }

      const result =
        await pool.query(
          `INSERT INTO appointments
            (
              name,
              email,
              phone,
              department,
              problem,
              user_id,
              status
            )
           VALUES
            ($1, $2, $3, $4, $5, $6, 'Pending')
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
            problem,
            req.user.id,
          ]
        );

      res.status(201).json({
        message:
          "Appointment booked successfully",

        appointment:
          result.rows[0],
      });
    } catch (error) {
      console.error(
        "Book appointment error:",
        error
      );

      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  }
);

// ======================================================
// GET MY APPOINTMENTS
// ======================================================

app.get(
  "/api/my-appointments",
  authenticateToken,
  async (req, res) => {
    console.log(
      "================================"
    );

    console.log(
      "GET MY APPOINTMENTS"
    );

    console.log(
      "USER ID:",
      req.user.id
    );

    console.log(
      "USER EMAIL:",
      req.user.email
    );

    console.log(
      "================================"
    );

    try {
      const result =
        await pool.query(
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

        appointments:
          result.rows,
      });
    } catch (error) {
      console.error(
        "My appointments database error:",
        error
      );

      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  }
);

// ======================================================
// CANCEL APPOINTMENT
// ======================================================

app.put(
  "/api/appointments/:id/cancel",
  authenticateToken,
  async (req, res) => {
    const appointmentId =
      req.params.id;

    try {
      const result =
        await pool.query(
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

        appointment:
          result.rows[0],
      });
    } catch (error) {
      console.error(
        "Cancel appointment database error:",
        error
      );

      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  }
);

// ======================================================
// ADMIN AUTHENTICATION
// ======================================================

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

  const parts =
    authHeader.trim().split(/\s+/);

  if (
    parts.length !== 2 ||
    parts[0] !== "Bearer"
  ) {
    return res.status(401).json({
      message:
        "Invalid authorization format",
    });
  }

  const token = parts[1];

  try {
    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      );

    const result =
      await pool.query(
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

    const user =
      result.rows[0];

    if (user.is_admin !== true) {
      return res.status(403).json({
        message:
          "Admin access required",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(
      "Admin authentication error:",
      error
    );

    return res.status(401).json({
      message: "Invalid token",
      error: error.name,
    });
  }
}

// ======================================================
// ADMIN - GET ALL APPOINTMENTS
// ======================================================

app.get(
  "/api/admin/appointments",
  authenticateAdmin,
  async (req, res) => {
    try {
      const result =
        await pool.query(
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

      res.json({
        message:
          "Admin appointments fetched successfully",

        appointments:
          result.rows,
      });
    } catch (error) {
      console.error(
        "Admin appointments database error:",
        error
      );

      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  }
);

// ======================================================
// ADMIN - UPDATE APPOINTMENT STATUS
// ======================================================

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
      const result =
        await pool.query(
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

      res.json({
        message:
          "Appointment status updated successfully",

        appointment:
          result.rows[0],
      });
    } catch (error) {
      console.error(
        "Admin status update database error:",
        error
      );

      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  }
);

// ======================================================
// SERVE REACT FRONTEND
// ======================================================

const frontendPath =
  path.join(
    __dirname,
    "../frontend/dist"
  );

app.use(
  express.static(frontendPath)
);

app.get("*", (req, res) => {
  res.sendFile(
    path.join(
      frontendPath,
      "index.html"
    )
  );
});

// ======================================================
// START SERVER
// ======================================================

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      "================================"
    );

    console.log(
      `Server running on port ${PORT}`
    );

    console.log(
      "BeHealth Hospital Backend"
    );

    console.log(
      "JWT authentication enabled"
    );

    console.log(
      "JWT_SECRET configured:",
      !!JWT_SECRET
    );

    console.log(
      "JWT_SECRET length:",
      JWT_SECRET.length
    );

    console.log(
      "================================"
    );
  }
);