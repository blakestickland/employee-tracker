const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: 'bure77Ikunakaiya',
  database: 'employees',
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Made a connection");
  whatProcess();
});

function renderTable(sqlResponse){
    const newArr= []
    sqlResponse.forEach(row=>{
      newArr.push(Object.assign({}, row))
    })
    console.table(newArr)
  };

const whatProcess = () => {
    inquirer
    .prompt(
        // What process to perform on database? 
        {
            name: "choices",
            type: "list",
            message: "What would you like to do with the Employee database",
            choices: [
                'View All Employees',
                'View All Employees By Department',
                // 'View All Employees By Manager',
                "View All Roles",
                "View All Departments",
                // 'View Combined Salaries by Department',
                // "Add Employee",
                // "Remove Employee",
                // "Update Employee Role",
                // "Update Employee Manager",
                'Exit'
            ],
        })
        .then((answer) => {
        switch (answer.choices) {
            case 'View All Employees': 
                console.log("clicked on View all Employees");
                viewAllEmployees();
                break;
                
            case 'View All Employees By Department':
                console.log("clicked on View All Employees By Department");
                viewAllEmployeesByDept();
                break;
                
            case 'View All Employees By Manager':
                console.log("clicked on View All Employees By Manager");
                viewAllEmployeesByManager();
                break;
                
            case 'View All Roles':
                console.log("clicked on View All Roles");
                viewAllRoles();
                break;
                
            case 'View All Departments':
                console.log("clicked on View All Departments");
                viewAllDepartments();
                break;
                
            case 'View Combined Salaries by Department':
                console.log("clicked on View Combined Salaries by Department");
                viewCombinedSalaries();
                break;


            case 'Add Employee':
                console.log("clicked on Add Employee");
                addEmployee();
                break;
            
            case 'Add Role':
                console.log("clicked on Add Role");
                addRole();
                break;
            
            case 'Add Department':
                console.log("clicked on Add Department");
                addDepartment();
                break;
            
            case 'Remove Employee':
                console.log("clicked on Remove Employee");
                removeEmployee();
                break;
            
            case 'Remove Role':
                console.log("clicked on Remove Role");
                removeRole();
                break;
            
            case 'Remove Department':
                console.log("clicked on Remove Department");
                removeDepartment();
                break;
            
            case 'Update Employee Role': 
                console.log("clicked on Update Employee Role");
                updateEmployeeRole();
                break;
            
            case 'Update Employee Manager': 
                console.log("clicked on Update Employee Manager");
                updateEmployeeManager();
                break;
            
            case 'Exit':
                connection.end();
                return;

            default:
                console.log(`Invalid action: ${answer.action}`);
                break;
        }
    });  
};

// const updateEmployeeRole = () => {
//     // ask which employee?
//     // ask what to update to?
//     // pass the parameters into update employee role
//     // replace the ? with the parameters passed in
//     // KEEP IN MIND THE JOINS

//     const query = `UPDATE employees SET ? WHERE employee.role_id `;
//     connection.query(query, [answer.artist, answer.artist], (err, res) => {
//         if (err) throw err;
//         // Log all results of the SELECT statement
//         console.log(res);

// })
// }

const viewAllEmployees = () => {
    const query = `SELECT b.id, b.first_name, b.last_name, role.title, department.department_name ,role.salary, CONCAT(m.first_name, ' ', m.last_name) manager FROM employee b LEFT JOIN employee m ON m.id = b.manager_id LEFT JOIN role ON role.id = b.role_id LEFT JOIN department ON department.id = role.department_id`;

    connection.query(query, (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement
        renderTable(res);
        whatProcess();
    });
};
const viewAllEmployeesByDept = () => {
    inquirer
        .prompt({
            name: 'employees_by_department',
            type: 'list',
            message: "Which department's employees would you like to view?",
            choices: [
                'Sales',
                'Engineering',
                'Finance',
                'Legal',
                'Exit'
            ],
        })
        .then((answer) => {
            let deptChoice = answer.employees_by_department;
            console.log(deptChoice);
            const query = `SELECT b.id, b.first_name, b.last_name, role.title, department.department_name ,role.salary, CONCAT(m.first_name, ' ', m.last_name) manager FROM employee b LEFT JOIN employee m ON m.id = b.manager_id LEFT JOIN role ON role.id = b.role_id LEFT JOIN department ON department.id = role.department_id WHERE (department.department_name = ?)`;

            connection.query(query,[deptChoice] ,(err, res) => {
                if (err) throw err;
                // Log all results of the SELECT statement
                renderTable(res);
                whatProcess();
            });
        })
};

const viewAllRoles = () => {
    const query = `SELECT role.id, role.title, role.salary, department.department_name, CONCAT(employee.first_name, ' ', employee.last_name) employee_name FROM role LEFT JOIN department ON department.id = role.department_id LEFT JOIN employee ON employee.role_id = role.id`;

    connection.query(query, (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement
        renderTable(res);
        whatProcess();
    });
};
const viewAllDepartments = () => {
    const query = `SELECT department.id, department.department_name, role.title, CONCAT(employee.first_name, ' ', employee.last_name) employee_name FROM department LEFT JOIN role ON role.department_id = department.id LEFT JOIN employee ON employee.role_id = role.id`;

    connection.query(query, (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement
        renderTable(res);
        whatProcess();
    });
};
// const getManagers = () => {
//     connection.query(`SELECT b.id, b.first_name, b.last-name, role.title FROM employee b 
//     WHERE (manager_id = 'NULL')`, (err, res) => {
//         console.log(`${res.length} matches found!`);
//         res.forEach(({ id, first_name, last_name, title }, i) => {
//             const num = i =1;
//             console.log(
//                 `${num} || id:${id} || ${first_name} ${last_name} || ${title}`
//             );
//         });
//     })
// }

// const viewAllEmployeesByManager = () => {
//     // getManagers();
//     inquirer
//         .prompt({
//             name: 'employees_by_manager',
//             type: 'list',
//             message: "Which manager's employees would you like to view?",
//             choices: [
//                 'Ashley Rodriguez',
//                 'John Doe',
//                 'Sarah Lourd',
//                 'Exit'
//             ],
//         })
//         .then((answer) => {
//             let managerChoice = answer.employees_by_manager;
//             console.log(managerChoice);
//             const query = `SELECT b.id, b.first_name, b.last_name, role.title, department.department_name ,role.salary, CONCAT(m.first_name, ' ', m.last_name) manager FROM employee b LEFT JOIN employee m ON m.id = b.manager_id LEFT JOIN role ON role.id = b.role_id LEFT JOIN department ON department.id = role.department_id WHERE (CONCAT(b.first_name, ' ', b.last_name) = ?)`;

//             connection.query(query,[managerChoice] ,(err, res) => {
//                 if (err) throw err;
//                 // Log all results of the SELECT statement
//                 renderTable(res);
//                 whatProcess();
//             });
//         })
// };