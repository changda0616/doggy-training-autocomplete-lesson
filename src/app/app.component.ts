import { Post } from './interface/post';
import { Component } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'doggy-training-autocomplete';
  api = 'http://localhost:3000/posts?title_like=';
  suggestList: Post[] = [];
  constructor(
    private http: HttpClient
  ) { }

  getSuggestList(value: string) {
    if (!value) {
      this.suggestList = [];
      return;
    }
    this.http.get(this.api + value).pipe(
      finalize(() => {
        // 每一個 request 收到成功 response 隨即結束
        console.log('complete');
      })
    ).subscribe(
      (list: Post[]) => {
        this.suggestList = list;
      }
    );
  }

}
