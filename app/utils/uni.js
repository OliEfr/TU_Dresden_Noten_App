/* eslint-disable prettier/prettier */
import tud_fetch from '../fetch_utils/tu_dresden';
import * as storage from './storage';

//this class stores information about a users university account
//this class performs logic ontop of this information
//this class puts a level of abstraction on tud_fetch, which directly handels http-traffic with hisqis

export default class Uni {
    constructor(username, password, gradesList, university){
        if (university === 'TU Dresden'){
            this.uni = new tud_fetch(username, password, gradesList);
        } else if (university === 'TU Darmstadt') {
            //Change to tudarm_fetch as soon as implemented!
            this.uni = new tud_fetch(username, password, gradesList);
        }
    }

    save() {
        storage._storeData('grades_json', JSON.stringify(this.uni.grades));
        storage._storeData('grades_list', JSON.stringify(this.uni.gradesList));
    }

    hasChanged() {
        return (Object.keys(this.uni.newGradesList).length > 0 ) ? true : false;
    }

    getName(){
        return new Promise(async(resolve,reject) => {
           this.uni.getName().then((name) => {
                resolve(name);
           }).catch((e) => {reject(false)});
        });
    }

    getStudiengang(){
        return new Promise(async(resolve,reject) => {
            this.uni.getStudiengang().then((studiengang) => {
                 resolve(studiengang);
            }).catch((e) => {reject(false)});
         });
    }

    getGrades(){
        return new Promise(async(resolve, reject) => {
            this.uni.getGrades().then((grades) => {
                resolve(grades);
            }).catch(e => reject(e));
        });
    }

    getGradesList(){
        return this.uni.gradesList;
    }

    getNewGradesList() {
        return this.uni.newGradesList;
    }

    getFirstNewSubjectName(){
        return this.uni.newGradesList[Object.keys(this.uni.newGradesList)[0]]['name'];
    }

    getFirstNewSubjectYear(){
        return this.uni.newGradesList[Object.keys(this.uni.newGradesList)[0]]['year'];
    }

    getFirstNewSubjectGrade(){
        return this.uni.newGradesList[Object.keys(this.uni.newGradesList)[0]]['grade'];
    }

    enrolledNewExam(){
        /* 
            return type:
                [Exam1, Exam2, Exam3 ...]
        */
       let examList = [];
        return new Promise((resolve,reject) => {
            if (Object.keys(this.uni.newGradesList).length > 0 ) {
                for (var key in this.uni.newGradesList) {
                    if (this.uni.newGradesList[key]['grade'] === '') {
                        //console.log('FOUND NEW: ' + this.uni.newGradesList[key]['name'])
                        examList.push(this.uni.newGradesList[key]['name'])
                    }
                }
                if(examList.length > 0 ) resolve(examList)
            }
            resolve(false);
        });
    }

    hasNewGrade() {
        //return number of new grades or false
        return new Promise((resolve,reject) => {
            let newGradeCount = 0;
            if (Object.keys(this.uni.newGradesList).length > 0 ) {
                for (var key in this.uni.newGradesList) {
                    if (this.uni.newGradesList[key]['grade'] !== '') {
                        newGradeCount++;
                    }
                }
                resolve(newGradeCount);
            }
            resolve(false);
        });
    }
}

