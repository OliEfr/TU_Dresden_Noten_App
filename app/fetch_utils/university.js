/* eslint-disable dot-notation */
/* eslint-disable prettier/prettier */


/* 
  Base-Class for all university fetch classes
*/

/*
  that is, what gradesList and newGradesList looks like.
  it contains all modules and subjects (=exams)
  key = name+year --> required to create unique identifiers!
  this datatype is used to perform logic operations, e.g. check whether there is a new grade.
    
    const dataList = {
      exam1SoSe 19 : {name: exam1, year: SoSe 19, grade: 1.0};
      exam2SoSe 19 : {name: exam2, year: SoSe 19, grade: 1.0};
    }
*/


/*
  that is, what grades_json looks like.
  this list contains all modules and subjects
  this datatype is used only to display the grade overview on the users home screen.

    const grades_json = {
      modules: [
        {
          module_name: 'Module2',
          module_mark: 2.3,
          bestanden: true,
          year: 'WiSe 18/19',
          subjects: [
            {name: 'Subject4', mark: 2.3, year: 'SoSe 19', bestanden: true},
            {name: 'Subject5', mark: 4.0, year: 'SoSe 19'},
            {name: 'Subject6', mark: 4.0, year: 'SoSe 19'},
            {name: 'Subject7', mark: 2.3, year: 'SoSe 19'},
          ],
        },
      ]};
*/

export default class university {
    constructor(username, password, gradesList){
        this.username = username;
        this.password = password;
        this.$ = '';
        this.$treeView = '';
        this.grades = {};
        this.grades['modules'] = [];
        this.gradesList = (gradesList) ? gradesList : {};
        this.newGradesList = {};
        this.name = '';
        this.studiengang = '';
    }
}