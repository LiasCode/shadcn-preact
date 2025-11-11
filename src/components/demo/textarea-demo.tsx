import { Textarea } from "@/components/ui/textarea";
import { Button } from "@ui/button";
import { Label } from "@ui/label";

export function TextareaDemo() {
  return (
    <div className={"flex flex-row flex-wrap gap-8 *:max-w-sm"}>
      <Textarea placeholder="Type your message here." />
      <Textarea
        placeholder="Type your message here."
        disabled
      />

      <div className="grid w-full gap-3">
        <Label htmlFor="message">Your message</Label>
        <Textarea
          placeholder="Type your message here."
          id="message"
        />
      </div>

      <div className="grid w-full gap-3">
        <Label htmlFor="message-2">Your Message</Label>
        <Textarea
          placeholder="Type your message here."
          id="message-2"
        />
        <p className="text-muted-foreground text-sm">Your message will be copied to the support team.</p>
      </div>

      <div className="grid w-full gap-2">
        <Textarea placeholder="Type your message here." />
        <Button>Send message</Button>
      </div>
    </div>
  );
}
