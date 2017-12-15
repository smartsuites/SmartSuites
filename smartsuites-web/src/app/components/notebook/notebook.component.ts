import { Component, OnInit } from '@angular/core';
import {NoteListService} from "../../service/note-list/note-list.service";

@Component({
  selector: 'app-notebook',
  templateUrl: './notebook.component.html',
  styleUrls: ['./notebook.component.css']
})
export class NotebookComponent implements OnInit {

  notes

  constructor(private noteListFactory:NoteListService) {
    this.notes = this.noteListFactory.notes
  }

  ngOnInit() {
  }

}
