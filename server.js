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
                'View All Employees By Manager',
                "View All Roles",
                "View All Departments",
                // 'View Combined Salaries by Department',
                "Add Employee",
                "Add Role",
                "Add Department",
                "Remove Employee",
                "Remove Role",
                "Remove Department",
                "Update Employee Role",
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
                
            case 'View All Roles':
                console.log("clicked on View All Roles");
                viewAllRoles();
                break;
                
            case 'View All Departments':
                console.log("clicked on View All Departments");
                viewAllDepartments();
                break;

            case 'View All Employees By Manager':
                console.log("clicked on View All Employees By Manager");
                viewAllEmployeesByManager();
                break;
    
            case 'View All Employees By Department':
                console.log("clicked on View All Employees By Department");
                viewAllEmployeesByDept();
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

// ----------------- UPDATE DATABASE ----------------------

const updateEmployeeRole = async () => {
    // ask which employee?
    // ask what to update to?
    // pass the parameters into update employee role
    // replace the ? with the parameters passed in
    // KEEP IN MIND THE JOINS
    let employeeList = await getEmployees();
    let roleList = await getRoles();
    inquirer
    .prompt([
        {
            name: 'chosen_employee',
            type: 'list',
            message: "Which employee's role would you like to update?",
            choices: employeeList.map((employee) => {
                return employee.employee_name;
            })
        },
        {
            name: 'updated_role',
            type: 'list',
            message: "What is the employee's new role?",
            choices: roleList.map((role) => {
                return role.title;
            }),
        },
    ])
    .then ((answer) => {

        let employeeId;

        for (let i = 0; i < employeeList.length; i++) {
            if (employeeList[i].employee_name === answer.chosen_employee) {
                employeeId = employeeList[i].id;
            };
        };
        
        selectedEmployee = employeeList.find((employee) => employee.employee_name === answer.chosen_employee);
        
        let roleId;

        for (let i = 0; i < roleList.length; i++) {
            if (roleList[i].title === answer.updated_role) {
                roleId = roleList[i].id;
            };
        };

        selectedRole = roleList.find((role) => role.title === answer.updated_role);


        const query = connection.query(
            `UPDATE employee SET ? WHERE ?`,
            [
                {
                    role_id: roleId,
                },
                {
                    id: employeeId,
                }
            ],
            (err, res) => {
            if (err) throw err;
            // Inform user that the employee's role has been updated
            console.log(`Updated ${answer.chosen_employee}'s role to be ${answer.updated_role} in the employee table in the database`)
            whatProcess();
            }
        );
    });
};


// -------------------- VIEW DATABASE --------------------

const viewAllEmployees = () => {
    const query = `SELECT b.id, b.first_name, b.last_name, role.title, department.department_name ,role.salary, CONCAT(m.first_name, ' ', m.last_name) manager FROM employee b LEFT JOIN employee m ON m.id = b.manager_id LEFT JOIN role ON role.id = b.role_id LEFT JOIN department ON department.id = role.department_id`;

    connection.query(query, (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement
        renderTable(res);
        whatProcess();
    });
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

const viewAllEmployeesByManager = async () => {
    let managerList = await getManagers();

    inquirer
        .prompt({
            name: 'employees_by_manager',
            type: 'list',
            message: "Which manager's employees would you like to view?",
            choices: managerList.map((manager) => {
                return manager.first_name;
            })
        })
        .then((answer) => {
            let managerChoice = answer.employees_by_manager;
            console.log(managerChoice);


            let managerId;

            for (let i = 0; i < managerList.length; i++) {
                if (managerList[i].first_name === answer.employees_by_manager) {
                    managerId = managerList[i].id;
                };
            };

            selectedManager = managerList.find((manager) => manager.first_name === answer.employees_by_manager);


            const query = `SELECT b.id, b.first_name, b.last_name, role.title, department.department_name ,role.salary, CONCAT(m.first_name, ' ', m.last_name) manager FROM employee b LEFT JOIN employee m ON m.id = b.manager_id LEFT JOIN role ON role.id = b.role_id LEFT JOIN department ON department.id = role.department_id WHERE b.manager_id = ?`;

            connection.query(query,[selectedManager.id] ,(err, res) => {
                if (err) throw err;
                // Log all results of the SELECT statement
                renderTable(res);
                whatProcess();
            });
        })
};


const viewAllEmployeesByDept = async () => {
    let departmentList = await getDepartments();
    
    inquirer
        .prompt({
            name: 'employees_by_department',
            type: 'list',
            message: "Which department's employees would you like to view?",
            choices: departmentList.map((department) => {
                return department.department_name;
            })
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
        });
};


// --------------- ADD TO DATABASE ---------------------

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


const addRole = async () => {
    let departmentList = await getDepartments();

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
        choices: departmentList.map((department) => {
            return department.department_name;
        }),
    },
    ]).then((answer) => {
        let departmentId;

        for (let i = 0; i < departmentList.length; i++) {
            if (departmentList[i].department_name === answer.new_role_department) {
                departmentId = departmentList[i].id;
            };
        };

        selectedDepartment = departmentList.find((department) => department.department_name === answer.new_role_department);
    
        const query = connection.query(
            `INSERT INTO role SET ?`,
            {
                title: answer.new_role_title,
                salary: answer.new_role_salary,
                department_id: selectedDepartment.id,
            },
            (err, res) => {
                if (err) throw err;
                console.log(`Added ${answer.new_role_title} to the role table in the database.`)
                whatProcess();
            }
        );

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

// --------------------------- REMOVE ---------------------------------
const removeEmployee = async () => {
    let employeeList = await getEmployees();
    inquirer
    .prompt([
        {
            name: 'chosen_employee',
            type: 'list',
            message: "Which employee would you like to remove?",
            choices: employeeList.map((employee) => {
                return employee.employee_name;
            })
        },
    ])
    .then ((answer) => {

        let employeeId;

        for (let i = 0; i < employeeList.length; i++) {
            if (employeeList[i].employee_name === answer.chosen_employee) {
                employeeId = employeeList[i].id;
            };
        };
        
        selectedEmployee = employeeList.find((employee) => employee.employee_name === answer.chosen_employee);
        
        const query = connection.query(
            `DELETE FROM employee WHERE ?`,
            [
                {
                    id: employeeId,
                },
            ],
            (err, res) => {
            if (err) throw err;
            // Inform user that the employee's role has been updated
            console.log(`Removed ${answer.chosen_employee}from the employee table in the database`)
            whatProcess();
            }
        );
    });
};

const removeRole = async () => {
    let roleList = await getRoles();
    inquirer
    .prompt([
        {
            name: 'chosen_role',
            type: 'list',
            message: "Which role would you like to remove?",
            choices: roleList.map((role) => {
                return role.title;
            })
        },
    ])
    .then ((answer) => {

        let roleId;

        for (let i = 0; i < roleList.length; i++) {
            if (roleList[i].title === answer.chosen_role) {
                roleId = roleList[i].id;
            };
        };
        
        selectedRole = roleList.find((role) => role.title === answer.chosen_role);

        // Diasable ALL foreign keys to be able to delete a role.
        connection.query(`SET FOREIGN_KEY_CHECKS=0;`, (err, res) => {
            if (err) throw err;
            console.log("have temporarily disabled all the foreign keys");
        });
        
        const query =  `DELETE FROM employees.role WHERE id = ? ;`;
        connection.query(query, [roleId], (err, res) => {
            if (err) throw err;
            // Inform user that the employee's role has been updated
            console.log(`Removed ${answer.chosen_role} from the role table in the database.\n NOTE: you may have to reassign roles to employees who had the role ${answer.chosen_role}.`)
            whatProcess();
        }
        );

        // Re-enabled ALL foreign keys to be able to prevent from deleting a role.
        connection.query(`SET FOREIGN_KEY_CHECKS=0;`, (err, res) => {
            if (err) throw err;
            console.log("have re-enabled all the foreign keys");
        });
    });
};

const removeDepartment = async () => {
    let departmentList = await getDepartments();
    inquirer
    .prompt([
        {
            name: 'chosen_department',
            type: 'list',
            message: "Which department would you like to remove?",
            choices: departmentList.map((department) => {
                return department.department_name;
            })
        },
    ])
    .then ((answer) => {

        let departmentId;

        for (let i = 0; i < departmentList.length; i++) {
            if (departmentList[i].department_name === answer.chosen_department) {
                departmentId = departmentList[i].id;
            };
        };
        
        selectedDepartment = departmentList.find((department) => department.department_name === answer.chosen_department);

        // Diasable ALL foreign keys to be able to delete a role.
        connection.query(`SET FOREIGN_KEY_CHECKS=0;`, (err, res) => {
            if (err) throw err;
            console.log("have temporarily disabled all the foreign keys");
        });
        
        const query =  `DELETE FROM employees.department WHERE id = ? ;`;
        connection.query(query, [departmentId], (err, res) => {
            if (err) throw err;
            // Inform user that the employee's role has been updated
            console.log(`Removed ${answer.chosen_department} from the department table in the database.\n NOTE: you may have to reassign departments to roles that had the department: ${answer.chosen_department}.`)
            whatProcess();
        }
        );

        // Re-enabled ALL foreign keys to be able to prevent from deleting a role.
        connection.query(`SET FOREIGN_KEY_CHECKS=0;`, (err, res) => {
            if (err) throw err;
            console.log("have re-enabled all the foreign keys");
        });
    });
};

// HELPER FUNCTIONS
const getEmployees = () => {
    const query = `SELECT b.id, CONCAT(b.first_name, ' ',  b.last_name) employee_name, role.title, b.manager_id, CONCAT(m.first_name, ' ', m.last_name) manager  FROM employee b LEFT JOIN role ON role.id = b.role_id LEFT JOIN employee m ON m.id = b.manager_id;`;
    return new Promise ((resolve,reject) => {
        connection.query(query, (err, res) => {
            if (err) throw (err);
            resolve(res);
        });
    });
};

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

const getDepartments = () => {
    const query = `SELECT department.id, department.department_name FROM department;`;
    return new Promise ((resolve, reject) => {
        connection.query(query, (err, res) => {
            if (err) throw (err);
            resolve(res);
        });
    });
};
