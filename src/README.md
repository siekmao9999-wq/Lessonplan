# ឯកសាររចនាសម្ព័ន្ធ SQL ក្នុង Supabase សម្រាប់ KrouPlan (Folder `src`)

ឯកសារទាំងនេះត្រូវបានបង្កើតឡើងសម្រាប់រៀបចំប្រព័ន្ធ Database លើ **Supabase (PostgreSQL)** សម្រាប់គម្រោង **KrouPlan (ប្រព័ន្ធបង្កើតកិច្ចតែងការបង្រៀន AI)** ដោយកំណត់ **លោកគ្រូ សៀក ម៉ៅ** ជា **Admin អចិន្ត្រៃយ៍**។

---

## មាតិកាក្នុង Folder `src/`

1. **`src/supabase/schema.sql`**
   - រចនាសម្ព័ន្ធតារាង SQL ពេញលេញ៖
     - `profiles`: ព័ត៌មានគណនីគ្រូ និង Admin (ភ្ជាប់ជាមួយ Supabase Auth `auth.users`)
     - `lesson_plans`: កិច្ចតែងការបង្រៀន ៥ ជំហានស្តង់ដារ MoEYS + Full JSON Fidelity
     - `plan_reviews`: ប្រព័ន្ធត្រួតពិនិត្យ និងចុះត្រាអនុម័តដោយនាយកសាលា (សៀក ម៉ៅ)
     - `worksheets`: សន្លឹកកិច្ចការសិស្ស គាំទ្ររូបមន្តគណិតវិទ្យា MathType
     - `teaching_materials`: សម្ភារឧបទេសបន្ថែម (សង្ខេប, Flashcards, ពិសោធន៍)
   - **Triggers & Functions**៖
     - `protect_permanent_admin()`: ការពារលោកគ្រូ សៀក ម៉ៅ មិនឱ្យមានការទម្លាក់តួនាទី ឬដកសិទ្ធិ Admin
     - `prevent_delete_permanent_admin()`: ការពារការលុបគណនី Admin អចិន្ត្រៃយ៍
     - `handle_updated_at()`: អាប់ដេតកាលបរិច្ឆេទដោយស្វ័យប្រវត្តិ
     - `handle_new_auth_user()`: បង្កើត Profile ដោយស្វ័យប្រវត្តិកាលណាមាន User ចុះឈ្មោះ
   - **Row Level Security (RLS)**: ការពារសុវត្ថិភាពទិន្នន័យតាមគោលការណ៍តួនាទី (RBAC)
   - **View**: `view_school_analytics` សម្រាប់មើលស្ថិតិសាលារៀនរហ័ស

2. **`src/supabase/seed.sql`**
   - ទិន្នន័យគំរូដំបូង៖
     - គណនី **សៀក ម៉ៅ** (`siekmao9999@gmail.com`) ជា Admin អចិន្ត្រៃយ៍ (`is_permanent_admin = TRUE`)
     - គ្រូបង្រៀនគំរូ (អ្នកគ្រូ គីម សុខា, លោកគ្រូ ចាន់ ដារ៉ា, លោកគ្រូ ស៊ុន វិជ្ជា)
     - កិច្ចតែងការគំរូ NGS រូបវិទ្យាថ្នាក់ទី១០ ដែលបានអនុម័តរួចរាល់
     - សន្លឹកកិច្ចការគំរូជាមួយរូបមន្ត MathType

3. **`src/supabase/types.ts`**
   - TypeScript Interface `Database` សម្រាប់ប្រើប្រាស់ជាមួយ Supabase Client (`@supabase/supabase-js`)

4. **`src/supabase/client.ts`**
   - ជំនួយការតភ្ជាប់ Supabase Client

---

## របៀបដំណើរការក្នុង Supabase Dashboard

1. បង្កើតគម្រោងថ្មីនៅលើ [Supabase Dashboard](https://supabase.com/dashboard)
2. ចូលទៅកាន់ម៉ឺនុយ **SQL Editor**
3. ចុច **New query**
4. ចម្លង (Copy) ខ្លឹមសារពីឯកសារ `src/supabase/schema.sql` រួច Paste ចូល និងចុច **RUN**
5. បន្ទាប់មក ចម្លងខ្លឹមសារពីឯកសារ `src/supabase/seed.sql` រួច Paste ចូល និងចុច **RUN**
6. ទិន្នន័យតារាង និងគណនី Admin អចិន្ត្រៃយ៍ «សៀក ម៉ៅ» នឹងត្រូវបានរៀបចំរួចរាល់ ១០០%!
