import * as React from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import NestedDraggableList from '@/features/categories/components/NestedDraggableList'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

const useT = () => {
    const dict: Record<string, string> = {
        'categories.title': 'دسته‌بندی‌ها',
        'categories.search_placeholder': 'جستجوی دسته‌بندی...',
        'categories.create': 'ایجاد دسته‌بندی',
        'common.search_hint': 'برای یافتن دسته‌بندی‌ها جستجو کنید',
        'common.showing_count': 'نمایش {{count}} مورد',
    }
    return (k: string, opt?: any) => (dict[k] || k).replace('{{count}}', String(opt?.count ?? ''))
}

export default function ListCategoriesPage() {
    const t = useT()
    const [query, setQuery] = React.useState('')
    const [count, setCount] = React.useState(0)
    const subtitle = count > 0 ? t('common.showing_count', { count }) : t('common.search_hint')

    const handleCreate = () => {
        // به دکمه‌ی مخفی داخل NestedDraggableList متصل است
        const addBtn = document.getElementById('add-root-from-body')
        addBtn?.dispatchEvent(new Event('click', { bubbles: true }))
    }

    return (
        <DashboardLayout>
            <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6" dir="rtl">
                <div className="flex items-center justify-between px-4 lg:px-6">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold">{t('categories.title')}</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search
                                aria-hidden="true"
                                className="pointer-events-none absolute top-1/2 -translate-y-1/2 size-4 text-muted-foreground [inset-inline-start:0.625rem]"
                            />
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={t('categories.search_placeholder')}
                                aria-label={t('categories.search_placeholder')}
                                className="w-72 [padding-inline-start:2rem]"
                            />
                        </div>
                        <Button onClick={handleCreate}>{t('categories.create')}</Button>
                    </div>
                </div>

                {subtitle && (
                    <div className="px-4 lg:px-6 -mt-2">
                        <p className="text-sm text-muted-foreground">{subtitle}</p>
                    </div>
                )}

                <div className="px-4 lg:px-6">
                    <NestedDraggableList
                        searchQuery={query}
                        onCountChange={setCount}
                        onAddRoot={() => {
                            /* telemetry */
                        }}
                    />
                </div>
            </div>
        </DashboardLayout>
    )
}
