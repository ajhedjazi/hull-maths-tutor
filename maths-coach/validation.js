export const statuses = {new:'New',in_progress:'In Progress',answered:'Answered',discuss_in_lesson:'Discuss in Lesson'};
export const helpTypes = {start:'I don’t know how to start',halfway:'I’m stuck halfway',check:'Can you check my answer?',explanation:'I don’t understand the explanation'};
export function validateImage(file) {
 if (!file || file.size === 0) return;
 if (!['image/jpeg','image/png','image/webp'].includes(file.type)) throw new Error('Choose a JPG, PNG or WebP photo.');
 if (file.size > 8 * 1024 * 1024) throw new Error('Your photo must be 8 MB or smaller.');
}
export function validateQuestion(text,help,note,file) {
 validateImage(file);
 if (!text.trim() && !file?.size) throw new Error('Add a photo or type your question.');
 if (!Object.hasOwn(helpTypes,help)) throw new Error('Choose where you are stuck.');
 if (text.length > 6000 || note.length > 2000) throw new Error('Please shorten your question or note.');
}
