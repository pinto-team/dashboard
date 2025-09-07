import { JSX } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import NestedDraggableList from '@/features/categories/components/NestedDraggableList';

export default function AddCategoryPage(): JSX.Element {
  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col gap-4 p-6 md:gap-6 md:p-8 lg:p-10">
        <NestedDraggableList />
      </div>
    </DashboardLayout>
  );
}
