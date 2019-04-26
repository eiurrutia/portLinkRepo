import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import * as XLSX from 'ts-xlsx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';


@Component({
  selector: 'app-ports-new',
  templateUrl: './ports-new.page.html',
  styleUrls: ['./ports-new.page.scss'],
})
export class PortsNewPage implements OnInit {
  userForm: FormGroup;
  todo = {};
  arrayBuffer: any;
  file: any;

  packingToggle: boolean;
  stringFile: string;
  packingDicc: any;
  displayPreviewTable: boolean;
  headers: string[];
  previewObjects: any; // The first 3 elements to see the format.

  constructor(private fileChooser: FileChooser,
              private filePath: FilePath,
              private fileOpener: FileOpener,
              private fileee: File) { }

  incomingfile(event) {
    this.file = event.target.files[0];
  }

toOpen() {
    this.fileChooser.open().then(file => {
      this.filePath.resolveNativePath(file).then(resolvedFilePath => {
        this.stringFile = file;
        this.fileOpener.open(resolvedFilePath, 'application/xlsx').then(value => {
          alert('It worked');
        }).catch(err => {
          alert(JSON.stringify(err));
        });
      }).catch(err => {
        alert(JSON.stringify(err));
      });
    }).catch(err => {
      alert(JSON.stringify(err));
    });
  }

  Upload()  { // To desktop version
        const fileReader = new FileReader();
          fileReader.onload = (e) => {
              this.arrayBuffer = fileReader.result;
              const data = new Uint8Array(this.arrayBuffer);
              const arr = new Array();
              for ( let i = 0; i !== data.length; ++i) {
                arr[i] = String.fromCharCode(data[i]);
              }
              const bstr = arr.join('');
              const workbook = XLSX.read(bstr, {type: 'binary'});
              const first_sheet_name = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[first_sheet_name];
              this.packingDicc = XLSX.utils.sheet_to_json(worksheet, {raw: true});
              this.previewObjects = this.packingDicc.slice(0, 3); // Get First three elements
              console.log(this.packingDicc);

              this.displayPreviewPacking();

            };
          fileReader.readAsArrayBuffer(this.file);
  }

  Upload2(fileXLSX: any) { // To desktop version
        const fileReader = new FileReader();
          fileReader.onload = (e) => {
              this.arrayBuffer = fileReader.result;
              const data = new Uint8Array(this.arrayBuffer);
              const arr = new Array();
              for ( let i = 0; i !== data.length; ++i) {
                arr[i] = String.fromCharCode(data[i]);
              }
              const bstr = arr.join('');
              const workbook = XLSX.read(bstr, {type: 'binary'});
              const first_sheet_name = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[first_sheet_name];
              this.packingDicc = XLSX.utils.sheet_to_json(worksheet, {raw: true});
              this.previewObjects = this.packingDicc.slice(0, 3); // Get First three elements
              console.log(this.packingDicc);

              this.displayPreviewPacking();
            };
          fileReader.readAsArrayBuffer(fileXLSX);
  }

  toOpen2() {
      this.stringFile = '07 Pleaides Leader';
      this.fileChooser.open().then(file => {
        this.filePath.resolveNativePath(file).then(resolvedFilePath => {
          (<any>window).resolveLocalFileSystemURL(resolvedFilePath, (res) => {
            res.file((resFile) => {
              this.Upload2(resFile);
            });
          });
        }).catch(err => {
          alert(JSON.stringify(err));
        });
      }).catch(err => {
        alert(JSON.stringify(err));
      });
  }

  displayPreviewPacking() {
    this.headers = Object.keys(this.packingDicc[0]);
    for (const key of Object.keys(this.packingDicc[0])) {
      console.log(key);
    }

    console.log(this.previewObjects);
    this.displayPreviewTable = true;
  }

  ngOnInit() {
    this.packingToggle = true;
    this.displayPreviewTable = false;
    this.stringFile = 'No hay archivo seleccionado';
  }

  logForm() {
    console.log(this.todo);
  }

}
