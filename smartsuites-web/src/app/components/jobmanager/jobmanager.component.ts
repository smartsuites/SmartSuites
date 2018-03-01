import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from "primeng/components/common/messageservice";
import {JobmanagerService} from "../../service/job/jobmanager.service";
import {EventService1} from "../../service/event/event.service";
import {Car} from "../../demo/domain/car";
import * as moment from "moment";
import {ParagraphStatus} from "../notebook/paragraph/paragraph.status";
import {ConfirmationService} from "primeng/primeng";

const JobDateSorter = {
  RECENTLY_UPDATED: 'Recently Update',
  OLDEST_UPDATED: 'Oldest Updated',
}

const JobStatus = {
  READY: 'READY',
  FINISHED: 'FINISHED',
  ABORT: 'ABORT',
  ERROR: 'ERROR',
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
}

/*export class Paragraph{
  name:string;
  id:string;
  status:string;
}

export class Job{
  interpreter:string;
  isRunningJob:boolean;
  noteId:string;
  noteName:string;
  noteType:string;
  paragraphs:Paragraph[];
  unixTimeLastRun:string;
}*/

@Component({
  selector: 'app-jobmanager',
  templateUrl: './jobmanager.component.html',
  styleUrls: ['./jobmanager.component.css']
})
export class JobmanagerComponent implements OnInit, OnDestroy {

  isFilterLoaded = false

  min_height = window.innerHeight - 183 + 'px'

  jobs = []

  sorter = {
    availableDateSorter: Object.keys(JobDateSorter).map(key => { return JobDateSorter[key] }),
    currentDateSorter: JobDateSorter.RECENTLY_UPDATED,
  }

  filteredJobs = this.jobs

  filterConfig = {
    isRunningAlwaysTop: true,
    noteNameFilterValue: '',
    interpreterFilterValue: '*',
    isSortByAsc: true,
  }

  defaultInterpreters = []

  constructor(private messageService: MessageService,
              private jobManagerService:JobmanagerService,
              private eventService:EventService1,
              public confirmationService:ConfirmationService) { }

  ngOnInit() {
    let self = this;

    // self.jobManagerService.subscribeSetJobs($scope, self.setJobsCallback)
    // 需要注册销毁
    self.eventService.subscribe('jobmanager:set-jobs',function (data) {
      //console.log(data)
      self.setJobs(data.jobs)
      self.filterJobs(self.jobs, self.filterConfig)
    })

    // self.jobManagerService.subscribeUpdateJobs($scope, self.updateJobsCallback)
    // 需要注册销毁
    self.eventService.subscribe('jobmanager:update-jobs',function (data) {
      self.updateJobsCallback
    })

    self.jobManagerService.getJobs()
  }

  ngOnDestroy(): void {
    //this.eventService.unsubscribe('jobmanager:set-jobs')
    //this.eventService.unsubscribe('jobmanager:update-jobs')
    this.jobManagerService.disconnect()
  }

  setJobDateSorter(dateSorter) {
    this.sorter.currentDateSorter = dateSorter
  }

  asyncNotebookJobFilter(jobs, filterConfig) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.filteredJobs = self.filterContext(jobs, filterConfig)
      resolve(self.filteredJobs)
    })
  }

  filterContext (jobs, filterConfig) {
    let interpreter = filterConfig.interpreterFilterValue
    let noteName = filterConfig.noteNameFilterValue
    let isSortByAsc = filterConfig.isSortByAsc
    let filteredJobs = jobs

    if (typeof interpreter === 'undefined') {
      filteredJobs = filteredJobs.filter((jobItem) => {
        return typeof jobItem.interpreter === 'undefined'
      })
    } else if (interpreter !== '*') {
      filteredJobs = filteredJobs.filter(j => j.interpreter === interpreter)
    }

    // filter by note name
    if (noteName !== '') {
      filteredJobs = filteredJobs.filter((jobItem) => {
        let lowerFilterValue = noteName.toLocaleLowerCase()
        let lowerNotebookName = jobItem.noteName.toLocaleLowerCase()
        return lowerNotebookName.match(new RegExp('.*' + lowerFilterValue + '.*'))
      })
    }

    // sort by name
    filteredJobs = filteredJobs.sort((jobItem) => {
      return jobItem.noteName.toLowerCase()
    })

    // sort by timestamp
    filteredJobs = filteredJobs.sort((x, y) => {
      if (isSortByAsc) {
        return x.unixTimeLastRun - y.unixTimeLastRun
      } else {
        return y.unixTimeLastRun - x.unixTimeLastRun
      }
    })

    return filteredJobs
  }

  getJobIconByStatus(jobStatus) {
    if (jobStatus === JobStatus.READY) {
      return 'fa fa-circle-o'
    } else if (jobStatus === JobStatus.FINISHED) {
      return 'fa fa-circle'
    } else if (jobStatus === JobStatus.ABORT) {
      return 'fa fa-circle'
    } else if (jobStatus === JobStatus.ERROR) {
      return 'fa fa-circle'
    } else if (jobStatus === JobStatus.PENDING) {
      return 'fa fa-circle'
    } else if (jobStatus === JobStatus.RUNNING) {
      return 'fa fa-spinner'
    }
  }

  getJobColorByStatus(jobStatus) {
    if (jobStatus === JobStatus.READY) {
      return 'green'
    } else if (jobStatus === JobStatus.FINISHED) {
      return 'green'
    } else if (jobStatus === JobStatus.ABORT) {
      return 'orange'
    } else if (jobStatus === JobStatus.ERROR) {
      return 'red'
    } else if (jobStatus === JobStatus.PENDING) {
      return 'gray'
    } else if (jobStatus === JobStatus.RUNNING) {
      return 'blue'
    }
  }

  filterJobs(jobs, filterConfig) {
    let self = this;
    self.asyncNotebookJobFilter(jobs, filterConfig)
      .then(() => {
        self.isFilterLoaded = true
      })
      .catch(error => {
        console.error('Failed to search jobs from server', error)
      })
  }

  filterValueToName(filterValue, maxStringLength) {
    let self = this;
    if (typeof self.defaultInterpreters === 'undefined') {
      return
    }

    let index = self.defaultInterpreters.findIndex(intp => intp.value === filterValue)
    if (typeof self.defaultInterpreters[index].name !== 'undefined') {
      if (typeof maxStringLength !== 'undefined' &&
        maxStringLength > self.defaultInterpreters[index].name) {
        return self.defaultInterpreters[index].name.substr(0, maxStringLength - 3) + '...'
      }
      return self.defaultInterpreters[index].name
    } else {
      return 'NONE'
    }
  }

  setFilterValue(filterValue) {
    this.filterConfig.interpreterFilterValue = filterValue
    this.filterJobs(this.jobs, this.filterConfig)
  }

  setJobs(jobs) {
    this.jobs = jobs
    let interpreters = this.jobs
      .filter(j => typeof j.interpreter !== 'undefined')
      .map(j => j.interpreter)
    interpreters = Array.from(new Set(interpreters)) // remove duplicated interpreters

    this.defaultInterpreters = [ { name: 'ALL', value: '*' } ]
    for (let i = 0; i < interpreters.length; i++) {
      this.defaultInterpreters.push({ name: interpreters[i], value: interpreters[i] })
    }
  }

  updateJobsCallback(event, response) {
    let jobs = this.jobs
    let jobByNoteId = jobs.reduce((acc, j) => {
      const noteId = j.noteId
      acc[noteId] = j
      return acc
    }, {})

    let updatedJobs = response.jobs
    updatedJobs.map(updatedJob => {
      if (typeof jobByNoteId[updatedJob.noteId] === 'undefined') {
        let newItem = Object.assign(updatedJob)
        jobs.push(newItem)
        jobByNoteId[updatedJob.noteId] = newItem
      } else {
        let job = jobByNoteId[updatedJob.noteId]

        if (updatedJob.isRemoved === true) {
          delete jobByNoteId[updatedJob.noteId]
          let removeIndex = jobs.findIndex(j => j.noteId === updatedJob.noteId)
          if (removeIndex) {
            jobs.splice(removeIndex, 1)
          }
        } else {
          // update the job
          job.isRunningJob = updatedJob.isRunningJob
          job.noteName = updatedJob.noteName
          job.noteType = updatedJob.noteType
          job.interpreter = updatedJob.interpreter
          job.unixTimeLastRun = updatedJob.unixTimeLastRun
          job.paragraphs = updatedJob.paragraphs
        }
      }
    })
    this.filterJobs(jobs, this.filterConfig)
  }


  //********** JOB **************//
  lastExecuteTime(timestamp) {
    return moment.unix(timestamp / 1000).fromNow()
  }

  getRunningState(isRunningJob) {
    return isRunningJob? 'RUNNING' : 'READY'
  }

  getProgress(paragraphs) {
    let result = this.getProgressCount(paragraphs)
    return `${result}%`
  }

  getProgressCount(paragraphs) {
    let paragraphStatuses = paragraphs.map(p => p.status)
    let runningOrFinishedParagraphs = paragraphStatuses.filter(status => {
      return status === ParagraphStatus.RUNNING || status === ParagraphStatus.FINISHED
    })

    let totalCount = paragraphStatuses.length
    let runningCount = runningOrFinishedParagraphs.length
    let result = Math.ceil(runningCount / totalCount * 100)
    result = isNaN(result) ? 0 : result

    return result
  }

  showPercentProgressBar(paragraphs) {
    return this.getProgressCount(paragraphs) > 0 && this.getProgressCount(paragraphs) < 100
  }

  runJob(noteId) {
    let self = this;
    self.confirmationService.confirm({
      message: 'Run all paragraphs?',
      header: 'Job Dialog',
      icon: 'fa fa-delete',
      accept: () => {
        self.jobManagerService.sendRunJobRequest(noteId)
          .subscribe(
            response => {
              /*let message = (response.data && response.data.message)
                ? response.data.message : 'SERVER ERROR'
              */
            },
            errorResponse => {
              console.log('Error %o', errorResponse)
              self.showErrorDialog('Execution Failure', errorResponse)
            }
          );
      },
      reject: () => {
      }
    });
  }

  stopJob(noteId) {
    let self = this;
    self.confirmationService.confirm({
      message: 'Stop all paragraphs?',
      header: 'Job Dialog',
      icon: 'fa fa-delete',
      accept: () => {
        self.jobManagerService.sendStopJobRequest(noteId)
          .subscribe(
            response => {
              /*let message = (response.data && response.data.message)
                ? response.data.message : 'SERVER ERROR'
              */
            },
            errorResponse => {
              console.log('Error %o', errorResponse)
              self.showErrorDialog('Execution Failure', errorResponse)
            }
          );
      },
      reject: () => {
      }
    });
  }

  showErrorDialog(title, errorMessage) {
    if (!errorMessage) { errorMessage = 'SERVER ERROR' }
    this.messageService.add({severity:'error', summary:title, detail:errorMessage});
  }

  getJobTypeIcon(noteType) {
    if (noteType === 'normal') {
      return 'fa fa-file-text-o'
    } else if (noteType === 'cron') {
      return 'fa fa-clock-o'
    } else {
      return 'fa fa-question-circle-o'
    }
  }

  getInterpreterName(interpreter) {
    return typeof interpreter === 'undefined'
      ? 'interpreter is not set' : interpreter
  }

  getInterpreterNameStyle(interpreter) {
    return typeof interpreter === 'undefined'
      ? { color: 'gray' } : { color: 'black' }
  }

}
