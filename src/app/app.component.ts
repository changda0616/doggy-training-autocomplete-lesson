import { Post } from './interface/post';
import {
  Component
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

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

  constructor(private http: HttpClient) {}

  getSuggestList(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    this.http.get(this.api + target.value).pipe(
      finalize(() => {
        // 每一個 request 收到成功 response 隨即結束
        console.log('complete');
      })
    ).subscribe((value: Post[]) => {
      this.suggestList = value;
    });
  }

  decreaseActiveIdx() {
    if (this.activeIndex === null) {
      this.activeIndex = 0;
    } else {
      this.activeIndex += 1;
    }
  }

  increaseActiveIdx() {
    if (this.activeIndex === null) {
      this.activeIndex = 0;
    } else {
      this.activeIndex -= 1;
    }
  }

  updateInput() {
    this.inputText = this.suggestList[this.activeIndex].title;
  }
}
