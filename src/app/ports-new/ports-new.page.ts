import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular';
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
  packingDiccId = {};
  displayPreviewTable: boolean;
  headers: string[];
  previewObjects: any; // The first 3 elements to see the format.
  diccToDefineHeaders = {};
  diccToDefineHeadersInverse = {};
  packingQuantity: number;
  shipName: string;
  vinExample: string;
  editDigitsMode = false;
  digitsToConsider = 0; // When is zero, all digits are considered.
  repeatedElement = false; // If exist repeated elements.

  differentsModelsCount = {};
  differentsModelsSizes = {};

  constructor(private fileChooser: FileChooser,
              private filePath: FilePath,
              private fileOpener: FileOpener,
              private fileee: File,
              private toastController: ToastController) { }

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

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Se ha cargado correctamente el packing.',
      duration: 2000
    });
    toast.present();
  }

  displayPreviewPacking() {
    this.headers = Object.keys(this.packingDicc[0]);
    for (const key of Object.keys(this.packingDicc[0])) {
      this.autoDetectHeader(key);
    }
    console.log(this.diccToDefineHeaders);
    console.log(this.diccToDefineHeadersInverse);
    this.shipName = this.packingDicc[0][this.diccToDefineHeadersInverse['nave']];
    this.vinExample = this.packingDicc[0][this.diccToDefineHeadersInverse['vin']];
    this.detectDifferentsModels();
    this.displayPreviewTable = true;
    this.presentToast();
    this.convertPackingListToPackingDiccId();

  }

  ngOnInit() {
    this.packingToggle = true;
    this.displayPreviewTable = false;
    this.stringFile = 'No hay archivo seleccionado';
  }

  onChangeSelect(selectedValue: any, header: string) {
    this.detectRepeat(selectedValue, header);
    this.diccToDefineHeadersInverse[selectedValue] = header;
    if (selectedValue === 'nave') {this.shipName = this.packingDicc[0][header];
    } else if (selectedValue === 'vin') {this.vinExample = this.packingDicc[0][header]; }
    console.log(this.diccToDefineHeaders);
    console.log(this.diccToDefineHeadersInverse);
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
      this.diccToDefineHeadersInverse['vin'] = header;
      this.detectRepeat('vin', header); // 'vin' is a value on select on each column form the preview table
    } else if (lowHeader.includes('modelo')) {
      this.diccToDefineHeaders[header] = 'modelo';
      this.diccToDefineHeadersInverse['modelo'] = header;
      this.detectRepeat('modelo', header); // 'modelo' is a value on select on each column form the preview table
    } else if (lowHeader.includes('color')) {
      this.diccToDefineHeaders[header] = 'color';
      this.diccToDefineHeadersInverse['color'] = header;
      this.detectRepeat('color', header); // 'color' is a value on select on each column form the preview table
    } else if (lowHeader.includes('nave') || lowHeader.includes('barco')) {
      this.diccToDefineHeaders[header] = 'nave';
      this.diccToDefineHeadersInverse['nave'] = header;
      this.detectRepeat('nave', header); // 'color' is a value on select on each column form the preview table
    } else {
      this.diccToDefineHeaders[header] = '';
    }
  }

  // Count how many differents models there are and how many of each
  detectDifferentsModels() {
    let modelKey = '';
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
          // AutoDetectSize then
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

  numberDigitsChange(selectedValue: any) {
    if (this.digitsToConsider === 0) {this.vinExample = this.packingDicc[0][this.diccToDefineHeadersInverse['vin']];
    } else {this.vinExample =
      this.packingDicc[0][this.diccToDefineHeadersInverse['vin']].substring(
        this.packingDicc[0][this.diccToDefineHeadersInverse['vin']].length - this.digitsToConsider); }
    this.convertPackingListToPackingDiccId();
  }

  logForm() {
    console.log(this.todo);
  }

  // Dict where key is the Vin and Value is the object
  convertPackingListToPackingDiccId() {
    this.packingDiccId = {};
    this.repeatedElement = false;
    if (this.digitsToConsider === 0) {
      for (const element of this.packingDicc) {
        if (!Object.keys(this.packingDiccId).includes(element[this.diccToDefineHeadersInverse['vin']])) {
            this.packingDiccId[element[this.diccToDefineHeadersInverse['vin']]] = element;
        } else {
          this.repeatedElement = true;
          break;
        }

      }

    } else {
      for (const element of this.packingDicc) {
        const newVin =
          element[this.diccToDefineHeadersInverse['vin']].substring(
            element[this.diccToDefineHeadersInverse['vin']].length - this.digitsToConsider);
        if (!Object.keys(this.packingDiccId).includes(newVin)) {
            this.packingDiccId[newVin] = element;
        } else {
          this.repeatedElement = true;
          break;
        }

      }
    }
    console.log(this.packingDiccId);
    console.log(Object.keys(this.packingDiccId).length);
  }

}
