
# 📚 book_store_api_ai

واجهة API ذكية تستخدم OpenRouter للتفاعل مع نماذج الذكاء الاصطناعي مثل GPT وClaude وMistral، وتُستخدم في تطبيقات مثل التوصية بالكتب، مراجعة المحتوى، وخدمة العملاء.

---

## 🚀 نظرة عامة

تم إعداد هذا المشروع باستخدام [OpenRouter](https://openrouter.ai)، وهو وسيط API يتيح لك التفاعل مع مجموعة واسعة من نماذج الذكاء الاصطناعي عبر نقطة نهاية واحدة، باستخدام المفتاح الخاص التالي:

```
API KEY: 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
```

> ⚠️ **تحذير**: لا تشارك مفتاح API في بيئات عامة أو GitHub. استخدمه فقط في بيئة تطوير آمنة.

---

## ⚙️ الإعداد السريع

### ✅ نقطة النهاية:
```
POST https://openrouter.ai/api/v1/chat/completions
```

### ✅ رؤوس الطلب (Headers):

```json
{
  "Authorization": "Bearer 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",
  "Content-Type": "application/json",
  "HTTP-Referer": "book-store.ai",  
  "X-Title": "book_store_api_ai"
}
```

---

## 📤 الجسم (Body):

```json
{
  "model": "openai/gpt-3.5-turbo",
  "messages": [
    { "role": "system", "content": "أنت مساعد مخصص لمكتبة كتب ذكية" },
    { "role": "user", "content": "اقترح لي كتابًا في تطوير الذات" }
  ]
}
```

---

## 🧪 مثال عملي بـ `curl`:

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-3.5-turbo",
    "messages": [
      { "role": "user", "content": "ما هو أفضل كتاب عن التسويق؟" }
    ]
  }'
```

---

## 🔍 أمثلة على الموديلات المدعومة

| النموذج         | المعرف                      |
| --------------- | --------------------------- |
| GPT-3.5 Turbo   | `openai/gpt-3.5-turbo`      |
| GPT-4           | `openai/gpt-4`              |
| Claude 3 Sonnet | `anthropic/claude-3-sonnet` |
| Mistral Mixtral | `mistralai/mixtral-8x7b`    |
| Command R+      | `cohere/command-r-plus`     |

---

## ✅ حالات استخدام المشروع

* ✅ التوصية بكتب مخصصة بناءً على اهتمام المستخدم
* ✅ تحليل مراجعات الكتب بلغة طبيعية
* ✅ توليد أوصاف كتب تلقائيًا
* ✅ محادثة دردشة مع "مساعد افتراضي للمكتبة"

---

## 📌 ملاحظات

* لا تنس تفعيل الفوترة بحسابك في OpenRouter إذا كنت تستخدم نماذج مدفوعة.
* يمكنك التبديل بين النماذج بسهولة فقط بتغيير `"model"` في جسم الطلب.
* استخدم المتغيرات البيئية `.env` لحماية مفاتيحك بدلًا من تضمينها مباشرة في الكود.

---

## 🚀 التطوير المحلي

### المتطلبات
- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### الخطوات
```sh
# استنساخ المستودع
git clone <YOUR_GIT_URL>

# الانتقال إلى مجلد المشروع
cd <YOUR_PROJECT_NAME>

# تثبيت التبعيات
npm i

# تشغيل خادم التطوير
npm run dev
```

---

## 🛠️ التقنيات المستخدمة

- **Vite** - أداة بناء سريعة
- **TypeScript** - لغة برمجة مع أنواع ثابتة
- **React** - مكتبة واجهة المستخدم
- **shadcn-ui** - مكونات واجهة مستخدم
- **Tailwind CSS** - إطار عمل CSS
- **OpenRouter** - منصة الذكاء الاصطناعي

---

## 🌐 النشر والمشاركة

- **النشر**: افتح [Lovable](https://lovable.dev/projects/71aaa9f3-c071-41a7-9caa-6e104de096d7) واضغط Share → Publish
- **دومين مخصص**: اذهب إلى Project > Settings > Domains
- **GitHub**: اربط حسابك في GitHub لنقل الكود

---

🧠 تم إعداد هذا المشروع لتوفير تجربة ذكية وقابلة للتخصيص لزوار مكتبتك الرقمية.
