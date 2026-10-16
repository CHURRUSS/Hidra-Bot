import {mkdir, readdir, copyFile} from 'node:fs/promises';
import {join} from 'node:path';
const files=await readdir('.');
await mkdir('www',{recursive:true});
const exts=new Set(['.html','.css','.js','.png','.svg','.webmanifest','.ico','.jpg','.jpeg','.webp']);
for(const file of files){
  if(file.startsWith('.') || !exts.has(file.slice(file.lastIndexOf('.')).toLowerCase()))continue;
  await copyFile(file,join('www',file));
}
console.log('Arquivos web preparados em www/');
