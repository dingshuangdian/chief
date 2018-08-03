import { Component } from '@angular/core';
import { ViewController, ToastController } from 'ionic-angular';


@Component({
  selector: 'add-project-popover',
  templateUrl: 'add-project-popover.html'
})
export class addProjectPopoverComponent {

  addProject: any = { project: true, service: true };

  constructor(public viewCtrl: ViewController, public toastCtrl: ToastController) {

  }

  close(type) {
    if (type)
      if (this.addProject.project || this.addProject.service)
        this.viewCtrl.dismiss(this.addProject);
      else
        this.presentToast();
    else
      this.viewCtrl.dismiss();
  }


  presentToast() {
    let toast = this.toastCtrl.create({
      message: '产品和工时必须选择一个',
      position: 'middle',
      duration: 2000
    });
    toast.present();
  }



}
