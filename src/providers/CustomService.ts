
import { BehaviorSubject } from 'rxjs/BehaviorSubject'


export class CustomService {
  selectType = '';
  customAttr: BehaviorSubject<string> = new BehaviorSubject<string>(this.selectType);
  constructor(
  
  ){}
}
