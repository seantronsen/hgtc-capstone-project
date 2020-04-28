/*
File: server.js
Author: Sean Tronsen
Purpose: Run base server functionality and handle requests made to the server from other pages in application as well as the browser
Date: March 15, 2020



*/

"use strict";

const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mysql2 = require("mysql2");
const chalk = require("chalk");
const hbs = require("hbs");
const bcrypt = require("bcrypt");
const app = express();
const saltRounds = 10;
const mysqlPromise = require("mysql2/promise");

const footer_content = "Copyright © 2020 Bug Byte Solutions Web Development.";

const errMsg = (message) => {
  console.log(chalk.red(message));
};

const regMessage = (message) => {
  console.log(chalk.green(message));
};

const userAuth = async (username, authLevel) => {
  const connPromise = await mysqlPromise.createConnection(conObject);
  let sqlTemp =
    "SELECT users_username, users_privileges FROM users WHERE users_username = ?;";
  let sql = mysql2.format(sqlTemp, [username]);
  try {
    let [rows, fields] = await connPromise.execute(sql);
    if (rows.length < 0) {
      return 0;
    } else {
      return rows[0].users_privileges >= authLevel ? 2 : 1;
    }
  } catch (e) {
    return 0;
  }
};

app.set("port", process.env.PORT || 3000);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./public/templates/views"));
hbs.registerPartials(path.join(__dirname, "./public/templates/partials"));
app.use("/", express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const conObject = {
  host: "localhost",
  user: "root",
  password: "password",
  database: "stronsen_capstone262",
};
const con = mysql2.createConnection(conObject);

con.connect((err) => {
  if (err) {
    errMsg("\n\nA Connection Error Occurred: ");
    errMsg(err.toString());
  } else {
    regMessage("Connection Made");
  }
});

app.set("port", process.env.PORT || 3000);
app.use("/", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", {
    header_content: "Welcome to GG's Italian Restaurant and Bakery",
    footer_content,
  });
});

app.get("/menu", (req, res) => {
  res.render("menu", {
    header_content: "Our Menu",
    footer_content,
  });
});

app.get("/backend/backendinventoryadd", async (req, res) => {
  let auth = await userAuth(req.query.user, 2);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendinventoryadd", {
      header_content: "Add Item to Inventory",
      footer_content,
    });
  }
});

app.get("/backend/backendinventoryedit", async (req, res) => {
  let auth = await userAuth(req.query.user, 3);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendinventoryedit", {
      header_content: "Edit Inventory",
      footer_content,
    });
  }
});

app.get("/backend/backendinventoryremove", async (req, res) => {
  let auth = await userAuth(req.query.user, 4);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendinventoryremove", {
      header_content: "Remove Item from Inventory",
      footer_content,
    });
  }
});

app.get("/backend/backendinventorystock", async (req, res) => {
  let auth = await userAuth(req.query.user, 1);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendinventorystock", {
      header_content: "Inventory Stock",
      footer_content,
    });
  }
});

app.get("/backend/backendinventorysearch", async (req, res) => {
  let auth = await userAuth(req.query.user, 1);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendinventorysearch", {
      header_content: "Search Inventory",
      footer_content,
    });
  }
});

app.get("/backend/backendmenuadd", async (req, res) => {
  let auth = await userAuth(req.query.user, 2);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendmenuadd", {
      header_content: "New Menu Item",
      footer_content,
    });
  }
});

app.get("/backend/backendmenuedit", async (req, res) => {
  let auth = await userAuth(req.query.user, 3);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendmenuedit", {
      header_content: "Edit Menu Item",
      footer_content,
    });
  }
});

app.get("/backend/backendmenuremove", async (req, res) => {
  let auth = await userAuth(req.query.user, 4);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendmenuremove", {
      header_content: "Remove Item From Menu",
      footer_content,
    });
  }
});

app.get("/backend/backendmenuview", async (req, res) => {
  let auth = await userAuth(req.query.user, 1);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendmenuview", {
      header_content: "View Current Items",
      footer_content,
    });
  }
});

app.get("/backend/backendmenusearch", async (req, res) => {
  let auth = await userAuth(req.query.user, 1);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendmenusearch", {
      header_content: "Search Menu Items",
      footer_content,
    });
  }
});

app.get("/backend/backendordersadd", async (req, res) => {
  let auth = await userAuth(req.query.user, 2);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendordersadd", {
      header_content: "New Order",
      footer_content,
    });
  }
});

app.get("/backend/backendordersedit", async (req, res) => {
  let auth = await userAuth(req.query.user, 3);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendordersedit", {
      header_content: "Edit Order",
      footer_content,
    });
  }
});

app.get("/backend/backendordersremove", async (req, res) => {
  let auth = await userAuth(req.query.user, 4);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendordersremove", {
      header_content: "Remove Order",
      footer_content,
    });
  }
});

app.get("/backend/backendordersopen", async (req, res) => {
  let auth = await userAuth(req.query.user, 1);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendordersopen", {
      header_content: "Open Orders",
      footer_content,
    });
  }
});

app.get("/backend/backendordersclosed", async (req, res) => {
  let auth = await userAuth(req.query.user, 1);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendordersclosed", {
      header_content: "Closed Orders",
      footer_content,
    });
  }
});

app.get("/backend/backendorderssearch", async (req, res) => {
  let auth = await userAuth(req.query.user, 1);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendorderssearch", {
      header_content: "Search Orders",
      footer_content,
    });
  }
});

app.get("/backend/backendlocationsadd", async (req, res) => {
  let auth = await userAuth(req.query.user, 2);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendlocationsadd", {
      header_content: "Add Location",
      footer_content,
    });
  }
});

app.get("/backend/backendlocationsedit", async (req, res) => {
  let auth = await userAuth(req.query.user, 3);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendlocationsedit", {
      header_content: "Edit Location",
      footer_content,
    });
  }
});

app.get("/backend/backendlocationsremove", async (req, res) => {
  let auth = await userAuth(req.query.user, 4);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendlocationsremove", {
      header_content: "Remove Location",
      footer_content,
    });
  }
});

app.get("/backend/backendlocationssearch", async (req, res) => {
  let auth = await userAuth(req.query.user, 1);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendlocationssearch", {
      header_content: "Search Locations",
      footer_content,
    });
  }
});

app.get("/backend/backendusersadd", async (req, res) => {
  let auth = await userAuth(req.query.user, 2);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendusersadd", {
      header_content: "Add User",
      footer_content,
    });
  }
});

app.get("/backend/backendusersedit", async (req, res) => {
  let auth = await userAuth(req.query.user, 3);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendusersedit", {
      header_content: "Edit User",
      footer_content,
    });
  }
});

app.get("/backend/backendusersremove", async (req, res) => {
  let auth = await userAuth(req.query.user, 4);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendusersremove", {
      header_content: "Remove User",
      footer_content,
    });
  }
});

app.get("/backend/backenduserssearch", async (req, res) => {
  let auth = await userAuth(req.query.user, 1);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backenduserssearch", {
      header_content: "Search Users",
      footer_content,
    });
  }
});

app.get("/backend/backendhome", async (req, res) => {
  let auth = await userAuth(req.query.user, 1);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendhome", {
      header_content: "Home",
      footer_content,
    });
  }
});

app.get("/backend/backendsupport", async (req, res) => {
  let auth = await userAuth(req.query.user, 1);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendsupport", {
      header_content: "Support",
      footer_content,
    });
  }
});

app.get("/backend/backendupdateschedule", async (req, res) => {
  let auth = await userAuth(req.query.user, 3);
  if (auth === 0) res.redirect("/404");
  else if (auth === 1) res.redirect("/accessdenied");
  else if (auth === 2) {
    res.render("backendupdateschedule", {
      header_content: "Update Restaurant Schedule",
      footer_content,
    });
  }
});

app.get("/backend/login", (req, res) => {
  res.render("backendlogin", {
    header_content: "Employee Login",
    footer_content,
  });
});

app.get("/backend/backendlogout", async (req, res) => {
  res.redirect("/backend/login");
});

app.post("/backend/authenticate", (req, res) => {
  console.log("call");
  const username = req.body.username;
  const password = req.body.password;
  let sqlTemp = "SELECT users_password FROM users WHERE users_username=?;";
  let sql = mysql2.format(sqlTemp, [username]);
  con.query(sql, (err, data) => {
    if (err) res.send(err);
    else {
      if (data.length === 0) {
        res.status(200).send({ valid: false });
      } else {
        bcrypt.compare(password, data[0].users_password, (error, result) => {
          if (err) {
            res.send(err);
          } else {
            console.log(result);
            res.status(200).send({ valid: result });
          }
        });
      }
    }
  });
});

// POST URL Calls and associated processing
app.post("/backend/backendlocationsadd", (req, res) => {
  const { area, subArea, building, user } = req.body;

  let sqlTemp =
    "SELECT * FROM order_locations WHERE order_locations_building=? && order_locations_area=? && order_locations_subarea=?;";
  let sql = mysql2.format(sqlTemp, [building, area, subArea]);
  con.query(sql, (err, data) => {
    if (err) {
      return res.status(200).send({ resMsg: "Server error occurred" });
    } else {
      if (data.length > 0)
        return res.status(200).send({
          resMsg: "Location already exists in the system",
        });
      else {
        let sqlTemp =
          "INSERT INTO order_locations (order_locations_building, order_locations_area, order_locations_subarea, order_locations_entry_user, " +
          "order_locations_entry_time, order_locations_modification_user, order_locations_modification_time) VALUES (?,?,?,?,CURRENT_TIMESTAMP(),?,CURRENT_TIMESTAMP());";
        let sql = mysql2.format(sqlTemp, [building, area, subArea, user, user]);
        con.execute(sql, (err, result) => {
          if (err) {
            return res.status(200).send({ resMsg: "Server error occurred" });
          } else {
            return res.status(200).send({
              resMsg: `${result.affectedRows} record(s) inserted. Identifier ID: ${result.insertId}`,
            });
          }
        });
      }
    }
  });
});

app.post("/backend/backendusersadd", (req, res) => {
  const {
    username,
    password,
    name,
    position,
    phone,
    email,
    address,
    entry_user,
  } = req.body;
  let sqlTemp = "SELECT * FROM users WHERE users_username=?;";
  let sql = mysql2.format(sqlTemp, [username]);

  con.query(sql, (err, data) => {
    if (err) {
      return res.status(200).send({ resMsg: "Server error occurred" });
    } else {
      if (data.length > 0) {
        return res.status(200).send({
          resMsg: "Username already exists in the system",
        });
      } else {
        bcrypt.hash(password, saltRounds, (err, hash) => {
          if (err) {
            return res.status(200).send({ resMsg: "Server error occurred" });
          } else {
            let sqlTemp =
              "INSERT INTO `users`(`users_username`, `users_password`, `users_name_actual`, `users_position`, `users_phone`, " +
              "`users_email`, `users_address`, `users_privileges`, `users_entry_user`, `users_entry_time`, `users_modification_user`, " +
              "`users_modification_time`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), ?, CURRENT_TIMESTAMP());";
            let sql = mysql2.format(sqlTemp, [
              username,
              hash,
              name,
              position,
              phone,
              email,
              address,
              "0",
              entry_user,
              entry_user,
            ]);
            con.execute(sql, (err, result) => {
              if (err) {
                return res
                  .status(200)
                  .send({ resMsg: "Server error occurred" });
              } else {
                return res.status(200).send({
                  resMsg: `${result.affectedRows} record(s) inserted. Identifier ID: ${result.insertId}`,
                });
              }
            });
          }
        });
      }
    }
  });
});

app.post("/backend/backendinventoryadd", (req, res) => {
  const {
    type,
    name,
    description,
    price,
    quantity,
    measurement,
    entry_user,
  } = req.body;
  const sqlTemp = "SELECT * FROM item_types WHERE item_types_type=?;";
  const sql = mysql2.format(sqlTemp, [type]);
  con.query(sql, (err, data) => {
    if (err) {
      return res.status(200).send({ resMsg: "Server error occurred" });
    } else {
      if (data.length > 0) {
        let sqlTemp =
          "SELECT * FROM inventory_items WHERE inventory_items_name = ? && item_types_id = ?";
        let sql = mysql2.format(sqlTemp, [name, type]);
        con.query(sql, (err, data) => {
          if (err) {
            return res.status(200).send({ resMsg: "Server error occurred" });
          } else if (data.length > 0) {
            res.status(200).send({
              resMsg: "Item name with type already exists in the system",
            });
          } else {
            let sqlTemp =
              "INSERT INTO `inventory_items`(`item_types_id`, `inventory_items_name`, `inventory_items_description`, " +
              "`inventory_items_price`, `inventory_items_quantity`, `inventory_items_measurement`, `inventory_items_entry_user`, `inventory_items_entry_time`, " +
              "`inventory_items_modification_user`, `inventory_items_modification_time`) VALUES (?,?,?,?,?,?,?,CURRENT_TIMESTAMP(),?,CURRENT_TIMESTAMP());";
            let sql = mysql2.format(sqlTemp, [
              type,
              name,
              description,
              price,
              quantity,
              measurement,
              entry_user,
              entry_user,
            ]);
            con.execute(sql, (err, result) => {
              if (err) {
                return res
                  .status(200)
                  .send({ resMsg: "SQL Insertion Error Occurred" });
              } else {
                return res.status(200).send({
                  resMsg: `${result.affectedRows} record(s) inserted. Identifier ID: ${result.insertId}`,
                });
              }
            });
          }
        });
      } else {
        return res.status(200).send({
          resMsg: "Item type is no longer available. Please refresh the page.",
        });
      }
    }
  });
});

app.post("/backend/backendMenuItemsAdd", (req, res) => {
  const { name, description, ingridients, entry_user } = req.body;
  let sqlTemp = "SELECT * FROM menu_items WHERE menu_items_name=?;";
  let sql = mysql2.format(sqlTemp, [name]);
  con.query(sql, (err, data) => {
    if (err) {
      return res.status(200).send({ resMsg: "Server error occurred" });
    } else {
      if (data.length > 0) {
        return res.status(200).send({
          resMsg:
            "Item name already exists in the system. Please use a different name.",
        });
      } else {
        let sqlTemp1 = "";
        if (ingridients.length > 1) {
          sqlTemp1 = "SELECT * FROM inventory_items WHERE inventory_items_id=?";
          for (let x = 1; x < ingridients.length; x++) {
            sqlTemp1 += " || inventory_items_id=?";
          }
          sqlTemp1 += ";";
        } else {
          sqlTemp1 =
            "SELECT * FROM inventory_items WHERE inventory_items_id=?; ";
        }
        let IDs = [];
        ingridients.map((ingridient) => {
          IDs.push(ingridient[0]);
        });
        let sql = mysql2.format(sqlTemp1, IDs);
        con.query(sql, (err, data) => {
          if (err) {
            return res.status(200).send({ resMsg: "Server error occurred" });
          } else {
            if (data.length !== IDs.length) {
              return res.status(200).send({
                resMsg:
                  "A menu item has gone missing, please refresh the page so that you have the latest selection to choose from.",
              });
            } else {
              let menuItemPrice = 0;
              data.forEach((item) => {
                ingridients.forEach((ing) => {
                  if (item.inventory_items_id.toString() === ing[0])
                    menuItemPrice +=
                      parseFloat(item.inventory_items_price) *
                      parseFloat(ing[2]);
                });
              });
              menuItemPrice *= 1.33;
              menuItemPrice = Math.ceil(menuItemPrice);
              let sqlTemp2 =
                "INSERT INTO menu_items (menu_items_name, menu_items_description, menu_items_sale_price, menu_items_entry_user, menu_items_entry_time, menu_items_modification_user, menu_items_modification_time) VALUES (?,?,?,?,CURRENT_TIMESTAMP(),?,CURRENT_TIMESTAMP());";
              let sql2 = mysql2.format(sqlTemp2, [
                name,
                description,
                menuItemPrice,
                entry_user,
                entry_user,
              ]);
              con.execute(sql2, (err, result) => {
                if (err) {
                  return res
                    .status(200)
                    .send({ resMsg: "Server error occurred" });
                } else {
                  let sqlTemp3 =
                    "INSERT INTO `menu_ingredients`(`menu_items_id`, `inventory_items_id`, `menu_ingridients_quantity`, `menu_ingredients_entry_user`, `menu_ingredients_entry_time`, `menu_ingredients_modification_user`, `menu_ingredients_modification_time`) VALUES ";
                  let sqlIns = [];
                  ingridients.forEach((ingridient) => {
                    sqlTemp3 +=
                      "(?,?,?,?,CURRENT_TIMESTAMP(),?,CURRENT_TIMESTAMP()),";
                    sqlIns = sqlIns.concat([
                      result.insertId,
                      ingridient[0],
                      ingridient[2],
                      entry_user,
                      entry_user,
                    ]);
                  });
                  sqlTemp3 = sqlTemp3.substr(0, sqlTemp3.length - 1);
                  sqlTemp3 += ";";
                  let sqlF = mysql2.format(sqlTemp3, sqlIns);

                  con.execute(sqlF, (err, result1) => {
                    if (err) {
                      return res
                        .status(200)
                        .send({ resMsg: "Server error occurred" });
                    } else {
                      return res.status(200).send({
                        resMsg: `${result.affectedRows} menu item record(s) inserted. Identifier ID: ${result.insertId}`,
                      });
                    }
                  });
                }
              });
            }
          }
        });
      }
    }
  });
});

app.post("/backend/backendOrdersAdd", (req, res) => {
  const { location, orderItems, status, entry_user, note } = req.body;

  const d = new Date();
  const weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";
  const n = weekday[d.getDay()];
  let sqlTemp =
    "Select * FROM order_hours where order_hours_day=? AND CURRENT_TIME() between order_hours_open AND order_hours_close;";
  let sql = mysql2.format(sqlTemp, [n]);

  con.query(sql, (err, data) => {
    if (err) {
      return res.status(200).send({
        resMsg:
          "A server error has occurred. Please contact support if this does not resolve momentarily.",
      });
    } else if (data.length < 1) {
      return res.status(200).send({
        resMsg:
          "Orders are not allowed to be placed outside of scheduled hours.",
      });
    } else {
      let sqlTemp =
        "SELECT * FROM order_locations WHERE order_locations_id = ?;";
      let sql = mysql2.format(sqlTemp, [location]);
      con.query(sql, (err, data) => {
        if (err) {
          return res.status(200).send({ resMsg: "Server error occurred" });
        } else if (data.length < 1) {
          return res.status(200).send({
            resMsg:
              "Unable to find selected location. Refresh the page to ensure you have the most up to date set of options.",
          });
        } else {
          let itemsCopy = orderItems.slice();
          let IDs = [];
          itemsCopy.forEach((item) => {
            IDs = IDs.concat(item[0]);
          });
          let IDsWithCount = [];
          IDs.forEach((id) => {
            let createNew = false;
            if (!IDsWithCount.length) {
              IDsWithCount.push([id, 1]);
            } else {
              for (let x = 0; x < IDsWithCount.length; x++) {
                if (IDsWithCount[x][0] === id) {
                  IDsWithCount[x][1]++;
                } else if (
                  IDsWithCount[x][0] !== id &&
                  x === IDsWithCount.length - 1
                ) {
                  createNew = true;
                }
              }
              if (createNew) {
                IDsWithCount.push([id, 1]);
              }
            }
          });
          let returnMessage = "";
          (async () => {
            const connPromise = await mysqlPromise.createConnection(conObject);
            const sqlTemp =
              "SELECT inventory_items.inventory_items_id,inventory_items.inventory_items_quantity, menu_ingredients.menu_ingridients_quantity, menu_items.menu_items_id FROM menu_items INNER JOIN menu_ingredients ON menu_items.menu_items_id=menu_ingredients.menu_items_id INNER JOIN inventory_items ON inventory_items.inventory_items_id=menu_ingredients.inventory_items_id WHERE menu_items.menu_items_id=?;";
            try {
              for (let x = 0; x < IDsWithCount.length; x++) {
                let itemID = IDsWithCount[x][0];
                let itemRequestQuantity = IDsWithCount[x][1];
                let sql1 = mysql2.format(sqlTemp, [itemID]);
                let [rows, fields] = await connPromise.execute(sql1);
                rows.forEach(async (binRow) => {
                  let required = parseFloat(binRow.menu_ingridients_quantity);
                  let decrease = itemRequestQuantity * required;
                  if (binRow.inventory_items_quantity - decrease < 0) {
                    let sql2 = mysql2.format(
                      "SELECT menu_items_name FROM menu_items WHERE menu_items_id=?",
                      [itemID]
                    );
                    let [row, field] = await connPromise.execute(sql2);
                    if (row[0].menu_items_name) {
                      returnMessage = `${row[0].menu_items_name} does not have enough of the required ingredients in stock`;
                      throw new Error(
                        "Item does not have enough of the required ingredients in stock."
                      );
                    } else {
                      returnMessage = `Server error occurred`;
                    }
                  } else {
                  }
                });
              }
              if (returnMessage) {
                return new Error(returnMessage);
              } else {
                let sqlTemp =
                  "INSERT INTO `orders`(`order_locations_id`, `orders_status`, `orders_note`, `orders_entry_user`, `orders_entry_time`, `orders_modification_user`, `orders_modification_time`) VALUES (?,?,?,?,CURRENT_TIMESTAMP(),?,CURRENT_TIMESTAMP())";
                let sql3 = mysql2.format(sqlTemp, [
                  location,
                  status,
                  note,
                  entry_user,
                  entry_user,
                ]);

                con.execute(sql3, (err, result) => {
                  if (err) {
                    return res.status(200).send({ resMsg: err.toString() });
                  } else {
                    (async () => {
                      let sqlTemp =
                        "INSERT INTO `order_items`(`orders_id`, `menu_items_id`, `order_items_sale_price`, `order_items_note`, `order_items_entry_user`, `order_items_entry_time`, `order_items_modification_user`, `order_items_modification_time`) VALUES (?,?,(SELECT menu_items_sale_price FROM menu_items WHERE menu_items_id=?),?,?,CURRENT_TIMESTAMP(),?,CURRENT_TIMESTAMP())";
                      for (let x = 0; x < orderItems.length; x++) {
                        let sql = mysql2.format(sqlTemp, [
                          result.insertId,
                          orderItems[x][0],
                          orderItems[x][0],
                          orderItems[x][2],
                          entry_user,
                          entry_user,
                        ]);
                        let [rows, fields] = await connPromise.execute(sql);

                        let sqlTempInner =
                          "SELECT menu_ingredients.inventory_items_id, menu_ingredients.menu_ingridients_quantity FROM menu_ingredients WHERE menu_ingredients.menu_items_id=?;";
                        let sqlInner = mysql2.format(sqlTempInner, [
                          orderItems[x][0],
                        ]);
                        let [
                          rowsInner,
                          fieldsInner,
                        ] = await connPromise.execute(sqlInner);
                        rowsInner.forEach(async (row) => {
                          let [
                            rowQuantity,
                            fieldQuantity,
                          ] = await connPromise.execute(
                            mysql2.format(
                              "SELECT inventory_items_quantity FROM inventory_items WHERE inventory_items_id=?",
                              [row.inventory_items_id]
                            )
                          );
                          let sqlTempUpdate =
                            "UPDATE inventory_items SET inventory_items_quantity=? WHERE inventory_items_id=?;";
                          let sqlUpdate = mysql2.format(sqlTempUpdate, [
                            rowQuantity[0].inventory_items_quantity -
                              parseFloat(row.menu_ingridients_quantity),
                            row.inventory_items_id,
                          ]);

                          let [
                            rowsInnerUpdate,
                            fieldsInner,
                          ] = await connPromise.execute(sqlUpdate);
                        });
                      }
                    })();
                    res.status(200).send({
                      resMsg: "Order has been placed and sent to the kitchen",
                    });
                  }
                });
              }
            } catch (error) {
              return res.status(200).send({ resMsg: error.toString() });
            }
          })();
        }
      });
    }
  });
});

// Custom PATCH Calls

app.patch("/backend/backendUpdateLocationsData", (req, res) => {
  const { ID, building, area, subarea, entry_user } = req.body;
  let sql = mysql2.format(
    "SELECT * FROM order_locations WHERE order_locations_id=?;",
    [ID]
  );
  con.query(sql, (err, data) => {
    if (err) {
      return res.status(200).send({
        resMsg:
          "A server error has occurred. Please contact support if this does not resolve momentarily.",
      });
    } else if (data.length < 1) {
      return res.status(200).send({
        resMsg:
          "The item that you were trying to update has since been removed.",
      });
    } else {
      let sqlTemp =
        "UPDATE order_locations SET order_locations_building=?, order_locations_area=?, order_locations_subarea=?, order_locations_modification_user=?, order_locations_modification_time=CURRENT_TIMESTAMP() WHERE order_locations_id=?;";
      let sql = mysql2.format(sqlTemp, [
        building,
        area,
        subarea,
        entry_user,
        ID,
      ]);

      con.execute(sql, (err, result) => {
        if (err) {
          return res.status(200).send({
            resMsg:
              "An error occurred while updating the item in the database.",
          });
        } else {
          return res.status(200).send({
            resMsg: `${result.affectedRows} row(s) were affected by the update.`,
          });
        }
      });
    }
  });
});

app.patch("/backend/backendUpdateLocationsData", (req, res) => {
  const { ID, building, area, subarea, entry_user } = req.body;
  let sql = mysql2.format(
    "SELECT * FROM order_locations WHERE order_locations_id=?;",
    [ID]
  );
  con.query(sql, (err, data) => {
    if (err) {
      return res.status(200).send({
        resMsg:
          "A server error has occurred. Please contact support if this does not resolve momentarily.",
      });
    } else if (data.length < 1) {
      return res.status(200).send({
        resMsg:
          "The item that you were trying to update has since been removed.",
      });
    } else {
      let sqlTemp =
        "UPDATE order_locations SET order_locations_building=?, order_locations_area=?, order_locations_subarea=?, order_locations_modification_user=?, order_locations_modification_time=CURRENT_TIMESTAMP() WHERE order_locations_id=?;";
      let sql = mysql2.format(sqlTemp, [
        building,
        area,
        subarea,
        entry_user,
        ID,
      ]);

      con.execute(sql, (err, result) => {
        if (err) {
          return res.status(200).send({
            resMsg:
              "An error occurred while updating the item in the database.",
          });
        } else {
          return res.status(200).send({
            resMsg: `${result.affectedRows} row(s) were affected by the update.`,
          });
        }
      });
    }
  });
});

app.patch("/backend/backendUpdateInventoryData", (req, res) => {
  const {
    ID,
    name,
    description,
    type,
    price,
    quantity,
    unit,
    entry_user,
  } = req.body;
  let sql = mysql2.format(
    "SELECT * FROM inventory_items WHERE inventory_items_id=?;",
    [ID]
  );
  con.query(sql, (err, data) => {
    if (err) {
      return res.status(200).send({
        resMsg:
          "A server error has occurred. Please contact support if this does not resolve momentarily.",
      });
    } else if (data.length < 1) {
      return res.status(200).send({
        resMsg:
          "The item that you were trying to update has since been removed.",
      });
    } else {
      let sqlTemp =
        "UPDATE inventory_items SET inventory_items_name=?, inventory_items_description=?, item_types_id=?, inventory_items_price=?, inventory_items_quantity=?, inventory_items_measurement=?, inventory_items_modification_user=?, inventory_items_modification_time=CURRENT_TIMESTAMP() WHERE inventory_items_id=?;";
      let sql = mysql2.format(sqlTemp, [
        name,
        description,
        type,
        price,
        quantity,
        unit,
        entry_user,
        ID,
      ]);

      con.execute(sql, (err, result) => {
        if (err) {
          if (err.errmo === 1452) {
            return res.status(200).send({
              resMsg:
                "The item type that you specified does not exist, please contact your admin to have it added.",
            });
          } else {
            return res.status(200).send({
              resMsg:
                "An error occurred while updating the item in the database.",
            });
          }
        } else {
          return res.status(200).send({
            resMsg: `${result.affectedRows} row(s) were affected by the update.`,
          });
        }
      });
    }
  });
});

app.patch("/backend/backendUpdateMenuData", (req, res) => {
  const { ID, name, description, price, entry_user } = req.body;
  let sql = mysql2.format("SELECT * FROM menu_items WHERE menu_items_id=?;", [
    ID,
  ]);
  con.query(sql, (err, data) => {
    if (err) {
      return res.status(200).send({
        resMsg:
          "A server error has occurred. Please contact support if this does not resolve momentarily.",
      });
    } else if (data.length < 1) {
      return res.status(200).send({
        resMsg:
          "The item that you were trying to update has since been removed.",
      });
    } else {
      let sqlTemp =
        "UPDATE menu_items SET menu_items_name=?, menu_items_description=?, menu_items_sale_price=?, menu_items_modification_user=?, menu_items_modification_time=CURRENT_TIMESTAMP() WHERE menu_items_id=?;";
      let sql = mysql2.format(sqlTemp, [
        name,
        description,
        price,
        entry_user,
        ID,
      ]);

      con.execute(sql, (err, result) => {
        if (err) {
          return res.status(200).send({
            resMsg:
              "An error occurred while updating the item in the database.",
          });
        } else {
          return res.status(200).send({
            resMsg: `${result.affectedRows} row(s) were affected by the update.`,
          });
        }
      });
    }
  });
});

app.patch("/backend/backendUpdateOrderData", (req, res) => {
  const {
    ID,
    locationID,
    status,
    note,
    entry_user,
    modificationUser,
  } = req.body;
  let sql = mysql2.format("SELECT * FROM orders WHERE orders_id=?;", [ID]);

  con.query(sql, (err, data) => {
    if (err) {
      return res.status(200).send({
        resMsg:
          "A server error has occurred. Please contact support if this does not resolve momentarily.",
      });
    } else if (data.length < 1) {
      return res.status(200).send({
        resMsg:
          "The order that you were trying to update has since been removed.",
      });
    } else {
      let sqlTemp =
        "UPDATE orders SET order_locations_id=?, orders_status=?, orders_note=?, orders_entry_user=?, orders_modification_user=?, orders_modification_time=CURRENT_TIMESTAMP() WHERE orders_id=?;";
      let sql = mysql2.format(sqlTemp, [
        locationID,
        status,
        note,
        entry_user,
        modificationUser,
        ID,
      ]);

      con.execute(sql, (err, result) => {
        if (err) {
          if (err.errmo === 1452) {
            return res.status(200).send({
              resMsg:
                "The location ID that you specified does not exist, please contact your admin to have it added.",
            });
          } else {
            return res.status(200).send({
              resMsg:
                "An error occurred while updating the item in the database.",
            });
          }
        } else {
          return res.status(200).send({
            resMsg: `${result.affectedRows} row(s) were affected by the update.`,
          });
        }
      });
    }
  });
});

app.patch("/backend/backendUpdateUserData", (req, res) => {
  const {
    username,
    password,
    name,
    position,
    phone,
    email,
    address,
    privileges,
    modificationUser,
  } = req.body;
  let sql = mysql2.format("SELECT * FROM users WHERE users_username=?;", [
    username,
  ]);

  con.query(sql, (err, data) => {
    if (err) {
      return res.status(200).send({
        resMsg:
          "A server error has occurred. Please contact support if this does not resolve momentarily.",
      });
    } else if (data.length < 1) {
      return res.status(200).send({
        resMsg:
          "The user that you were trying to update was not able to be found.",
      });
    } else {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          return res.status(200).send({ resMsg: "Server error occurred" });
        } else {
          let sqlTemp =
            "UPDATE users SET users_password=?, users_name_actual=?, users_position=?, users_phone=?, users_email=?, users_address=?, users_privileges=?, users_modification_user=?, users_modification_time=CURRENT_TIMESTAMP() WHERE users_username=?;";
          let sql = mysql2.format(sqlTemp, [
            hash,
            name,
            position,
            phone,
            email,
            address,
            privileges,
            modificationUser,
            username,
          ]);

          con.execute(sql, (err, result) => {
            if (err) {
              return res.status(200).send({
                resMsg:
                  "An error occurred while updating the user in the system.",
              });
            } else {
              return res.status(200).send({
                resMsg: `${result.affectedRows} row(s) were affected by the update.`,
              });
            }
          });
        }
      });
    }
  });
});

app.patch("/backend/backendUpdateScheduleData", (req, res) => {
  const { day, openHour, closeHour, modificationUser } = req.body;
  let sql = mysql2.format(
    "SELECT * FROM order_hours WHERE order_hours_day=?;",
    [day]
  );
  con.query(sql, (err, data) => {
    if (err) {
      return res.status(200).send({
        resMsg:
          "A server error has occurred. Please contact support if this does not resolve momentarily.",
      });
    } else if (data.length < 1) {
      return res.status(200).send({
        resMsg:
          "The day that you were trying to update has since been removed.",
      });
    } else {
      let sqlTemp =
        "UPDATE order_hours SET order_hours_open=?, order_hours_close=?, order_hours_modification_user=?, order_hours_modification_time=CURRENT_TIMESTAMP() WHERE order_hours_day=?;";
      let sql = mysql2.format(sqlTemp, [
        openHour,
        closeHour,
        modificationUser,
        day,
      ]);

      con.execute(sql, (err, result) => {
        if (err) {
          return res.status(200).send({
            resMsg:
              "An error occurred while updating the schedule in the database.",
          });
        } else {
          return res.status(200).send({
            resMsg: `${result.affectedRows} row(s) were affected by the update.`,
          });
        }
      });
    }
  });
});

// Custom GET Calls

app.get("/backend/backendInventoryLoadTypes", (req, res) => {
  const sqlTemp = "SELECT item_types_id, item_types_type FROM item_types;";
  const sql = mysql2.format(sqlTemp, []);
  con.query(sql, (err, data) => {
    if (err) {
      return res.status(200).send({ resMsg: "Server error occurred" });
    } else {
      return res.status(200).send({ arrayData: data });
    }
  });
});

app.get("/backend/MenuIngridientsInventory", (req, res) => {
  let sqlTemp =
    'SELECT inventory_items_id, CONCAT(inventory_items_name, " - ", inventory_items_measurement) AS `item` FROM inventory_items;';
  let sql = mysql2.format(sqlTemp, []);
  con.query(sql, (err, data) => {
    if (err) {
      return res.status(200).send({
        resMsg: "Error loading available inventory items from database.",
      });
    } else {
      if (data.length === 0) {
        return res.status(200).send({
          resMsg:
            "There are no items in the inventory. Please add some via the corresponding menu option.",
        });
      } else {
        return res.status(200).send({ arrayData: data });
      }
    }
  });
});

app.get("/backend/LoadOrderData", (req, res) => {
  let sqlTemp =
    'SELECT order_locations_id, CONCAT(order_locations_area, " - ", order_locations_subarea) as "area" FROM order_locations;';
  con.query(mysql2.format(sqlTemp, []), (err, data) => {
    if (err) {
      return res
        .status(200)
        .send({ resMsg: "Error loading available locations from database." });
    } else if (data.length === 0) {
      return res.status(200).send({
        resMsg:
          "There are no locations in the system. Please add some via the corresponding menu option.",
      });
    } else {
      const locations = data;
      let sqlTemp =
        'SELECT menu_items_id, CONCAT(menu_items_name, " - ", "$",menu_items_sale_price) AS "item" FROM menu_items;';
      con.query(mysql2.format(sqlTemp, []), (err, data) => {
        if (err) {
          return res.status(200).send({
            resMsg: "Error loading available locations from database.",
          });
        } else if (data.length === 0) {
          return res.status(200).send({
            resMsg:
              "There are no menu items in the system. Please add some via the corresponding menu option.",
          });
        } else {
          return res.status(200).send({
            arrayDataLocations: locations,
            arrayDataMenuItems: data,
          });
        }
      });
    }
  });
});

app.get("/backend/backendLoadLocationsData", (req, res) => {
  let sqlTemp =
    'SELECT order_locations_building as "Building", order_locations_area AS "Area", order_locations_subarea AS "Subarea" FROM order_locations;';
  con.query(mysql2.format(sqlTemp, []), (err, data, meta) => {
    if (err) {
      return res
        .status(200)
        .send({ resMsg: "Error loading available locations from database." });
    } else if (data.length === 0) {
      return res.status(200).send({
        resMsg:
          "There are no locations in the system. Please add some via the corresponding menu option.",
      });
    } else {
      return res.status(200).send({
        resMsg: `Server was last polled at ${new Date(Date.now()).toString()}`,
        arrayData: data,
        arrayHeaderData: meta.map((metaData) => {
          return metaData.name;
        }),
      });
    }
  });
});

app.get("/backend/backendLoadFullLocationsData", (req, res) => {
  let sqlTemp =
    'SELECT order_locations_id AS "ID", order_locations_building as "Building", order_locations_area AS "Area", order_locations_subarea AS "Subarea" FROM order_locations;';
  con.query(mysql2.format(sqlTemp, []), (err, data, meta) => {
    if (err) {
      return res
        .status(200)
        .send({ resMsg: "Error loading available locations from database." });
    } else if (data.length === 0) {
      return res.status(200).send({
        resMsg:
          "There are no locations in the system. Please add some via the corresponding menu option.",
      });
    } else {
      return res.status(200).send({
        resMsg: `Server was last polled at ${new Date(Date.now()).toString()}`,
        arrayData: data,
        arrayHeaderData: meta.map((metaData) => {
          return metaData.name;
        }),
      });
    }
  });
});

app.get("/backend/backendLoadInventoryData", (req, res) => {
  let sqlTemp =
    'SELECT inventory_items_name as "Item Name", inventory_items_description AS "Item Description", item_types_id AS "Item Type", inventory_items_price AS "Item Price", inventory_items_quantity AS "Quantity Available", inventory_items_measurement AS "Measurement Unit" FROM inventory_items;';
  con.query(mysql2.format(sqlTemp, []), (err, data, meta) => {
    if (err) {
      return res
        .status(200)
        .send({ resMsg: "Error loading available inventory from database." });
    } else if (data.length === 0) {
      return res.status(200).send({
        resMsg:
          "There are no inventory items in the system. Please add some via the corresponding menu option.",
      });
    } else {
      return res.status(200).send({
        resMsg: `Server was last polled at ${new Date(Date.now()).toString()}`,
        arrayData: data,
        arrayHeaderData: meta.map((metaData) => {
          return metaData.name;
        }),
      });
    }
  });
});

app.get("/backend/backendLoadFullInventoryData", (req, res) => {
  let sqlTemp =
    'SELECT inventory_items_id AS "ID", inventory_items_name as "Item Name", inventory_items_description AS "Item Description", item_types_id AS "Item Type", inventory_items_price AS "Item Price", inventory_items_quantity AS "Quantity Available", inventory_items_measurement AS "Measurement Unit" FROM inventory_items;';
  con.query(mysql2.format(sqlTemp, []), (err, data, meta) => {
    if (err) {
      return res
        .status(200)
        .send({ resMsg: "Error loading available inventory from database." });
    } else if (data.length === 0) {
      return res.status(200).send({
        resMsg:
          "There are no inventory items in the system. Please add some via the corresponding menu option.",
      });
    } else {
      return res.status(200).send({
        resMsg: `Server was last polled at ${new Date(Date.now()).toString()}`,
        arrayData: data,
        arrayHeaderData: meta.map((metaData) => {
          return metaData.name;
        }),
      });
    }
  });
});

app.get("/backend/backendLoadMenuData", (req, res) => {
  let sqlTemp =
    'SELECT menu_items_name as "Menu Item Name", menu_items_description AS "Menu Item Description", menu_items_sale_price AS "Menu Item Price" FROM menu_items;';
  con.query(mysql2.format(sqlTemp, []), (err, data, meta) => {
    if (err) {
      return res
        .status(200)
        .send({ resMsg: "Error loading available menu items from database." });
    } else if (data.length === 0) {
      return res.status(200).send({
        resMsg:
          "There are no menu items in the system. Please add some via the corresponding menu option.",
      });
    } else {
      return res.status(200).send({
        resMsg: `Server was last polled at ${new Date(Date.now()).toString()}`,
        arrayData: data,
        arrayHeaderData: meta.map((metaData) => {
          return metaData.name;
        }),
      });
    }
  });
});

app.get("/backend/backendLoadFullMenuData", (req, res) => {
  let sqlTemp =
    'SELECT menu_items_id AS "ID", menu_items_name AS "Menu Item Name", menu_items_description AS "Menu Item Description", menu_items_sale_price AS "Menu Item Price" FROM menu_items;';
  con.query(mysql2.format(sqlTemp, []), (err, data, meta) => {
    if (err) {
      return res
        .status(200)
        .send({ resMsg: "Error loading available menu items from database." });
    } else if (data.length === 0) {
      return res.status(200).send({
        resMsg:
          "There are no menu items in the system. Please add some via the corresponding menu option.",
      });
    } else {
      return res.status(200).send({
        resMsg: `Server was last polled at ${new Date(Date.now()).toString()}`,
        arrayData: data,
        arrayHeaderData: meta.map((metaData) => {
          return metaData.name;
        }),
      });
    }
  });
});

app.get("/backend/backendLoadUserData", (req, res) => {
  let sqlTemp =
    'SELECT users_username as "Username", users_name_actual AS "Name", users_position AS "Position", users_phone AS "Phone", users_email AS "Email", users_address AS "Address", users_privileges AS "Privileges" FROM users;';
  con.query(mysql2.format(sqlTemp, []), (err, data, meta) => {
    if (err) {
      return res
        .status(200)
        .send({ resMsg: "Error loading available users from database." });
    } else if (data.length === 0) {
      return res.status(200).send({
        resMsg:
          "There are no users in the system. Please add some via the corresponding menu option.",
      });
    } else {
      return res.status(200).send({
        resMsg: `Server was last polled at ${new Date(Date.now()).toString()}`,
        arrayData: data,
        arrayHeaderData: meta.map((metaData) => {
          return metaData.name;
        }),
      });
    }
  });
});

app.get("/backend/backendLoadFullUserData", (req, res) => {
  let sqlTemp =
    'SELECT users_username as "Username", users_password AS "Password", users_name_actual AS "Full Name", users_position AS "Position", users_phone AS "Phone", users_email AS "Email", users_address AS "Address", users_privileges AS "Privileges" FROM users;';
  con.query(mysql2.format(sqlTemp, []), (err, data, meta) => {
    if (err) {
      return res
        .status(200)
        .send({ resMsg: "Error loading available users from database." });
    } else if (data.length === 0) {
      return res.status(200).send({
        resMsg:
          "There are no users in the system. Please add some via the corresponding menu option.",
      });
    } else {
      return res.status(200).send({
        resMsg: `Server was last polled at ${new Date(Date.now()).toString()}`,
        arrayData: data,
        arrayHeaderData: meta.map((metaData) => {
          return metaData.name;
        }),
      });
    }
  });
});

app.get("/backend/backendLoadAllOrderData", (req, res) => {
  let sqlTemp =
    'SELECT CONCAT(order_locations.order_locations_area, " ", order_locations.order_locations_subarea) as "Location", orders_status AS "Order Status", orders_note AS "Note", orders_entry_user AS "Entry User", orders_entry_time AS "Entry Time", orders_modification_time AS "Last Modification Time" FROM orders INNER JOIN order_locations on orders.order_locations_id=order_locations.order_locations_id;';
  con.query(mysql2.format(sqlTemp, []), (err, data, meta) => {
    if (err) {
      return res
        .status(200)
        .send({ resMsg: "Error loading orders from database." });
    } else if (data.length === 0) {
      return res.status(200).send({
        resMsg:
          "There are no orders in the system. Please add some via the corresponding menu option.",
      });
    } else {
      return res.status(200).send({
        resMsg: `Server was last polled at ${new Date(Date.now()).toString()}`,
        arrayData: data,
        arrayHeaderData: meta.map((metaData) => {
          return metaData.name;
        }),
      });
    }
  });
});

app.get("/backend/backendLoadFullOrderData", (req, res) => {
  let sqlTemp =
    'SELECT  orders_id as "ID", order_locations_id AS "Location ID", orders_status AS "Order Status", orders_note AS "Note", orders_entry_user AS "Entry User", orders_modification_time AS "Last Modification Time" FROM orders;';
  con.query(mysql2.format(sqlTemp, []), (err, data, meta) => {
    if (err) {
      return res
        .status(200)
        .send({ resMsg: "Error loading orders from database." });
    } else if (data.length === 0) {
      return res.status(200).send({
        resMsg:
          "There are no orders in the system. Please add some via the corresponding menu option.",
      });
    } else {
      return res.status(200).send({
        resMsg: `Server was last polled at ${new Date(Date.now()).toString()}`,
        arrayData: data,
        arrayHeaderData: meta.map((metaData) => {
          return metaData.name;
        }),
      });
    }
  });
});

app.get("/backend/backendLoadScheduleData", (req, res) => {
  let sqlTemp =
    'SELECT order_hours_day as "Day", order_hours_open as "Opening Time", order_hours_close AS "Closing Time"  FROM stronsen_capstone262.order_hours ORDER BY CASE WHEN order_hours_day = "Monday" THEN 1 WHEN order_hours_day = "Tuesday" THEN 2 WHEN order_hours_day = "Wednesday" THEN 3 WHEN order_hours_day = "Thursday" THEN 4 WHEN order_hours_day = "Friday" THEN 5 WHEN order_hours_day = "Saturday" THEN 6 WHEN order_hours_day = "Sunday" THEN 7 END;';
  con.query(mysql2.format(sqlTemp, []), (err, data, meta) => {
    if (err) {
      return res
        .status(200)
        .send({ resMsg: "Error loading schedule from database." });
    } else if (data.length === 0) {
      return res.status(200).send({
        resMsg:
          "There is no schedule in the system. Please add one via the corresponding menu option.",
      });
    } else {
      return res.status(200).send({
        resMsg: `Server was last polled at ${new Date(Date.now()).toString()}`,
        arrayData: data,
        arrayHeaderData: meta.map((metaData) => {
          return metaData.name;
        }),
      });
    }
  });
});

// System Delete Calls

app.post("/backend/backendRemoveLocationsData", (req, res) => {
  const ID = req.body.ID;

  let sql = mysql2.format(
    "DELETE from order_locations WHERE order_locations_id=?;",
    [ID]
  );
  con.execute(sql, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200).send({
        resMsg: `${result.affectedRows} row(s) were affected by the removal.`,
      });
    }
  });
});

app.post("/backend/backendRemoveUserData", (req, res) => {
  const ID = req.body.username;

  let sql = mysql2.format("DELETE from users WHERE users_username=?;", [ID]);
  con.execute(sql, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200).send({
        resMsg: `${result.affectedRows} row(s) were affected by the removal.`,
      });
    }
  });
});

app.post("/backend/backendRemoveInventoryData", (req, res) => {
  const ID = req.body.ID;

  let sql = mysql2.format(
    "SELECT * FROM menu_ingredients WHERE menu_ingredients_id =?;",
    [ID]
  );
  con.query(sql, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      if (data.length > 0) {
        res.status(200).send({
          resMsg: `Item cannot be removed as it is an ingridient in at least one menu item.`,
        });
      } else {
        let sql = mysql2.format(
          "DELETE FROM inventory_items where inventory_items_id = ?;",
          [ID]
        );
        con.execute(sql, (err, result) => {
          if (err) {
            res.send(err);
          } else {
            res.status(200).send({
              resMsg: `${result.affectedRows} row(s) were affected by the removal.`,
            });
          }
        });
      }
    }
  });
});

app.post("/backend/backendRemoveMenuData", (req, res) => {
  const ID = req.body.ID;
  let sql = mysql2.format(
    "DELETE from menu_ingredients WHERE menu_items_id= ? ;",
    [ID]
  );
  con.execute(sql, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      let sqlInner = mysql2.format(
        "DELETE FROM menu_items WHERE menu_items_id = ? ;",
        [ID]
      );
      con.execute(sqlInner, (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.status(200).send({
            resMsg: `${result.affectedRows} row(s) were affected by the removal.`,
          });
        }
      });
    }
  });
});

app.post("/backend/backendRemoveOrderData", (req, res) => {
  const ID = req.body.ID;
  let sql = mysql2.format("DELETE from order_items WHERE orders_id= ? ;", [ID]);
  con.execute(sql, (err, result) => {
    if (err) {
      console.log(err.message)
      res.send(err);
    } else {
      let sqlInner = mysql2.format("DELETE FROM orders WHERE orders_id = ? ;", [
        ID,
      ]);
      con.execute(sqlInner, (err, result) => {
        if (err) {
          console.log(err.message)
          res.send(err);
        } else {
          res.status(200).send({
            resMsg: `${result.affectedRows} row(s) were affected by the removal.`,
          });
        }
      });
    }
  });
});

app.get("/accessdenied", (req, res) => {
  res.status(200).render("backendhome", {
    header_content: "Access Denied",
    footer_content,
  });
});

app.get("/*", (req, res) => {
  res.status(404).render("404", {
    header_content: "404",
    body_message:
      "The requested page was not able to be located. Please use the above links to return back to the main website.",
    footer_content,
  });
});
app.listen(app.get("port"), function () {
  console.log(
    "Capstone server started: http://localhost:" + app.get("port") + "/"
  );
});
