import express from "express";
import * as qsql from './qtools/qsql.js';

const app = express();
const port = 3022;

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
            <li><a href="http://localhost:${port}/employees/23">http://localhost:${port}/employees/23</a> = employee with ID 23</li>
            <li><a href="http://localhost:${port}/employees-territories/23">http://localhost:${port}/employees-territories/23</a> = territories of employee with ID 23</li>
        </ul>
    `);
});

app.get('/employees', async (req, res) => {
    const employees = await qsql.getRecordsWithSql('SELECT * FROM Employees');
    res.send(employees);
});

app.get('/employees/:id', async (req, res) => {
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



app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
});
