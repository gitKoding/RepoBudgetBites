import { Button } from "./ui/button";

interface Recipe {
  id: number;
  name: string;
  time: string;
  servings: string;
  image: string;
}

export function RecipeDetail({ recipe, onBack }: { recipe: Recipe; onBack: () => void }) {
  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack} className="rounded-full px-6 border-gray-300">
        Back to Recipes
      </Button>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <img src={recipe.image} alt={recipe.name} className="w-full rounded-3xl object-cover" />
        <div className="space-y-4">
          <h2>{recipe.name}</h2>
          <p className="text-gray-600">{recipe.time} • {recipe.servings}</p>
          <p className="text-gray-700">This is a placeholder for recipe details and steps.</p>
        </div>
      </div>
    </div>
  );
}
