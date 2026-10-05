import { ItemAvatar as Example1 } from "../examples/item-avatar";
import { ItemDemo as Example2 } from "../examples/item-demo";
import { ItemGroupExample as Example3 } from "../examples/item-group";
import { ItemHeaderDemo as Example4 } from "../examples/item-header";
import { ItemIcon as Example5 } from "../examples/item-icon";
import { ItemImage as Example6 } from "../examples/item-image";
import { ItemLink as Example7 } from "../examples/item-link";
import { ItemSizeDemo as Example8 } from "../examples/item-size";
import { ItemVariant as Example9 } from "../examples/item-variant";

export function ItemDemo() {
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
      <Example9 />
    </div>
  );
}
