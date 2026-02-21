# Orbit Labels — counter-rotate для читаемого текста

## Проблема

Вращающаяся орбита (`BusinessCoverageGraph`) применяет `transform: rotate(...)` к общей группе узлов. Текст внутри узлов наследует это вращение и при углах 90–270° оказывается перевёрнутым или倾斜ным.

## Решение: counter-rotate (контр-поворот)

Текст остаётся «upright» за счёт компенсирующего поворота на `-rotationAngle` внутри каждого узла.

### Структура

```
rotateGroup (<g> с --orbit-rot)
├── GraphEdges
└── BusinessNode (×8)
    ├── circle (hit area)
    ├── circle (node visual)
    ├── circle? (pulse)
    └── NodeLabel (<g>)
        └── text
```

- **rotateGroup**: `transform="rotate(angle cx cy)"` + `--orbit-rot` (обновляется в rAF)
- **NodeLabel**: `transform: rotate(calc(-1 * var(--orbit-rot, 0) * 1deg))` + `transform-origin: (position.x, position.y)`

### Где менять

| Место | Файл | Описание |
|------|------|----------|
| rAF loop | `components/hero/BusinessCoverageGraph.tsx` | `g.style.setProperty("--orbit-rot", String(angle))` — обновление переменной |
| NodeLabel wrapper | `BusinessNode` | `<g style={{ transform: "rotate(calc(-1 * var(--orbit-rot, 0) * 1deg))", transformOrigin: ... }}>` — контр-поворот вокруг центра узла |
| Угол | `layout.positions`, `pos.angle` | При смене логики позиционирования — проверить `transform-origin` и `baseAngle` |

### Производительность

- Нет `setState` на каждый кадр
- Обновляется одна CSS-переменная `--orbit-rot` в rAF на `rotateGroupRef`
- DOM не пересчитывается массово, только одно свойство на один элемент
