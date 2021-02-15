const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: 'password2',
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
                "Add Employee",
                // "Add Role",
                "Add Department",
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



const addEmployee = async () => {
    let managerList = await getManagers();
    managerList.push({first_name: 'None'});
    let roleList = await getRoles();
    console.log(managerList);
    inquirer
    .prompt([
    {
        name: 'first_name',
        type: 'input',
        message: "What is the employee's first name?",
    },
    {
        name: 'last_name',
        type: 'input',
        message: "What is the employee's last name?",
    },
    {
        name: 'role',
        type: 'list',
        message: "What is the employee's role?",
        choices: roleList.map((role) => {
            return role.title;
        }),
    },
    {
        name: 'manager',
        type: 'list',
        message: "Who is the employee's manager?",
        choices: managerList.map((manager) => {
            return manager.first_name;
        }),
    }
    ]).then((answer) => {

        let roleId;

        for (let i = 0; i < roleList.length; i++) {
            if (roleList[i].title === answer.role) {
                roleId = roleList[i].id;
            };
        };

        selectedRole = roleList.find((role) => role.title === answer.role);


        let managerId;

        for (let i = 0; i < managerList.length; i++) {
            if (managerList[i].first_name === answer.manager) {
                managerId = managerList[i].id;
            };
        };

        selectedManager = managerList.find((manager) => manager.first_name === answer.manager);

        const query = connection.query(
            `INSERT INTO employee SET ?`,
            {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: selectedRole.id,
                manager_id: selectedManager.id,
            },
            (err, res) => {
                if (err) throw err;
                console.log(`Added ${answer.first_name} ${answer.last_name} to the database`)
                whatProcess();
            }
        );
    });
};

const addRole = () => {
    inquirer
    .prompt([
    {
        name: 'new_role_title',
        type: 'input',
        message: "What is the title of the new role?",
    },
    {
        name: 'new_role_salary',
        type: 'input',
        message: "What is the salary of the new role?",
    },
    {
        name: 'new_role_department',
        type: 'list',
        message: "What is the new role's department?",
        choices: departmentList.map((dept) => {
            return department.department_name;
        }),
    },
    ]).then((answer) => {
        
    });
};



const addDepartment = () => {
    inquirer
    .prompt([
        {
            name: 'new_department_name',
            type: 'input',
            message: "What is the name of the new department?",
        },
    ]).then((answer) => {
        const query = connection.query(
            `INSERT INTO department SET ?`,
            {
                department_name: answer.new_department_name,
            },
            (err, res) => {
                if (err) throw err;
                console.log(`Added ${answer.new_department_name} to the department table`)
                whatProcess();
            }
        );
    });
};

// HELPER FUNCTIONS
const getManagers = () => {
    const query = `SELECT b.id, b.first_name, b.last_name, b.manager_id, role.title FROM employee b LEFT JOIN role ON role.id = b.role_id WHERE b.manager_id is null;`;
    return new Promise ((resolve,reject) => {
        connection.query(query, (err, res) => {
            if (err) throw (err);
            resolve(res);
        });
    });
};

const getRoles = () => {
    const query = `SELECT role.id, role.title, role.salary, role.department_id FROM role;`;
    return new Promise ((resolve, reject) => {
        connection.query(query, (err, res) => {
            if (err) throw (err);
            resolve(res);
        });
    });
};

const getDepartment = () => {
    const query = `SELECT department.id, department.department_name FROM department;`;
    return new Promise ((resolve, reject) => {
        connection.query(query, (err, res) => {
            if (err) throw (err);
            resolve(res);
        });
    });
};

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