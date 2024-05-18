import { Component, Input, OnInit, inject, input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemReorderEventDetail } from '@ionic/angular';
import { Task } from 'src/app/models/task.model';
import { user } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent  implements OnInit {

  @Input() task: Task

  user = {} as user;

  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService)


  form = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', [Validators.required, Validators.minLength(4)]),
    description: new FormControl('', [Validators.required, Validators.minLength(4)]),
    items: new FormControl([], [Validators.required, Validators.minLength(1)]),
  })

  constructor() { }

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');

    if (this.task) {
      this.form.setValue(this.task)
      this.form.updateValueAndValidity();
    }
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.form.value.items = ev.detail.complete(this.form.value.items);
  }

  removeItem(index: number){
    this.form.value.items.splice(index, 1);
    this.form.updateValueAndValidity();
  }

}
