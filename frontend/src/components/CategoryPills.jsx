export function CategoryPills({ categories, activeCategory = 'Todos', onSelect }) {
  const visibleCategories = categories.filter((category) => {
    const label = typeof category === 'string' ? category : category.name
    return label && label !== 'Todos'
  })

  return (
    <div className="pill-row">
      {onSelect ? (
        <button
          className={activeCategory === 'Todos' ? 'pill active' : 'pill'}
          type="button"
          onClick={() => onSelect('Todos')}
        >
          Todos
        </button>
      ) : null}
      {visibleCategories.map((category) => {
        const label = typeof category === 'string' ? category : category.name
        const value = typeof category === 'string' ? category : category.name

        return (
          <button
            className={activeCategory === value ? 'pill active' : 'pill'}
            type="button"
            key={typeof category === 'string' ? category : category.id ?? category.slug ?? category.name}
            onClick={() => onSelect?.(value)}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
