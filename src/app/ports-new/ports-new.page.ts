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
  diccToDefineHeaders = {};
  packingQuantity: number;

  differentsModelsCount = {};
  differentsModelsSizes = {};

  constructor(private fileChooser: FileChooser,
              private filePath: FilePath,
              private fileOpener: FileOpener,
              private fileee: File) { }

  incomingfile(event) {
    this.file = event.target.files[0];
  }

// To upload XLXS from browser on desktop
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

  // To read XLXS from browser on desktop
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
              this.packingQuantity = this.packingDicc.length;
              this.previewObjects = this.packingDicc.slice(0, 3); // Get First three elements
              console.log(this.packingDicc);

              this.displayPreviewPacking();

            };
          fileReader.readAsArrayBuffer(this.file);
  }

  // To upload XLXS from device
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
              this.packingDicc = XLSX.utils.sheet_to_json(worksheet, {raw: true});
              this.packingQuantity = this.packingDicc.length;
              this.previewObjects = this.packingDicc.slice(0, 3); // Get First three elements
              console.log(this.packingDicc);

              this.displayPreviewPacking();
            };
          fileReader.readAsArrayBuffer(fileXLSX);
  }

  // To read XLXS from device
  toOpen2() {
      this.fileChooser.open().then(file => {
        this.filePath.resolveNativePath(file).then(resolvedFilePath => {
          (<any>window).resolveLocalFileSystemURL(resolvedFilePath, (res) => {
            console.log(res.name);
            this.stringFile = res.name;
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
      this.autoDetectHeader(key);
      // AutoDetectSize then
    }
    this.displayPreviewTable = true;
    this.detectDifferentsModels();
  }

  ngOnInit() {
    this.packingToggle = true;
    this.displayPreviewTable = false;
    this.stringFile = 'No hay archivo seleccionado';
  }

  onChangeSelect(selectedValue: any, header: string) {
    this.detectRepeat(selectedValue, header);
    console.log(this.diccToDefineHeaders);
  }

  // Detect if selected header can be repeated. Autocorrect
  detectRepeat(selectedValue: string, header: string) {
    for (const key of Object.keys(this.diccToDefineHeaders)) {
      if (this.diccToDefineHeaders[key] === selectedValue &&
      key !== header) {
        this.diccToDefineHeaders[key] = '';
      }
    }
  }

  // Suggest header from packing-headers name
  autoDetectHeader(header: string) {
    const lowHeader = header.toLowerCase();
    if (lowHeader.includes('vin') || lowHeader.includes('identificación')
        || lowHeader.includes('identificacion') || lowHeader.includes('chasis')
        || lowHeader.includes('chasís')) {
      this.diccToDefineHeaders[header] = 'vin';
      this.detectRepeat('vin', header); // 'vin' is a value on select on each column form the preview table
    } else if (lowHeader.includes('modelo')) {
      this.diccToDefineHeaders[header] = 'modelo';
      this.detectRepeat('modelo', header); // 'modelo' is a value on select on each column form the preview table
    } else if (lowHeader.includes('color')) {
      this.diccToDefineHeaders[header] = 'color';
      this.detectRepeat('color', header); // 'color' is a value on select on each column form the preview table
    } else if (lowHeader.includes('nave') || lowHeader.includes('barco')) {
      this.diccToDefineHeaders[header] = 'nave';
      this.detectRepeat('nave', header); // 'color' is a value on select on each column form the preview table
    } else {
      this.diccToDefineHeaders[header] = '';
    }
  }

  // Count how many differents models there are and how many of each
  detectDifferentsModels() {
    const modelKey: string;
    // Check if column has a model value
    if (Object.values(this.diccToDefineHeaders).includes('modelo')) {
      for (const key of Object.keys(this.diccToDefineHeaders)) {
        if (this.diccToDefineHeaders[key] === 'modelo') {
          modelKey = key;
        }
      }

      // Iterate above the packing
      for (const element of this.packingDicc) {
        if (Object.keys(this.differentsModelsCount).includes(element[modelKey])) {
          this.differentsModelsCount[element[modelKey]] += 1;
        } else {
          this.differentsModelsCount[element[modelKey]] = 1;
          this.differentsModelsSizes[element[modelKey]] = '';
        }
      }
      console.log(this.differentsModelsCount);
    }
  }

  onChangeSize(selectedValue: any, model: string) {
    this.differentsModelsSizes[model] = selectedValue;
    console.log(this.differentsModelsSizes);
  }

  logForm() {
    console.log(this.todo);
  }

}
