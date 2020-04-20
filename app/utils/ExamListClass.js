export default class ExamDetails {
    constructor(gradesList) {
      this.gradesList = gradesList; //{e1: { grade: 1,0, isModule: true}, e2: {grade: 1.3, isModule: false}, ...}
      this.gradesCountConverted = [0, 0, 0, 0, 0];
      this.examsCount = 0;
      this.gradeAvarage = 0;
      this.countGradesConverted();
    }
  
    countGradesConverted() {
      let dataList = [0, 0, 0, 0, 0];
      let count = 0;
      let sum = 0;
      Object.keys(this.gradesList).forEach(key => {
        if(this.gradesList[key].isModule === false) {
          let grade = Math.round(parseFloat(this.gradesList[key].grade.replace(',', '.')));
          if(grade) {
            count = count + 1;
            sum = sum + parseFloat(this.gradesList[key].grade.replace(',', '.'));
            switch (grade) {
                case 1:
                dataList[0] = dataList[0] + 1;
                break;
              case 2:
                dataList[1] = dataList[1] + 1;
                break;
              case 3:
                dataList[2] = dataList[2] + 1;
                break;
              case 4:
                dataList[3] = dataList[3] + 1;
                break;
              case 5:
                dataList[4] = dataList[4] + 1;
                break;
            }
          }
        }
      });
      this.gradesCountConverted = dataList;
      this.examsCount = count;
      this.gradeAvarage = isNaN((Math.round(sum * 10 / count) / 10).toFixed(1)) ? (0.0).toFixed(1) : (Math.round(sum * 10 / count) / 10).toFixed(1);

    }
  }
  