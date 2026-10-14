import { Button } from "@registry/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@registry/ui/card";
import { DirectionProvider } from "@registry/ui/direction";
import { Input } from "@registry/ui/input";
import { Label } from "@registry/ui/label";
import { useState } from "preact/hooks";

const translations = {
  en: {
    dir: "ltr",
    name: "English",
    values: {
      title: "Login to your account",
      description: "Enter your email below to login to your account",
      signUp: "Sign Up",
      email: "Email",
      emailPlaceholder: "m@example.com",
      password: "Password",
      forgotPassword: "Forgot your password?",
      login: "Login",
      loginWithGoogle: "Login with Google",
    },
  },
  ar: {
    dir: "rtl",
    name: "العربية",
    values: {
      title: "تسجيل الدخول إلى حسابك",
      description: "أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك",
      signUp: "إنشاء حساب",
      email: "البريد الإلكتروني",
      emailPlaceholder: "m@example.com",
      password: "كلمة المرور",
      forgotPassword: "نسيت كلمة المرور؟",
      login: "تسجيل الدخول",
      loginWithGoogle: "تسجيل الدخول باستخدام Google",
    },
  },
  he: {
    dir: "rtl",
    name: "עברית",
    values: {
      title: "התחבר לחשבון שלך",
      description: "הזן את האימייל שלך למטה כדי להתחבר לחשבון שלך",
      signUp: "הירשם",
      email: "אימייל",
      emailPlaceholder: "m@example.com",
      password: "סיסמה",
      forgotPassword: "שכחת את הסיסמה?",
      login: "התחבר",
      loginWithGoogle: "התחבר עם Google",
    },
  },
} as const;

type Language = keyof typeof translations;

export default function DirectionDemo() {
  const [language, setLanguage] = useState<Language>("ar");
  const { dir, values: t } = translations[language];

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex gap-2" role="group" aria-label="Language">
        {(Object.keys(translations) as Language[]).map((code) => (
          <Button
            key={code}
            type="button"
            size="sm"
            variant={code === language ? "default" : "outline"}
            aria-pressed={code === language}
            onClick={() => setLanguage(code)}
          >
            {translations[code].name}
          </Button>
        ))}
      </div>
      <DirectionProvider direction={dir}>
        <Card className="w-full" dir={dir}>
          <CardHeader>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
            <CardAction>
              <Button variant="link">{t.signUp}</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="direction-demo-email">{t.email}</Label>
                  <Input
                    id="direction-demo-email"
                    type="email"
                    placeholder={t.emailPlaceholder}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="direction-demo-password">{t.password}</Label>
                    <a
                      href="#"
                      className="ms-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      {t.forgotPassword}
                    </a>
                  </div>
                  <Input id="direction-demo-password" type="password" required />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              {t.login}
            </Button>
            <Button variant="outline" className="w-full">
              {t.loginWithGoogle}
            </Button>
          </CardFooter>
        </Card>
      </DirectionProvider>
    </div>
  );
}
