import { DocsLayout } from "@/components/Layout/DocsLayout";
import { InputOtpSection } from "./Sections/InputOtpSection";

export default function InputOtpPage() {
  return (
    <DocsLayout
      title="Input OTP"
      description="Accessible one-time password component with copy paste functionality."
    >
      <InputOtpSection />
    </DocsLayout>
  );
}
