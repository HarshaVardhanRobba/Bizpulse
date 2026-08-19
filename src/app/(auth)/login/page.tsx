import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center py-12">
      <SignIn signUpUrl="/sign-up" />
    </div>
  );
}
