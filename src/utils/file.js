import { isArray, contain, isObject } from './util';

export function getFileSize(file) {
    try {
        return file.size;
    } catch (e) {
        return -1;
    }
}

export function getFilename(file) {
  const filename = file.name;
  return filename.substring(filename.lastIndexOf('/'))
}

export function getFileNameExt(filename) {
    return filename.substr(filename.lastIndexOf(".") + 1);
}

export function validateFile({file, filename, size, exts}) {
  if(!file || !filename) return false;
  const filesize = getFileSize(file);
  if(filesize <= 0) return false;
    let validated = true;
    if(size !== undefined) {
        if(filesize > 0 && filesize > size) {
            validated = false;
        }
    }
    if(exts !== undefined && isArray(exts) && contain(exts, getFileNameExt(filename).toLowerCase()) < 0) {
        validated = false;
    }
    return validated;
}

export function validateFiles({files, size, exts}) {
  if(!files) return false;
  let isValid = true;
  let sizeIsObject = isObject(size);
  
  for(let i = 0; i < files.length; i++){
    const suffixName = getFileNameExt(files[i].name);
    isValid = validateFile({
        file:files[i], 
        filename: files[i].name, 
        size: sizeIsObject ? (size[suffixName] || size['default']): size, 
        exts: sizeIsObject ? ((size[suffixName] && [suffixName]) || exts) : exts
      });
    if(!isValid) break;
  }
  return isValid;
}

export const superbytes = (bytes, arg1, arg2) => {
 
    const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    bytes = Math.abs(bytes);
    let divider,
        si,
        digits = 0;
 
    if((arg1 === undefined) && (arg2 === undefined)) {
      divider = 1024;
      digits = 2;
    }
    if(typeof arg1 === 'boolean') {
      if(arg1) {
        divider = 1000;
      } else {
        divider = 1024;
      }
      if(typeof arg2 === 'number') {
        digits = arg2;
      } else {
        digits = 2;
      }
    } else if(typeof arg1 === 'number') {
      digits = arg1;
      if(typeof arg2 === 'boolean') {
        if(arg2) {
          divider = 1000;
        } else {
          divider = 1024;
        }
      } else {
        divider = 1024;
      }
    }
 
    if(Number.isFinite(bytes)) {
      if(bytes < divider) {
        let num = bytes;
        return `${num} ${UNITS[0]}`;
      }
 
      for(let i = 1; i <= 8; i++) {
        if(bytes >= Math.pow(divider, i) && bytes < Math.pow(divider, i+1)) {
          let num = (bytes/Math.pow(divider, i)).toFixed(digits);
          return `${num} ${UNITS[i]}`;
        }
      }
    }
  };