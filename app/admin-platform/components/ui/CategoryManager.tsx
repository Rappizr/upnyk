"use client";

// ============================================================================
// CategoryManager.tsx — Template generik untuk semua halaman "Manajemen
// Kategori" (Kategori Usaha, Supplier, Bahan Baku, Limbah). Keempat halaman
// itu punya bentuk data & interaksi yang identik, jadi cukup satu komponen
// yang menerima konfigurasi berbeda-beda per halaman.
// ============================================================================
import { Badge, Button, Card, PageHeader, SearchInput, Table, TableCard, Td, Th, THead, Toolbar, Tr } from "./AdminUI";
import { Icon } from "./icons";

export interface CategoryRow {
  id: string;
  nama: string;
  totalItem: string;
  status: string;
}

export default function CategoryManager({
  title,
  subtitle,
  addLabel,
  totalLabel,
  searchPlaceholder,
  data,
}: {
  title: string;
  subtitle: string;
  addLabel: string;
  totalLabel: string;
  searchPlaceholder: string;
  data: CategoryRow[];
}) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={
          <Button icon={<Icon.Plus size={16} />}>{addLabel}</Button>
        }
      />

      <Toolbar>
        <SearchInput placeholder={searchPlaceholder} />
      </Toolbar>

      <TableCard>
        <Table>
          <THead>
            <Th>Kode</Th>
            <Th>Nama Kategori</Th>
            <Th>{totalLabel}</Th>
            <Th>Status</Th>
            <Th center>Aksi</Th>
          </THead>
          <tbody>
            {data.map((item) => (
              <Tr key={item.id}>
                <Td className="font-semibold text-[var(--color-text-muted)]">{item.id}</Td>
                <Td className="font-semibold">{item.nama}</Td>
                <Td className="text-[var(--color-text-muted)]">{item.totalItem}</Td>
                <Td>
                  <Badge variant="success">{item.status}</Badge>
                </Td>
                <Td center>
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="subtle" className="px-3 py-1.5 text-xs">Edit</Button>
                    <Button variant="dangerSubtle" className="px-3 py-1.5 text-xs">Hapus</Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableCard>

      {data.length === 0 && (
        <Card className="mt-4 text-center text-sm text-[var(--color-text-muted)]">Belum ada kategori. Tambahkan kategori pertama.</Card>
      )}
    </div>
  );
}
