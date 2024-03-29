import express from "express";
import * as qsql from "./qtools/qsql.js";

const app = express();
const port = 3020;

app.get("/", (req, res) => {
  res.send(`
        <style>
        li {
            font-size: 1.5rem;
        }
        </style>
        <h1>Employee API</h1>
        <ul>
            <li><a href="http://localhost:${port}/employees">http://localhost:${port}/employees</a> = all employees</li>
            <li><a href="http://localhost:${port}/employees/2">http://localhost:${port}/employees/2</a> = employee with ID 2</li>
            <li><a href="http://localhost:${port}/employees-territories/2">http://localhost:${port}/employees-territories/2</a> = territories of employee with ID 2</li>
        </ul>
    `);
});

app.get("/employees", async (req, res) => {
  const employees = await qsql.getRecordsWithSql("SELECT * FROM Employees");
  res.send(employees);
});

app.get("/employees/:id", async (req, res) => {
  const id = req.params.id;
  const employees = await qsql.getRecordsWithSql(`
	SELECT 
EmployeeID as id,
trim(FirstName || ' ' || LastName) as name,
Title as title,
Notes as notes
FROM Employees
WHERE EmployeeID = ${id}
	`);
  res.send(employees[0]);
});

app.get("/employees-territories/:id", async (req, res) => {
  const id = req.params.id;
  const records = await qsql.getRecordsWithSql(`
    SELECT e.EmployeeID as id, e.LastName as lastName, e.FirstName as firstName, trim(t.TerritoryDescription) as territory FROM Employees AS e
    JOIN EmployeeTerritories AS et ON e.EmployeeID = et.EmployeeID
    JOIN Territories AS t ON et.TerritoryID = t.TerritoryID
    WHERE e.EmployeeID = ${id}	
	`);
    
  const obj = {
    name: records[0].firstName + " " + records[0].lastName,
    territories: records.map((m) => m.territory),
  };
  res.send(obj);
});

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
