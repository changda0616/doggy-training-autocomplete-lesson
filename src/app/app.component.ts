import { Post } from './interface/post';
import {
  Component, OnInit, ViewChild, ElementRef
} from '@angular/core';

import { finalize, debounceTime, distinctUntilChanged, switchMap, map, tap, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { fromEvent, iif, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('tinput', { static: true }) inputEle: ElementRef;
  title = 'doggy-training-autocomplete';
  api = 'http://localhost:3000/posts?title_like=';
  inputText = '';
  activeIndex: number = null;
  suggestList: Post[] = [];

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.addInputListener();
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

  private getSuggestList(value: string) {
    return this.http.get(this.api + value).pipe(
      finalize(() => {
        // 每一個 request 收到成功 response 隨即結束
        console.log('complete');
      })
    );
  }

  private addInputListener() {
    fromEvent(this.inputEle.nativeElement, 'keyup').pipe(
      debounceTime(300),
      filter((e: KeyboardEvent) => e.key !== 'Enter'),
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
      switchMap((value) =>
        iif(
          () => !value,
          of([]),
          this.getSuggestList(value)))
    ).subscribe(
      (list: Post[]) => { this.suggestList = list; }
    );
  }
}
