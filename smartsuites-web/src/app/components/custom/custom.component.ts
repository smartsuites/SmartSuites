import {Component, OnInit} from '@angular/core';
import {Message} from "primeng/primeng";

@Component({
  selector: 'app-custom',
  templateUrl: './custom.component.html',
  styleUrls: ['./custom.component.css']
})
export class CustomComponent implements OnInit {
  ngOnInit(): void {
  }

  min_height = window.innerHeight - 183 + 'px'

  msgs: Message[];

  uploadedFiles: any[] = [];

  onUpload(event) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.msgs = [];
    this.msgs.push({severity: 'info', summary: 'File Uploaded', detail: ''});
  }

}
