import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OrderPagination } from "@/components/orders/OrderPagination";
import type { Pagination } from "@/lib/schemas/query";

const meta = {
  title: "Orders/OrderPagination",
  component: OrderPagination,
} satisfies Meta<typeof OrderPagination>;

export default meta;

type Story = StoryObj<typeof meta>;

function PaginationPlayground({ initial }: { initial: Pagination }) {
  const [pagination, setPagination] = useState(initial);
  return (
    <OrderPagination
      pagination={pagination}
      onPageChange={(page) => setPagination((current) => ({ ...current, page }))}
    />
  );
}

export const Default: Story = {
  args: {
    pagination: { page: 2, pageSize: 10, total: 120, totalPages: 12 },
    onPageChange: () => {},
  },
  render: () => (
    <PaginationPlayground
      initial={{ page: 2, pageSize: 10, total: 120, totalPages: 12 }}
    />
  ),
};

export const FirstPage: Story = {
  args: {
    pagination: { page: 1, pageSize: 10, total: 120, totalPages: 12 },
    onPageChange: () => {},
  },
  render: () => (
    <PaginationPlayground
      initial={{ page: 1, pageSize: 10, total: 120, totalPages: 12 }}
    />
  ),
};

export const LastPage: Story = {
  args: {
    pagination: { page: 12, pageSize: 10, total: 120, totalPages: 12 },
    onPageChange: () => {},
  },
  render: () => (
    <PaginationPlayground
      initial={{ page: 12, pageSize: 10, total: 120, totalPages: 12 }}
    />
  ),
};

export const Empty: Story = {
  args: {
    pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
    onPageChange: () => {},
  },
};

export const WithEllipsis: Story = {
  args: {
    pagination: { page: 6, pageSize: 10, total: 120, totalPages: 12 },
    onPageChange: () => {},
  },
  render: () => (
    <PaginationPlayground
      initial={{ page: 6, pageSize: 10, total: 120, totalPages: 12 }}
    />
  ),
};
