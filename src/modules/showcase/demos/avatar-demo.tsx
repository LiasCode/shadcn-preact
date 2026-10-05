import { AvatarWithBadge as Example2 } from "../examples/avatar-badge";
import { AvatarBadgeIconExample as Example1 } from "../examples/avatar-badge-icon";
import Example3 from "../examples/avatar-basic";
import Example4 from "../examples/avatar-demo";
import { AvatarGroupExample as Example7 } from "../examples/avatar-group";
import { AvatarGroupCountExample as Example6 } from "../examples/avatar-group-count";
import { AvatarGroupCountIconExample as Example5 } from "../examples/avatar-group-count-icon";
import { AvatarSizeExample as Example8 } from "../examples/avatar-size";

export function AvatarDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-8">
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
      <Example5 />
      <Example6 />
      <Example7 />
      <Example8 />
    </div>
  );
}
