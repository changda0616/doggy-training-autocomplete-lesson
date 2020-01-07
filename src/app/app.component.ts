import { Post } from './interface/post';
import {
  Component
} from '@angular/core';

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

  inputText = '';
  activeIndex: number = null;
  suggestList: Post[] = [];

  constructor(
    private http: HttpClient
  ) { }

  getSuggestList(value: string) {
    this.inputText = value;
    if (!value) {
      this.clearList();
      return;
    }
    this.http.get(this.api + value).pipe(
      finalize(() => {
        // 每一個 request 收到成功 response 隨即結束
        console.log('complete');
      })
    ).subscribe((val: Post[]) => {
      this.suggestList = val;
    });
  }

  decreaseActiveIdx() {
    if (this.activeIndex === null) {
      this.activeIndex = 0;
    } else if (this.activeIndex === 0) {
      this.activeIndex = this.suggestList.length - 1;
    } else {
      this.activeIndex -= 1;
    }
  }

  increaseActiveIdx() {
    if (this.activeIndex === null) {
      this.activeIndex = 0;
    } else if (this.activeIndex === this.suggestList.length - 1) {
      this.activeIndex = 0;
    } else {
      this.activeIndex += 1;
    }
  }

  updateInput(index?) {
    this.inputText = this.suggestList[index || this.activeIndex].title;
    this.clearList();
  }

  private clearList() {
    this.activeIndex = null;
    this.suggestList = [];
  }
}
