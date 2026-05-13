export function CategoryPills({ categories, activeCategory = 'Todos', onSelect }) {
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
      {categories.map((category) => (
        <button
          className={activeCategory === category ? 'pill active' : 'pill'}
          type="button"
          key={category}
          onClick={() => onSelect?.(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
