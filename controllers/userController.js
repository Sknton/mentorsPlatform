const db = require("../database");
const bcrypt = require("bcryptjs");
const path = require("path");

exports.getLoginForm = (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "login.html"));
};
exports.login = (req, res) => {
  try {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], async (err, result) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("An error occurred");
        return;
      }

      if (
        result.length === 0 ||
        !(await bcrypt.compare(password, result[0].password))
      ) {
        res.status(401).send("Invalid username or password");
        return;
      }
      req.session.userId = result[0].id;
      res.json({ success: "Logging in was successful!" });
    });
  } catch {
    res.status(500).send();
  }
};
exports.getSignUpForm = (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
};
exports.signUp = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 8);

    const user = {
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
    };

    const sql = "INSERT INTO users SET ?";
    db.query(sql, user, (err, result) => {
      if (err) {
        console.error(err.message);
        if (err.code === "ER_DUP_ENTRY") {
          res.status(409).json({ message: "Username or email already exists" });
        } else {
          res.status(500).json({ message: "An error occurred" });
        }
        return;
      }
      res.json({ success: "User registered successfully" });
    });
  } catch {
    res.status(500).send();
  }
};

exports.getAccountInformation = (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "accountInfo.html"));
};
exports.getUser = (req, res) => {
  const userId = req.session.userId;

  const sql = "SELECT * FROM users WHERE id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("An error occurred");
      return;
    }

    if (result.length === 0) {
      res.status(404).send("User not found");
      return;
    }
    res.json(result[0]);
  });
};

exports.updateUser = (req, res) => {
  const { email, prevPassword, password } = req.body;
  const userId = req.session.userId;
  const sql = "SELECT * FROM users WHERE id = ?";
  db.query(sql, [userId], async (err, result) => {
    if (err) {
      res.status(500).json({ error: "An error occurred" });
      return;
    }
    if (result.length === 0) {
      res.status(401).json({ error: "Invalid username" });
      return;
    }
    if (!(await bcrypt.compare(prevPassword, result[0].password))) {
      res.status(401).json({ error: "Previous password is incorrect" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    const updateSql = "UPDATE users SET email = ?, password = ? WHERE id = ?";
    db.query(
      updateSql,
      [email, hashedPassword, userId],
      (updateErr, updateResult) => {
        if (updateErr) {
          console.error(updateErr.message);
          res.status(500).json({
            error:
              "An error occurred while updating the user's information (maybe the new email is already in use)",
          });
          return;
        }
        res.json({ success: "User information updated successfully" });
      }
    );
  });
};

exports.isLoggedIn = (req, res) => {
  if (req.session && req.session.userId) {
    res.json({ isLoggedIn: true });
  } else {
    res.json({ isLoggedIn: false });
  }
};

exports.logout = (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).send("An error occurred");
      } else {
        res.send("Logged out successfully");
      }
    });
  } else {
    res.status(400).send("Not logged in");
  }
};
