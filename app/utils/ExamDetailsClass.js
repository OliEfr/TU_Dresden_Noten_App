export default class ExamDetails {
  constructor(gradesList, grade) {
    this.myGrade = parseFloat(grade.replace(',', '.'));
    this.gradesList = gradesList;
    this.gradesCountConverted = 0;
    this.examAvarage = 0;
    this.percantageUpper = 0;
    this.calculateAvarage();
    this.calculatePercentageUpper();
    this.countGradesConverted();
  }

  calculateAvarage() {
    let sum = 0;
    let count = 0;

    Object.keys(this.gradesList).forEach(key => {
      sum = sum + parseFloat(key.replace(',', '.')) * this.gradesList[key];
      count = count + this.gradesList[key];
    });
    //round to one floating point
    this.examAvarage = Math.round((sum / count) * 10) / 10;
  }

  calculatePercentageUpper() {
    let count_better = 0;
    let count_all = 0;
    let count_worse = 0;

    Object.keys(this.gradesList).forEach(key => {
      count_all = count_all + this.gradesList[key];
      if (parseFloat(key.replace(',', '.')) < this.myGrade) {
        count_better = count_better + this.gradesList[key];
      } else if (parseFloat(key.replace(',', '.')) > this.myGrade) {
        count_worse = count_worse + this.gradesList[key];
      }
    });
    this.percantageUpper = Math.round((count_worse / count_all) * 100);
  }

  countGradesConverted() {
    let dataList = [0, 0, 0, 0, 0];
    Object.keys(this.gradesList).forEach(key => {
      let grade = Math.round(parseFloat(key.replace(',', '.')));
      switch (grade) {
        case 1:
          dataList[0] = dataList[0] + this.gradesList[key];
          break;
        case 2:
          dataList[1] = dataList[1] + this.gradesList[key];
          break;
        case 3:
          dataList[2] = dataList[2] + this.gradesList[key];
          break;
        case 4:
          dataList[3] = dataList[3] + this.gradesList[key];
          break;
        case 5:
          dataList[4] = dataList[4] + this.gradesList[key];
          break;
      }
    });
    this.gradesCountConverted = dataList;
  }
}
