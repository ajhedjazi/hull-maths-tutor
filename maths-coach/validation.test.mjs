import test from 'node:test';
import assert from 'node:assert/strict';
import {validateQuestion,validateImage} from './validation.js';
test('requires a question or a photo and a valid help choice',()=>{
 assert.throws(()=>validateQuestion('  ','start',''),/photo or type/);
 assert.throws(()=>validateQuestion('Solve x + 1 = 3','invalid',''),/where/);
 assert.doesNotThrow(()=>validateQuestion('Solve x + 1 = 3','start',''));
 assert.doesNotThrow(()=>validateQuestion('','check','',{size:1024,type:'image/jpeg'}));
});
test('rejects unsupported, oversized uploads and excessive text',()=>{
 assert.throws(()=>validateImage({size:10,type:'image/svg+xml'}),/JPG/);
 assert.throws(()=>validateImage({size:8388609,type:'image/png'}),/8 MB/);
 assert.throws(()=>validateQuestion('x'.repeat(6001),'halfway',''),/shorten/);
 assert.throws(()=>validateQuestion('x','halfway','x'.repeat(2001)),/shorten/);
});
