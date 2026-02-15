import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";

interface SearchResult {
  product_name: string;
  product_image: string;
  product_price: string;
  unit_quantity: string;
  store_details: {
    store_name: string;
    store_address: string;
    distance_from_zipcode: string;
    website: string;
  };
}

export function DealDetail({ deal, onBack }: { deal: SearchResult; onBack: () => void }) {
  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack} className="rounded-full px-6 border-gray-300">
        Back to Deals
      </Button>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <img src={deal.product_image} alt={deal.product_name} className="w-full rounded-3xl object-cover" />
        <div className="space-y-4">
          <h2>{deal.product_name}</h2>
          <div className="flex items-center gap-3">
            <span className="text-green-600">{deal.product_price}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{deal.unit_quantity}</span>
          </div>
          <p className="text-gray-600">{deal.store_details.store_name} • {deal.store_details.store_address} • {deal.store_details.distance_from_zipcode}</p>
          <div>
            <Button asChild variant="outline" className="rounded-full px-6 border-gray-300">
              <a href={deal.store_details.website} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Store Website
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
