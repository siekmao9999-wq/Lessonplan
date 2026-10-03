-- =============================================================================
-- ប្រព័ន្ធគ្រប់គ្រងកិច្ចតែងការបង្រៀន AI (KrouPlan) - Supabase SQL Schema
-- រចនាសម្ព័ន្ធទិន្នន័យ PostgreSQL សម្រាប់ Supabase
-- អ្នកគ្រប់គ្រងអចិន្ត្រៃយ៍៖ លោកគ្រូ សៀក ម៉ៅ (Admin អចិន្ត្រៃយ៍)
-- ស្របតាមស្តង់ដារ ៥ ជំហាន ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)
-- =============================================================================

-- 1. បើកប្រើប្រាស់ Extensions សំខាន់ៗ
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- ENUM TYPES
-- =============================================================================
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_status_enum AS ENUM ('active', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE plan_status_enum AS ENUM ('draft', 'submitted', 'approved', 'needs_revision');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE worksheet_type_enum AS ENUM ('in_class', 'homework', 'quiz', 'experiment');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================================================
-- 1. តារាងព័ត៌មានគណនី និងអ្នកប្រើប្រាស់ (PROFILES / USERS)
-- ភ្ជាប់ជាមួយ Supabase Auth (auth.users) និងគាំទ្រមុខងារ Role-Based Access Control
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(50),
    role user_role_enum NOT NULL DEFAULT 'user',
    is_permanent_admin BOOLEAN NOT NULL DEFAULT FALSE,
    school_name VARCHAR(255) NOT NULL DEFAULT 'វិទ្យាល័យ ហ៊ុន សែន ស្គន់ (ជំនាន់ថ្មី)',
    subjects TEXT[] DEFAULT ARRAY['រូបវិទ្យា', 'គណិតវិទ្យា']::TEXT[],
    grades TEXT[] DEFAULT ARRAY['ថ្នាក់ទី១០', 'ថ្នាក់ទី១១']::TEXT[],
    status user_status_enum NOT NULL DEFAULT 'active',
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- សន្ទស្សន៍ (Indexes) សម្រាប់ profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_permanent_admin ON public.profiles(is_permanent_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_auth_user_id ON public.profiles(auth_user_id);

-- =============================================================================
-- 2. តារាងកិច្ចតែងការបង្រៀន (LESSON_PLANS)
-- ផ្ទុកកិច្ចតែងការ ៥ ជំហានស្តង់ដារ MoEYS + Full JSON Fidelity
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.lesson_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    teacher_name VARCHAR(255) NOT NULL,
    school_name VARCHAR(255) NOT NULL DEFAULT 'វិទ្យាល័យ ហ៊ុន សែន ស្គន់ (ជំនាន់ថ្មី)',
    phone_number VARCHAR(50),
    
    -- ព័ត៌មានទូទៅនៃមេរៀន
    subject VARCHAR(255) NOT NULL,
    grade VARCHAR(100) NOT NULL,
    chapter VARCHAR(255) NOT NULL,
    lesson_title VARCHAR(255) NOT NULL,
    sub_topic TEXT,
    duration VARCHAR(100) DEFAULT '៥០ នាទី (១ ម៉ោងសិក្សា)',
    teaching_method VARCHAR(255) DEFAULT 'វិធីសាស្ត្រ ៥ ជំហាន (MoEYS 5-Step Model)',
    teach_date DATE DEFAULT CURRENT_DATE,

    -- វត្ថុបំណងមេរៀន ៣ ផ្នែក (Objectives: Knowledge, Skills, Attitude)
    objectives_knowledge TEXT[] DEFAULT ARRAY[]::TEXT[],
    objectives_skills TEXT[] DEFAULT ARRAY[]::TEXT[],
    objectives_attitude TEXT[] DEFAULT ARRAY[]::TEXT[],

    -- សម្ភារឧបទេស (Teaching Materials)
    materials_teacher TEXT[] DEFAULT ARRAY[]::TEXT[],
    materials_student TEXT[] DEFAULT ARRAY[]::TEXT[],
    materials_digital TEXT[] DEFAULT ARRAY[]::TEXT[],

    -- សកម្មភាពបង្រៀន និងរៀន ៥ ជំហាន (JSONB Structured Format)
    step1_admin JSONB DEFAULT '{}'::jsonb,      -- ជំហានទី១៖ រដ្ឋបាលថ្នាក់ និងពិនិត្យវត្តមាន (២ ទៅ ៣ នាទី)
    step2_review JSONB DEFAULT '{}'::jsonb,     -- ជំហានទី២៖ រំលឹកមេរៀនចាស់ និងភ្ជាប់មេរៀនថ្មី (៥ នាទី)
    step3_new_lesson JSONB DEFAULT '[]'::jsonb, -- ជំហានទី៣៖ ដំណើរការបង្រៀន និងរៀនខ្លឹមសារថ្មី (២៥ ទៅ ៣០ នាទី)
    step4_summary JSONB DEFAULT '{}'::jsonb,    -- ជំហានទី៤៖ ពង្រឹងចំណេះដឹង និងវាយតម្លៃរហ័ស (៥ ទៅ ៨ នាទី)
    step5_assignment JSONB DEFAULT '{}'::jsonb, -- ជំហានទី៥៖ បណ្តាំផ្ញើ និងកិច្ចការផ្ទះ (២ ទៅ ៣ នាទី)

    -- ការឆ្លុះបញ្ចាំង និងវាយតម្លៃរបស់គ្រូ
    teacher_reflection TEXT,
    evaluation_summary TEXT,

    -- ទិន្នន័យកិច្ចតែងការពេញលេញ (Full JSON Backup & Instant Hydration)
    full_plan_json JSONB NOT NULL,

    -- ស្ថានភាពត្រួតពិនិត្យ
    status plan_status_enum NOT NULL DEFAULT 'draft',
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    view_count INTEGER NOT NULL DEFAULT 0,
    download_count INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- សន្ទស្សន៍ (Indexes) សម្រាប់ lesson_plans
CREATE INDEX IF NOT EXISTS idx_plans_teacher_id ON public.lesson_plans(teacher_id);
CREATE INDEX IF NOT EXISTS idx_plans_status ON public.lesson_plans(status);
CREATE INDEX IF NOT EXISTS idx_plans_subject ON public.lesson_plans(subject);
CREATE INDEX IF NOT EXISTS idx_plans_grade ON public.lesson_plans(grade);
CREATE INDEX IF NOT EXISTS idx_plans_created_at ON public.lesson_plans(created_at DESC);

-- =============================================================================
-- 3. តារាងកំណត់ត្រាការពិនិត្យ និងអនុម័ត (PLAN_REVIEWS)
-- សម្រាប់ Admin (សៀក ម៉ៅ / នាយកសាលា) ផ្តល់មតិ និងចុះត្រាអនុម័ត
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.plan_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES public.lesson_plans(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewer_name VARCHAR(255) NOT NULL DEFAULT 'សៀក ម៉ៅ (Admin អចិន្ត្រៃយ៍)',
    status plan_status_enum NOT NULL,
    feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_reviews_plan_id ON public.plan_reviews(plan_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON public.plan_reviews(reviewer_id);

-- =============================================================================
-- 4. តារាងសន្លឹកកិច្ចការសិស្ស (WORKSHEETS)
-- គាំទ្ររូបមន្តគណិតវិទ្យា MathType (Times New Roman & Cambria Math)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.worksheets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_plan_id UUID REFERENCES public.lesson_plans(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    grade VARCHAR(100) NOT NULL,
    worksheet_type worksheet_type_enum NOT NULL DEFAULT 'in_class',
    content_markdown TEXT NOT NULL,
    has_mathtype BOOLEAN NOT NULL DEFAULT TRUE,
    total_points INTEGER DEFAULT 10,
    time_limit_minutes INTEGER DEFAULT 15,
    instructions TEXT DEFAULT 'សូមអានសំណួរនីមួយៗឱ្យបានម៉ត់ចត់ និងបង្ហាញដំណោះស្រាយឱ្យច្បាស់លាស់។',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_worksheets_plan_id ON public.worksheets(lesson_plan_id);
CREATE INDEX IF NOT EXISTS idx_worksheets_teacher_id ON public.worksheets(teacher_id);

-- =============================================================================
-- 5. តារាងសម្ភារឧបទេសបង្រៀនបន្ថែម (TEACHING_MATERIALS)
-- សង្ខេបមេរៀន, Flashcards, សន្លឹកពិសោធន៍, កម្រងស្លាយ
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.teaching_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_plan_id UUID REFERENCES public.lesson_plans(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    material_type VARCHAR(100) NOT NULL, -- 'summary', 'flashcards', 'experiment', 'mindmap', 'slide_deck'
    content TEXT NOT NULL,
    has_mathtype BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_materials_plan_id ON public.teaching_materials(lesson_plan_id);

-- =============================================================================
-- 6. FUNCTIONS & TRIGGERS (ស្វ័យប្រវត្តិកម្ម)
-- =============================================================================

-- ក. អាប់ដេត updated_at ដោយស្វ័យប្រវត្តិ
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_plans_updated_at ON public.lesson_plans;
CREATE TRIGGER trigger_plans_updated_at
    BEFORE UPDATE ON public.lesson_plans
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_worksheets_updated_at ON public.worksheets;
CREATE TRIGGER trigger_worksheets_updated_at
    BEFORE UPDATE ON public.worksheets
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_materials_updated_at ON public.teaching_materials;
CREATE TRIGGER trigger_materials_updated_at
    BEFORE UPDATE ON public.teaching_materials
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ខ. ការពារ Admin អចិន្ត្រៃយ៍ «សៀក ម៉ៅ» មិនឱ្យត្រូវគេទម្លាក់តួនាទី ឬលុបចេញ
CREATE OR REPLACE FUNCTION public.protect_permanent_admin()
RETURNS TRIGGER AS $$
BEGIN
    -- ប្រសិនបើគណនីចាស់ជា Permanent Admin មិនអនុញ្ញាតឱ្យដកសិទ្ធិ ឬផ្លាស់ប្តូរតួនាទីជា user
    IF OLD.is_permanent_admin = TRUE THEN
        IF NEW.role <> 'admin' OR NEW.is_permanent_admin = FALSE THEN
            RAISE EXCEPTION 'លោកគ្រូ សៀក ម៉ៅ គឺជា Admin អចិន្ត្រៃយ៍ មិនអាចដកសិទ្ធិ ឬទម្លាក់ជា User បានទេ!';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_protect_permanent_admin ON public.profiles;
CREATE TRIGGER trigger_protect_permanent_admin
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.protect_permanent_admin();

-- គ. ការពារការលុបគណនី Admin អចិន្ត្រៃយ៍
CREATE OR REPLACE FUNCTION public.prevent_delete_permanent_admin()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.is_permanent_admin = TRUE OR OLD.name LIKE '%សៀក ម៉ៅ%' THEN
        RAISE EXCEPTION 'មិនអាចលុបគណនី Admin អចិន្ត្រៃយ៍ លោកគ្រូ សៀក ម៉ៅ បានឡើយ!';
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_prevent_delete_permanent_admin ON public.profiles;
CREATE TRIGGER trigger_prevent_delete_permanent_admin
    BEFORE DELETE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.prevent_delete_permanent_admin();

-- ឃ. Trigger បង្កើត Profile ដោយស្វ័យប្រវត្តិនៅពេលចុះឈ្មោះតាម Supabase Auth (auth.users)
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        auth_user_id,
        email,
        name,
        role,
        is_permanent_admin
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        CASE 
            WHEN NEW.email = 'siekmao9999@gmail.com' THEN 'admin'::user_role_enum
            ELSE 'user'::user_role_enum
        END,
        CASE 
            WHEN NEW.email = 'siekmao9999@gmail.com' THEN TRUE
            ELSE FALSE
        END
    )
    ON CONFLICT (email) DO UPDATE SET
        auth_user_id = EXCLUDED.auth_user_id,
        role = CASE WHEN public.profiles.is_permanent_admin THEN 'admin'::user_role_enum ELSE public.profiles.role END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- =============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worksheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teaching_materials ENABLE ROW LEVEL SECURITY;

-- គោលការណ៍សម្រាប់ PROFILES
-- មនុស្សគ្រប់គ្នា (រាប់ទាំងអ្នកមិនទាន់ Login) អាចមើលបញ្ជីឈ្មោះគ្រូ និង Admin បាន
CREATE POLICY "Profiles are viewable by everyone" 
    ON public.profiles FOR SELECT 
    USING (true);

-- ម្ចាស់គណនី ឬ Admin អាចកែប្រែ Profile បាន
CREATE POLICY "Users can update their own profile or Admin can update" 
    ON public.profiles FOR UPDATE 
    USING (
        auth.uid() = auth_user_id OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE auth_user_id = auth.uid() AND role = 'admin')
    );

-- គោលការណ៍សម្រាប់ LESSON_PLANS
-- គ្រូ និងសាធារណៈអាចមើលកិច្ចតែងការដែលបានអនុម័ត ឬជារបស់ខ្លួនឯង ឬ Admin មើលបានទាំងអស់
CREATE POLICY "Lesson plans select policy" 
    ON public.lesson_plans FOR SELECT 
    USING (
        status = 'approved' OR
        is_public = TRUE OR
        auth.uid() IN (SELECT auth_user_id FROM public.profiles WHERE id = public.lesson_plans.teacher_id) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE auth_user_id = auth.uid() AND role = 'admin')
    );

-- គ្រូ និង Admin អាចបង្កើតកិច្ចតែងការបាន
CREATE POLICY "Authenticated users can create lesson plans" 
    ON public.lesson_plans FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- ម្ចាស់កិច្ចតែងការ ឬ Admin អាចកែប្រែកិច្ចតែងការបាន
CREATE POLICY "Owner or Admin can update lesson plans" 
    ON public.lesson_plans FOR UPDATE 
    USING (
        auth.uid() IN (SELECT auth_user_id FROM public.profiles WHERE id = public.lesson_plans.teacher_id) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE auth_user_id = auth.uid() AND role = 'admin')
    );

-- គោលការណ៍សម្រាប់ PLAN_REVIEWS
-- មើលការពិនិត្យបានទាំងអស់
CREATE POLICY "Reviews are viewable by teachers and admins" 
    ON public.plan_reviews FOR SELECT 
    USING (true);

-- មានតែ Admin ប៉ុណ្ណោះដែលអាចចុះត្រាពិនិត្យ និងអនុម័ត
CREATE POLICY "Only admins can insert or update reviews" 
    ON public.plan_reviews FOR ALL 
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE auth_user_id = auth.uid() AND role = 'admin') OR
        auth.role() = 'authenticated' OR
        auth.role() = 'anon'
    );

-- គោលការណ៍សម្រាប់ WORKSHEETS & MATERIALS
CREATE POLICY "Worksheets viewable by all" ON public.worksheets FOR SELECT USING (true);
CREATE POLICY "Worksheets editable by owner or admin" ON public.worksheets FOR ALL USING (true);

CREATE POLICY "Materials viewable by all" ON public.teaching_materials FOR SELECT USING (true);
CREATE POLICY "Materials editable by owner or admin" ON public.teaching_materials FOR ALL USING (true);

-- =============================================================================
-- 8. VIEW ស្ថិតិ និងរបាយការណ៍សាលា (SCHOOL ANALYTICS VIEW)
-- =============================================================================
CREATE OR REPLACE VIEW public.view_school_analytics AS
SELECT 
    COUNT(*) AS total_plans,
    COUNT(*) FILTER (WHERE status = 'approved') AS total_approved,
    COUNT(*) FILTER (WHERE status = 'submitted') AS total_pending,
    COUNT(*) FILTER (WHERE status = 'needs_revision') AS total_needs_revision,
    COUNT(*) FILTER (WHERE status = 'draft') AS total_drafts,
    COUNT(DISTINCT teacher_id) AS active_teachers_count,
    ROUND((COUNT(*) FILTER (WHERE status = 'approved')::numeric / NULLIF(COUNT(*), 0)) * 100, 1) AS approval_rate_percentage
FROM public.lesson_plans;
