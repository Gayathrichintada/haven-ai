import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableItem({
  id,
  index,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(
      transform
    ),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="
        bg-white/10
        border
        border-white/10
        rounded-2xl
        p-4
        flex
        items-center
        gap-4
        cursor-grab
        active:cursor-grabbing
        hover:bg-white/15
        transition
      "
    >
      <div className="w-10 h-10 rounded-full bg-green-500 text-black flex items-center justify-center font-bold">
        {index + 1}
      </div>

      <span className="text-lg">
        {id}
      </span>
    </div>
  );
}