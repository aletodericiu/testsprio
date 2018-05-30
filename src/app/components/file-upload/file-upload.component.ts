import { Component, OnInit } from '@angular/core';
import { FileUploadService } from './file-upload.service';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss']
})

export class FileUploadComponent implements OnInit {

    fileToUpload: File = null;
    spin: boolean;

    constructor(private fileUploadService: FileUploadService) { }

    ngOnInit() {
    }

    handleFileInput(files: FileList) {
        console.log('files.item(0)', files.item(0));
        this.fileToUpload = files.item(0);
    }

    uploadFile() {
        this.spin = true;

        if (this.fileToUpload.type === 'application/pdf') {
            console.log(' not good enough for ale');
            this.fileToUpload = null;
            this.spin = false;
        } else {
            this.fileUploadService.postFile(this.fileToUpload).subscribe(
                data => {
                    console.log('upload successful', data);
                    this.fileToUpload = null;
                    this.spin = false;
                },
                error => {
                    console.log(error);
                    this.fileToUpload = null;
                    this.spin = false;
                });
        }
    }

}
