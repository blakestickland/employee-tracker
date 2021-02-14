// Packages needed for this application
const fs = require('fs');
const mysql = require('mysql');
const inquirer = require('inquirer');
// const cTable = require('console.table');
const chalk = require('chalk');
const figlet = require('figlet');

// Import Classes from lib folder
const Manager = require('./lib/Manager');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');
const { number } = require('yargs');
const { run } = require('jest');



// class Questions {
//     constructor() {
//         this.team = [];
//     }
//     start() {
//         // initialising
//         this.whatProcess();
//     }
// };

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

// Database Connect and Starter Title

const afterConnection = () => {
        // console.log(chalk.yellow.bold(`====================================================================================`));
        // console.log(``);
        // console.log(chalk.greenBright.bold(figlet.textSync('Employee Tracker')));
        // console.log(``);
        // console.log(`                                                          ` + chalk.greenBright.bold('Created By: Joseph DeWoody'));
        // console.log(``);
        // console.log(chalk.yellow.bold(`====================================================================================`));
        whatProcess();

//   connection.query('SELECT * FROM songs', (err, res) => {
//     if (err) throw err;
//     res.forEach(({id, title, artist, genre}) => {
//         console.log(`${id} | ${title} | ${artist} | ${genre}`);
//     });
//     console.log('----------------------------------')
//   });


// Use Inquirer to ask questions in a recursive loop and store results to an Array called 'team'.


    const whatProcess = () => {
    inquirer.prompt([
        // What process to perform on database? 
        {
            name: "choices",
            type: "list",
            message: "What would you like to do with the Employee database",
            choices: [
                "View All Employees",
                "View All Roles",
                "View All Departments",
                // "Add",
                // "Update",
                "Exit"
            ]
        } 
    ]).then((response) => {
        const { choices } = response;

        if (choices === "View All Employees") {
            console.log("clicked on View all Employees");
            // this.askAddQuestions();
        } else if (choices === "View All Roles") {
            console.log("clicked on View all Roles");
            // this.askViewQuestions();
        } else if (choices === "View All Departments") {
            console.log("clicked on View all Deaprtments");
            // this.askUpdateQuestions();
        }
        else {
            return;
        }
    });
}
};

        

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  afterConnection();
});



    
    // anotherTeamMember() {
    //     inquirer.prompt([
    //         // Add a team member?
    //         {
    //             type: "confirm",
    //             name: "addTeamMember",
    //             message: "Would you like to add a team member?"
    //         }
    //     ]).then((response) => {
    //         if (response.addTeamMember) {
    //             this.whatTypeOfEmployee();
    //         } else {
    //             this.generateHtml();
    //         }
    //     });
    // }
    // whatTypeOfEmployee() {
    //     inquirer.prompt([
    //         // What type of employee? 
    //         {
    //             type: "list",
    //             name: "type",
    //             message: "What role would you like to add to your team?",
    //             choices: [
    //                 "Manager",
    //                 "Engineer",
    //                 "Intern",
    //             ]
    //         } 
    //     ]).then((response) => {
    //         if (response.type === "Manager") {
    //             this.askManagerQuestions();
    //         } else if (response.type === "Engineer") {
    //             this.askEngineerQuestions();
    //         } else if (response.type === "Intern") {
    //             this.askInternQuestions();
    //         } 
    //     });
    // }
    
    
// };

// const questions = new Questions();

// questions.start();

