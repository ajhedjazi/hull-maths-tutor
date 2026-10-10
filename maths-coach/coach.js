import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.4/+esm';
import {statuses,helpTypes,validateImage,validateQuestion} from './validation.js';
const $ = id => document.getElementById(id);
const config = window.HMT_SUPABASE_CONFIG;
let client,user,member,questions=[],selected=null,version=0;
const message = text => { $('message').textContent=text; };
const checked = result => {if(result.error) throw result.error; return result.data;};
function node(tag,text,className) {const n=document.createElement(tag); n.textContent=text; if(className)n.className=className; return n;}
function fail(error) {console.error('Maths Coach request failed',error?.code || error?.name); message(error instanceof Error && !error.code ? error.message : 'We couldn’t complete that request. Please try again. If it continues, contact Amir.');}
async function action(form,fn) {
 const buttons=[...form.querySelectorAll('button')];buttons.forEach(b=>b.disabled=true);
 try {await fn();}catch(e){fail(e);}finally{buttons.forEach(b=>b.disabled=false);}
}
async function upload(file) {
 validateImage(file); if(!file?.size)return null;
 const extension={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[file.type];
 const path=`${user.id}/${crypto.randomUUID()}.${extension}`;
 checked(await client.storage.from('coach-images').upload(path,file,{contentType:file.type,upsert:false})); return path;
}
async function photo(path,container,token) {
 if(!path)return;
 const data=checked(await client.storage.from('coach-images').createSignedUrl(path,300));
 if(token!==version)return;
 const img=document.createElement('img');img.src=data.signedUrl;img.alt='Uploaded maths question or annotated explanation';img.className='photo';container.append(img);
}
async function load() {
 const token=version;
 const data=checked(await client.from('coach_questions').select('*').order('created_at',{ascending:false}));
 if(token!==version)return;
 questions=data;
 const select=$('student-filter'),previous=select.value;select.replaceChildren(new Option('All students',''));
 [...new Set(questions.map(q=>q.student_id))].forEach(id=>select.add(new Option(id,id)));
 select.value=previous;render();
}
function render() {
 const list=$('questions');list.replaceChildren();
 const rows=questions.filter(q=>(!$('student-filter').value||q.student_id===$('student-filter').value)&&(!$('status-filter').value||q.status===$('status-filter').value)&&(! $('topic-filter').value||(q.topic||'').toLowerCase().includes($('topic-filter').value.toLowerCase()))&&(!$('date-filter').value||new Date(q.created_at).toLocaleDateString('en-CA')===$('date-filter').value));
 if(!rows.length)list.append(node('p','No questions here yet.'));
 rows.forEach(q=>{const b=node('button','','question');b.type='button';b.append(node('strong',q.question_text.slice(0,120)||'Photo question'),node('small',`${new Date(q.created_at).toLocaleString('en-GB')} · ${statuses[q.status]}${q.topic?' · '+q.topic:''}`));b.onclick=()=>action(list,()=>open(q.id));list.append(b);});
}
async function open(id) {
 const q=questions.find(q=>q.id===id);if(!q)return;selected=q;const token=++version;
 $('detail').hidden=false;const content=$('question-detail');content.replaceChildren(node('h2',helpTypes[q.help_type]),node('p',q.question_text,'text'),node('p',q.student_note,'text'),node('small',`${new Date(q.created_at).toLocaleString('en-GB')} · ${statuses[q.status]} · ${q.topic||'Topic to be added'}`));
 $('replies').replaceChildren();$('reply-form').reset();
 $('reply-form').hidden=$('triage').hidden=member.role!=='tutor';
 $('triage').elements.topic.value=q.topic||'';$('triage').elements.status.value=q.status;
 $('detail').focus();
 const replies=checked(await client.from('coach_replies').select('*').eq('question_id',id).order('created_at'));
 if(token!==version)return;
 if(!replies.length)$('replies').append(node('p','Your question is waiting for a reply from Amir.'));
 await photo(q.image_path,content,token);
 for(const r of replies){if(token!==version)return;const card=node('article','','reply');card.append(node('strong','Amir’s explanation'),node('p',r.body,'text'),node('small',new Date(r.created_at).toLocaleString('en-GB')));$('replies').append(card);await photo(r.attachment_path,card,token);}
}
async function session() {
 ++version;selected=null;member=null;questions=[];$('questions').replaceChildren();$('replies').replaceChildren();$('question-detail').replaceChildren();$('detail').hidden=true;$('portal').hidden=true;$('ask').hidden=true;
 user=checked(await client.auth.getSession())?.session?.user;
 $('login').hidden=!!user;$('logout').hidden=!user;
 if(!user)return;
 const token=version;
 const membership=checked(await client.from('coach_memberships').select('*').eq('user_id',user.id).maybeSingle());
 if(token!==version)return;
 member=membership;
 if(!member){message('Your portal access has not been arranged yet. Please contact Amir.');return;}
 $('portal').hidden=false;$('ask').hidden=member.role!=='student'||!member.guardian_consent_recorded_at;
 if(member.role==='student'&&!member.guardian_consent_recorded_at)message('Amir needs to confirm guardian consent before you can submit questions.');
 $('filters').hidden=member.role!=='tutor';$('history-title').textContent=member.role==='tutor'?'Tutor inbox':'My questions and replies';$('membership-label').textContent=member.role==='tutor'?'Tutor dashboard':'Included with your tuition';await load();
}
$('login-form').onsubmit=e=>{e.preventDefault();action(e.currentTarget,async()=>{checked(await client.auth.signInWithOtp({email:e.target.elements.email.value.trim(),options:{shouldCreateUser:false,emailRedirectTo:new URL('./',location.href).href}}));message('Check your email for a secure sign-in link.');});};
$('question-form').onsubmit=e=>{e.preventDefault();const form=e.currentTarget;action(form,async()=>{const f=form.elements;const text=f.question.value.trim(),note=f.note.value.trim(),help=f.help.value,file=f.image.files[0];validateQuestion(text,help,note,file);const image_path=await upload(file);checked(await client.from('coach_questions').insert({student_id:user.id,question_text:text,student_note:note,help_type:help,image_path}));form.reset();message('Your question has been sent to Amir. Check My questions and replies for your explanation.');await load();});};
$('triage').onsubmit=e=>{e.preventDefault();const form=e.currentTarget;const id=selected.id;action(form,async()=>{checked(await client.from('coach_questions').update({topic:form.elements.topic.value.trim()||null,status:form.elements.status.value}).eq('id',id).select('id').single());await load();await open(id);message('Question details saved.');});};
$('reply-form').onsubmit=e=>{e.preventDefault();const form=e.currentTarget;const id=selected.id;action(form,async()=>{if(!form.elements.approved.checked)throw new Error('Review and approve your explanation first.');const body=form.elements.body.value.trim();if(!body)throw new Error('Write your explanation before sending.');const attachment=await upload(form.elements.image.files[0]);checked(await client.rpc('coach_send_reply',{p_question_id:id,p_body:body,p_attachment_path:attachment}));form.reset();message('Your reviewed reply has been sent.');await load();await open(id);});};
$('logout').onclick=()=>action(document.querySelector('header'),async()=>{checked(await client.auth.signOut());await session();message('You have signed out.');});
$('refresh').onclick=()=>action($('portal'),async()=>{await load();if(selected)await open(selected.id);message('Questions and replies refreshed.');});
$('close-detail').onclick=()=>{++version;selected=null;$('detail').hidden=true;};
['student-filter','status-filter','topic-filter','date-filter'].forEach(id=>$(id).addEventListener('input',render));
try {
 if(window.HMT_SUPABASE_CONFIG_BLOCKED||!config?.url||!config?.anonKey)throw new Error('Portal connection is unavailable. Please contact Amir.');
 client=createClient(config.url,config.anonKey);await session();
 client.auth.onAuthStateChange((event)=>{if(['SIGNED_IN','SIGNED_OUT'].includes(event))setTimeout(()=>session().catch(fail),0);});
}catch(e){fail(e);$('login-form').querySelector('button').disabled=true;}
