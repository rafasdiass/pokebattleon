import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
})
export class LoadingPage implements OnInit {
  loading: any;

  constructor(public loadingController: LoadingController) { }

  ngOnInit() {
    // this.presentLoading();
  }

  // async presentLoading() {
  //   this.loading = await this.loadingController.create({
  //     message: 'Loading...',
  //     duration: 7000
  //   });
  //   await this.loading.present();

  //   const { role, data } = await this.loading.onDidDismiss();
  //   console.log('Loading dismissed!');
  // }

  // async dismissLoading() {
  //   if (this.loading) {
  //     await this.loading.dismiss();
  //   }
  // }
}
