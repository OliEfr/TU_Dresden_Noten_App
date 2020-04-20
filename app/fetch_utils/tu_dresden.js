/* eslint-disable dot-notation */
/* eslint-disable prettier/prettier */
const cheerio = require('cheerio-without-node-native');
global.Buffer = require('buffer').Buffer;
import University from './university';

//This claas directly handles http-traffic with hisqis

/* TODO
    Für mehrere Studiengänge (TODO)
     - For each list item --> Goto --> Link --> perform json crawl.
    
    Nicht bestandene Prüfungen berücksichtigen
    
    
    Wie siehts es bei Bachelor-Master aus?
    
     ERROR-catching:
      - wenn vor dem ersten Modul schon Noten stehen (zB Zwischenprüfung)
    
*/

export default class tud_fetch extends University {

    getName(){
        return new Promise((resolve, reject) => {
            this.fetch().then(()=> {
                this.parseUserInfo();
            }).then(()=>{
                resolve(this.name);
            }).catch(e => {
                console.log('Error in fetch name: ' + e)
                reject();
            });
        });
    }

    getStudiengang(){
        return new Promise((resolve, reject) => {
            //this.fetch().then(()=> {
            //    this.parseUserInfo();
            //}).then(()=>{
                resolve(this.studiengang);
            //}).catch(e => {
            //    console.log('Error in fetch name: ' + e)
            //    reject();
            //});
        });
    }

    getGrades(){
        return new Promise((resolve, reject) => {
            this.fetch().then(() => this.parseGrades()).then(()=>{
                resolve(this.grades);
            })
            .catch(e=> {
                reject(e)
            });
        });
    }

    //read grades
    parseGrades(){
        return new Promise(async(resolve,reject) => {
            //this must be assigned to that, because jQuery (and cheerio) .each() function has its own scope
                //didnt get it to work with .bind()
            var that = this;
            var $ = this.$;

            //Extract Klausur-Name, Note, CP
            $("table[summary!='Liste der Stammdaten des Studierenden'] > tbody").children().each(function() {
                //Skip stuff
                if ($(this).children().attr('class') === 'Konto' ||
                    $(this).children().attr('class') === 'tabelleheader' ||
                    $(this).children().eq(1).text().trim() === 'Zurück'
                    )  {return true;}

                let grade = $(this).children().eq(3).text().trim();
                let exam = $(this).children().eq(1).text().trim();
                let year = $(this).children().eq(2).text().trim();
                let status = $(this).children().eq(5).text().trim();
                let cp = $(this).children().eq(7).text().trim()
                let isModule = false;

                //reaons to skip
                if (exam === '') {return true;}
                if ($(this).children().eq(1).attr('bgcolor') === '#ADADAD') {return true}

                //Extract information and store in this.grades
                if ($(this).children().eq(1).attr('class') === 'normalFett') {
                    //Modul
                    isModule = true;
                    that.grades.modules.push({
                                        'module_name': exam,
                                        'module_mark': grade,
                                        'status': status,
                                        'cp': cp,
                                        'subjects':[],
                                        'year': year,
                                        });
                } else {
                    //Fach
                    if (exam === 'Gesamtnote Zwischenprüfung') {
                        return true;
                    }
                    that.grades.modules[that.grades.modules.length - 1].subjects.push({
                                                                        'name': exam,
                                                                        'mark': grade,
                                                                        'year': year,
                                                                        'status': status
                                                                         });
                }
                //check for change and store in newGradesList.
                //exam+year is done to create a unique identifier
                    //PROBLEM: Removed Grade not detected
                if (that.gradesList[exam + year] === undefined ||
                    that.gradesList[exam + year]['year'] === undefined ||
                    that.gradesList[exam + year]['grade'] !== grade) {
                        that.gradesList[exam + year] = {name: exam, year: year, grade: grade, isModule: isModule};
                        that.newGradesList[exam + year] = {name: exam, year: year, grade: grade, isModule: isModule};
                }
            });
            resolve(true);
        });
    }

    //read e.g. username
    parseUserInfo(){
        return new Promise(async(resolve, reject) => {
            //this must be assigned to that, because jQuery (and cheerio) .each() function has its own scope
                //didnt get it to work with .bind()
            var that = this;
            this.$("table[summary='Liste der Stammdaten des Studierenden'] > tbody").children().each(function() {
                if (that.$(this).children().first().text() === 'Name des Studierenden:') {that.name = that.$(this).children().next().text();}
                //for some reason Studiengang is not available here
                //if (that.$(this).children().first().text().includes("Studiengang")) {that.studiengang = that.$(this).children().next().text();}
            });
            //studiengang is contained in $treeViewView
            this.studiengang = this.$treeView('#visual-portal-wrapper').children('form').children('ul').children().first().children('ul').text().trim().split(" ")[0]
            //Backup solution:
            //this.studiengang = this.$("table[summary!='Liste der Stammdaten des Studierenden'] > tbody").children().eq(1).children().text().split(" ").pop().trim();
            resolve(true);
        });
    }

    //fetch html from local server --> Use for testing purposes.
    fetch(){
        return new Promise((resolve, reject) => {
            fetch('http://192.168.178.39:8887/', {'credentials':'omit','headers':{'accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3','accept-language':'de-DE,de;q=0.9,en-DE;q=0.8,en-GB;q=0.7,en-US;q=0.6,en;q=0.5','cache-control':'max-age=0','upgrade-insecure-requests':'1'},'referrerPolicy':'no-referrer-when-downgrade','body':null,'method':'GET','mode':'cors'})
                .then((re)=> {return re.text();})
                .then((text) => {
                    this.$ = cheerio.load(text);
                    return;
                })
                .then(()=>resolve());        })
                .catch((e) => {
                    reject(e)
                });
    }

    logout(asi){
        fetch("https://qis.dez.tu-dresden.de/qisserver/servlet/de.his.servlet.RequestDispatcherServlet?state=user&type=4", 
        {"credentials":"include",
        "headers":{},
        "referrer":"https://qis.dez.tu-dresden.de/qisserver/servlet/de.his.servlet.RequestDispatcherServlet?state=notenspiegelStudent&next=list.vm&nextdir=qispos/notenspiegel/student&createInfos=Y&struct=auswahlBaum&nodeID=auswahlBaum%7Cabschluss%3Aabschl%3D%2Cstgnr%3D1%7Cstudiengang%3Astg%3D104&expand=0&asi=" + asi,
        "referrerPolicy":"no-referrer-when-downgrade",
        "body":null,
        "method":"GET",
        "mode":"cors"})
    }
    
    //fetch html
    //set credentials=same-origin required for automatic cookie-handlin
    fetch_(){
        return new Promise((resolve, reject) => {
            let asi = '';
            fetch('https://qis.dez.tu-dresden.de/qisserver/rds?state=user&type=1&category=auth.login&startpage=portal.vm',
             {'credentials':'same-origin',
             'headers':{
                'accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                'accept-language':'de-DE,de;q=0.9,en-DE;q=0.8,en-GB;q=0.7,en-US;q=0.6,en;q=0.5',
                'cache-control':'max-age=0',
                'content-type':'application/x-www-form-urlencoded',
                'sec-fetch-mode':'navigate',
                'sec-fetch-site':'same-origin',
                'sec-fetch-user':'?1',
                'upgrade-insecure-requests':'1'},
                'referrer':'https://qis.dez.tu-dresden.de/qisserver/rds?state=user&type=4',
                'referrerPolicy':'no-referrer-when-downgrade',
                'body':'asdf=+' + this.username + '&fdsa=' + this.password + '&submit=%C2%A0Anmelden%C2%A0',
                'method':'POST',
                'mode':'cors',
            })
            .then(resp => {
                //get html content
                return resp.text();
            })
            .then(text => {
                //load into cheerio
                return cheerio.load(text);
            })
            .then($ => {
                //extracting link, asi and jsessionid
                    //no idea what asi is
                    //jsessionid seems to be for some kind of cookie management
                var link = $('.liste li:nth-child(3)').children().attr('href');
                asi = link.split('asi=').pop();
                return asi;
            })
            .then(asi => {
                fetch("https://qis.dez.tu-dresden.de/qisserver/servlet/de.his.servlet.RequestDispatcherServlet?state=notenspiegelStudent&next=tree.vm&nextdir=qispos/notenspiegel/student&menuid=notenspiegelStudent&breadcrumb=notenKlassenSpiegel&breadCrumbSource=loggedin&asi=" + asi, {
                    "credentials":"include",
                    "headers":{
                        "accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3",
                        "accept-language":"de-DE,de;q=0.9,en-DE;q=0.8,en-GB;q=0.7,en-US;q=0.6,en;q=0.5",
                        "upgrade-insecure-requests":"1"
                    },
                    "referrer":"https://qis.dez.tu-dresden.de/qisserver/servlet/de.his.servlet.RequestDispatcherServlet?state=user&type=0&category=menu.browse&startpage=portal.vm",
                    "referrerPolicy":"no-referrer-when-downgrade",
                    "body":null,
                    "method":"GET",
                    "mode":"cors"
            }) 
            .then(resp =>{
                return resp.text();
            })
            .then(text => {
                return cheerio.load(text)
            })
            .then($ => {
                //Extract number for Type of Graduation
                let link = $('.regular').attr('href')
                let graduation_id = link.slice(link.indexOf('Aabschl%') + 8, link.indexOf('Aabschl%') + 12)
                //graduation_id examples: "3D11" (Diplom) or "3D28" (Bachelor)
                return graduation_id
            })
            .then(graduation_id => {
                //get link via scraping
               fetch('https://qis.dez.tu-dresden.de/qisserver/rds?state=notenspiegelStudent&next=list.vm&nextdir=qispos/notenspiegel/student&createInfos=Y&struct=auswahlBaum&nodeID=auswahlBaum%7Cabschluss%3Aabschl%' + graduation_id + '%2Cstgnr%3D1&expand=1&asi=' + asi,
                {
                    'credentials':'same-origin',
                    'headers':
                    {
                        'accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                        'accept-language':'de-DE,de;q=0.9,en-DE;q=0.8,en-GB;q=0.7,en-US;q=0.6,en;q=0.5',
                        'save-data':'on',
                        'sec-fetch-mode':'navigate',
                        'sec-fetch-site':'same-origin',
                        'sec-fetch-user':'?1',
                        'upgrade-insecure-requests':'1'
                    },
                    'referrer':'https://qis.dez.tu-dresden.de/qisserver/rds?state=notenspiegelStudent&next=tree.vm&nextdir=qispos/notenspiegel/student&menuid=notenspiegelStudent&breadcrumb=notenKlassenSpiegel&breadCrumbSource=loggedin&asi=' + asi,
                    'referrerPolicy':'no-referrer-when-downgrade',
                    'body':null,
                    'method':'GET',
                    'mode':'cors'})
                .then(resp => {
                    //this contains the webpage with the grade-overview
                    return resp.text();
                })
                .then(text => {
                    //load into cheerio
                    this.$ = cheerio.load(text);
                    return;
                })
                .then(() => {
                    //get tree view - this is required to get the studiengang
                    fetch('https://qis.dez.tu-dresden.de/qisserver/servlet/de.his.servlet.RequestDispatcherServlet;jsessionid=F8BDF489296C45F3A2E934DB2A1DA7EF?state=notenspiegelStudent&struct=auswahlBaum&navigation=Y&next=tree.vm&nextdir=qispos/notenspiegel/student&nodeID=auswahlBaum%7Cabschluss%3Aabschl%' + graduation_id + '%2Cstgnr%3D1&expand=0&lastState=notenspiegelStudent&asi=' + asi,
                    {
                        'credentials':'same-origin',
                        'headers':
                        {
                            'accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                            'accept-language':'de-DE,de;q=0.9,en-DE;q=0.8,en-GB;q=0.7,en-US;q=0.6,en;q=0.5',
                            'save-data':'on',
                            'sec-fetch-mode':'navigate',
                            'sec-fetch-site':'same-origin',
                            'sec-fetch-user':'?1',
                            'upgrade-insecure-requests':'1'
                        },
                        'referrer':'https://qis.dez.tu-dresden.de/qisserver/rds?state=notenspiegelStudent&next=tree.vm&nextdir=qispos/notenspiegel/student&menuid=notenspiegelStudent&breadcrumb=notenKlassenSpiegel&breadCrumbSource=loggedin&asi=' + asi,
                        'referrerPolicy':'no-referrer-when-downgrade',
                        'body':null,
                        'method':'GET',
                        'mode':'cors'})
                    .then(resp => {
                        return resp.text()
                    })
                    .then(text => {
                        //this contains the tree view
                        this.$treeView = cheerio.load(text)
                        return
                    }).then(() => {
                        resolve();
                    }).catch(e => reject('Error0 in Fetch in tu_dresden: ' + e))
                }).then(() => {
                    this.logout(asi)
                }).catch(e => reject('Error1 in Fetch in tu_dresden: ' + e))
            }).catch(e => reject('Error2 in Fetch in tu_dresden: ' + e));
            }).catch(e => reject('Error3 in Fetch in tu_dresden: ' + e));
        })
    }
}
