import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import * as XLSX from 'ts-xlsx';

@Component({
  selector: 'app-ports-new',
  templateUrl: './ports-new.page.html',
  styleUrls: ['./ports-new.page.scss'],
})
export class PortsNewPage implements OnInit {
  userForm: FormGroup;
  todo = {};
  arrayBuffer: any;
  file: File;

  incomingfile(event) {
    this.file = event.target.files[0];
  }

  Upload() {
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
          fileReader.readAsArrayBuffer(this.file);
  }


  constructor() { }

  ngOnInit() {
  }

  logForm() {
    console.log(this.todo);
  }

}
