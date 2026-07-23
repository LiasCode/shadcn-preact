import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";

const frameworks = [
  { value: "preact", label: "Preact" },
  { value: "react", label: "React" },
  { value: "solid", label: "Solid" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

export function ComboboxDemo() {
  return (
    <Combobox>
      <ComboboxTrigger placeholder="Select framework" />
      <ComboboxContent className="w-56">
        <ComboboxInput placeholder="Search framework..." />
        <ComboboxList>
          {frameworks.map((framework) => (
            <ComboboxItem value={framework.value}>{framework.label}</ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}