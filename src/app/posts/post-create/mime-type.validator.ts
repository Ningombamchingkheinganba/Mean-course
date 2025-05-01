import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any } | null> | Observable<{ [key: string]: any } | null> => {
    if(typeof(control.value) === "string") {
        return of(null);
    }
  const file = control.value as File;
  const fileReader = new FileReader();

  const frObs = new Observable((observer: Observer<{ [key: string]: any } | null>) => {
    fileReader.addEventListener('loadend', () => {
      const array = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
      let header = '';
      let isValid = false;

      for (let i = 0; i < array.length; i++) {
        header += array[i].toString(16);
      }

      switch (header) {
        case '89504e47': // PNG
        case 'ffd8ffe0': // JPEG
        case 'ffd8ffe1':
        case 'ffd8ffe2':
        case 'ffd8ffe3':
        case 'ffd8ffe8':
          isValid = true;
          break;
        default:
          isValid = false;
          break;
      }

      if (isValid) {
        observer.next(null); // ✅ valid
      } else {
        console.log("here");
        
        observer.next({ invalidMimeType: true }); // ❌ invalid
      }

      observer.complete();
    });

    fileReader.readAsArrayBuffer(file);
  });

  return frObs;
};
