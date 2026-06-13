interface PageHeaderProps { title: string; description?: string; children?: React.ReactNode; }
export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (<header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h1>{description && <p className="mt-2 text-base text-muted">{description}</p>}</div>{children && <div className="flex shrink-0 gap-2">{children}</div>}</header>);
}
