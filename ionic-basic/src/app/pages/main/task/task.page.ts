import { Component, Input, OnInit, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Task } from "src/app/models/task.model";
import { UtilsService } from 'src/app/services/utils.service';
import { AddTaskComponent } from 'src/app/shared/components/add-task/add-task.component';


@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit {

  tasks: Task[] = [
    {
      id: "1",
      title: "Tarea 1",
      description: "Ejemplo de tarea 1",
      items: [
        {name: 'Actividad 1', completed: true},
        {name: 'Actividad 2', completed: false},
        {name: 'Actividad 3', completed: false}
      ]
    },
    {
      id: "2",
      title: "Tarea 2",
      description: "Ejemplo de tarea 2",
      items: [
        {name: 'Actividad 1', completed: true},
        {name: 'Actividad 2', completed: false},
        {name: 'Actividad 3', completed: false}
      ]
    },
    {
      id: "3",
      title: "Tarea 3",
      description: "Ejemplo de tarea 3",
      items: [
        {name: 'Actividad 1', completed: true},
        {name: 'Actividad 2', completed: false},
        {name: 'Actividad 3', completed: false}
      ]
    }
  ]

  constructor() { }

  ngOnInit() {
  }

  utilsSvc = inject(UtilsService);

  async addOrUpdateTask(task?: Task){

    await this.utilsSvc.presentModal({
      component: AddTaskComponent,
      componentProps: ( task ),
      cssClass: ''
    })
  }


}
