import * as migration_20260617_171645_initial from './20260617_171645_initial';
import * as migration_20260621_063045_add_students_and_lesson_content from './20260621_063045_add_students_and_lesson_content';
import * as migration_20260621_085446_add_student_phone_and_2fa from './20260621_085446_add_student_phone_and_2fa';
import * as migration_20260621_100000_add_quizzes from './20260621_100000_add_quizzes';
import * as migration_20260621_120000_seed_lesson_content from './20260621_120000_seed_lesson_content';

export const migrations = [
  {
    up: migration_20260617_171645_initial.up,
    down: migration_20260617_171645_initial.down,
    name: '20260617_171645_initial',
  },
  {
    up: migration_20260621_063045_add_students_and_lesson_content.up,
    down: migration_20260621_063045_add_students_and_lesson_content.down,
    name: '20260621_063045_add_students_and_lesson_content',
  },
  {
    up: migration_20260621_085446_add_student_phone_and_2fa.up,
    down: migration_20260621_085446_add_student_phone_and_2fa.down,
    name: '20260621_085446_add_student_phone_and_2fa',
  },
  {
    up: migration_20260621_100000_add_quizzes.up,
    down: migration_20260621_100000_add_quizzes.down,
    name: '20260621_100000_add_quizzes',
  },
  {
    up: migration_20260621_120000_seed_lesson_content.up,
    down: migration_20260621_120000_seed_lesson_content.down,
    name: '20260621_120000_seed_lesson_content',
  },
];
