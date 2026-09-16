import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const meta = {
  title: "Primitives/Table",
  component: Table,
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Sample rows for the primitive catalog.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">ord_1001</TableCell>
          <TableCell>Ada Lovelace</TableCell>
          <TableCell>
            <Badge variant="secondary">completed</Badge>
          </TableCell>
          <TableCell className="text-right">$240.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">ord_1002</TableCell>
          <TableCell>Grace Hopper</TableCell>
          <TableCell>
            <Badge variant="outline">pending</Badge>
          </TableCell>
          <TableCell className="text-right">$80.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
