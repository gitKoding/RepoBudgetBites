import { Button } from "./ui/button";

interface Kitchen {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  image: string;
}

export function KitchenDetail({ kitchen, onBack }: { kitchen: Kitchen; onBack: () => void }) {
  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack} className="rounded-full px-6 border-gray-300">
        Back to Kitchens
      </Button>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <img src={kitchen.image} alt={kitchen.name} className="w-full rounded-3xl object-cover" />
        <div className="space-y-4">
          <h2>{kitchen.name}</h2>
          <p className="text-gray-600">{kitchen.cuisine} • {kitchen.rating} ★ • {kitchen.deliveryTime}</p>
          <p className="text-gray-700">This is a placeholder for kitchen menu and details.</p>
        </div>
      </div>
    </div>
  );
}
