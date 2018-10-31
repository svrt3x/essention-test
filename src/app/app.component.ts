import { Component } from '@angular/core';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import * as xmlbuilder from 'xmlbuilder';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  inputData = 'Mary had a little lamb. Peter called for the wolf, and Aesop came. Cinderella likes shoes.';
  resultXML = '';
  resultCSV = '';
  buildCSV(inputStr) {
    const dataCSV = [];
    const sentences = inputStr.split(/\.\s/);				// split string for sentences
    sentences.forEach(function(sentence, i) {
      const words = sentence.match(/\w+/g);
      words.sort(AppComponent.prototype.custCompare);
      const outputObj = {'': 'Sentence ' + (i + 1)};
      words.forEach(function(word, j) {
        const key = 'Word ' + (j + 1);
        outputObj[key] = word;
      });
      dataCSV[i] = outputObj;
    });
    let headers = [];
    let maxKeys = 0;
    dataCSV.forEach(function(obj, j) {
      const keysCount = Object.keys(obj).length;
      if (keysCount > maxKeys) {
        maxKeys = keysCount;
        headers = [];
        const keys = Object.keys(obj);
        keys.forEach(function(key, k) {
          headers[k] = key;
        });
      }
    });
    console.log(dataCSV);
    const csv = new Angular5Csv(dataCSV, 'result', {headers: headers, quoteStrings: ''});
    return 'CSV result was downloaded as file';
  }

  buildXML(inputStr) {
    const dataXML = {'text': {'sentence': []}};
    const sentences = inputStr.split(/\.\s/);					// split string for sentences
    sentences.forEach(function(sentence, i) {			// make array of words for each sentence
      const sObj = {'word': []};
      const words = sentence.match(/\w+/g);
      words.sort(AppComponent.prototype.custCompare);
      sObj.word = words;
      dataXML.text.sentence[i] = sObj;
    });
    const xml = xmlbuilder.create(dataXML, {encoding: 'utf-8', standalone: 'yes'} as xmlbuilder.XMLCreateOptions).end({ pretty: true });
    return xml;
  }

  custCompare(a, b) {
    if (a.toLowerCase() < b.toLowerCase()) { return -1; }
    if (a.toLowerCase() > b.toLowerCase()) { return 1; }
    return 0;
  }

  onSubmit() {
    this.resultXML = this.buildXML(this.inputData);
    this.resultCSV = this.buildCSV(this.inputData);
  }
}
