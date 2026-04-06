import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Field, FieldLabel } from "@ui/field";
import { NativeSelect, NativeSelectOption } from "@ui/native-select";

export function PaginationDemo() {
  return (
    <div className="flex flex-col items-start justify-start gap-8">
      <Pagination className="mx-0 w-fit">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="/#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="/#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="/#"
              isActive
            >
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="/#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="/#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <Pagination className="mx-0 w-fit">
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              isActive
            >
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">4</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">5</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <PaginationIconsOnly />
    </div>
  );
}

export function PaginationIconsOnly() {
  return (
    <div className="flex items-center justify-between gap-4">
      <Field
        orientation="horizontal"
        className="w-fit"
      >
        <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
        <NativeSelect defaultValue="25">
          <NativeSelectOption value="10">10</NativeSelectOption>
          <NativeSelectOption value="25">25</NativeSelectOption>
          <NativeSelectOption value="50">50</NativeSelectOption>
          <NativeSelectOption value="100">100</NativeSelectOption>
        </NativeSelect>
      </Field>
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
