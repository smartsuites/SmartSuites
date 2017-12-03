import { Injectable } from '@angular/core';

@Injectable()
export class NoteListService {

  TRASH_FOLDER_ID

  notes = {
    root: {children: []},
    flatList: [],
    flatFolderMap: {},
  }

  constructor(/*public TRASH_FOLDER_ID*/) {

  }

  setNotes(notesList) {

    let self = this;

    // a flat list to boost searching
    // TODO
    this.notes.flatList = notesList.map((note) => {
      note.isTrash = note.name ? note.name.split('/')[0] === this.TRASH_FOLDER_ID : false
      return note
    })

    // construct the folder-based tree
    this.notes.root = {children: []}
    this.notes.flatFolderMap = {}
    notesList[0].reduce((previous, note, index, array) => {
      let noteName = note.name || note.id
      // 将名字用 / 分开
      let nodes = noteName.match(/([^\/][^\/]*)/g)

      // recursively add nodes
      self.addNode(previous, nodes, note.id)

      return previous
    }, this.notes.root)
  }

  addNode(curDir, nodes, noteId) {
    if (nodes.length === 1) {  // the leaf
      curDir.children.push({
        name: nodes[0],
        id: noteId,
        path: curDir.id ? curDir.id + '/' + nodes[0] : nodes[0],
        isTrash: curDir.id ? curDir.id.split('/')[0] === this.TRASH_FOLDER_ID : false
      })
    } else {  // a folder node
      let node = nodes.shift()

      let dir = curDir.children.find((c) => { return c.name === node && c.children !== undefined })
      if (dir !== undefined) { // found an existing dir
        this.addNode(dir, nodes, noteId)
      } else {
        let newDir = {
          id: curDir.id ? curDir.id + '/' + node : node,
          name: node,
          hidden: true,
          children: [],
          isTrash: curDir.id ? curDir.id.split('/')[0] === this.TRASH_FOLDER_ID : false
        }

        // add the folder to flat folder map
        this.notes.flatFolderMap[newDir.id] = newDir

        curDir.children.push(newDir)
        this.addNode(newDir, nodes, noteId)
      }
    }
  }
}
