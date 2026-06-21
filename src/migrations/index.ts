import * as migration_20260617_171645_initial from './20260617_171645_initial';
import * as migration_20260621_063045_add_students_and_lesson_content from './20260621_063045_add_students_and_lesson_content';

export const migrations = [
  {
    up: migration_20260617_171645_initial.up,
    down: migration_20260617_171645_initial.down,
    name: '20260617_171645_initial',
  },
  {
    up: migration_20260621_063045_add_students_and_lesson_content.up,
    down: migration_20260621_063045_add_students_and_lesson_content.down,
    name: '20260621_063045_add_students_and_lesson_content'
  },
];
