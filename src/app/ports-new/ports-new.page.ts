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

  constructor(private fileChooser: FileChooser,
              private filePath: FilePath,
              private fileOpener: FileOpener,
              private fileee: File) { }

  Upload2(fileXLSX: any) {
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
              console.log(XLSX.utils.sheet_to_json(worksheet, {raw: true}));
            };
          fileReader.readAsArrayBuffer(fileXLSX);
  }

  toOpen2() {
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

  ngOnInit() {
  }

  logForm() {
    console.log(this.todo);
  }

}
