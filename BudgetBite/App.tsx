import { useState } from 'react';
import { Search, ChevronRight, MapPin, ShoppingBag, Minus, Plus, Loader2, ChevronLeft, AlertCircle, ExternalLink, X } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
// Removed tab-specific detail components
import { Slider } from './components/ui/slider';
// Removed unused Select import

// Removed Tab type; simplifying UI to single view

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
  id?: number;
}

interface Recipe {
  id: number;
  name: string;
  time: string;
  servings: string;
  image: string;
}

interface Kitchen {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  image: string;
}

export default function App() {
  const [searchItem, setSearchItem] = useState('');
  const [zipCode, setZipCode] = useState('');
  // Removed selectedDeal/Recipe/Kitchen as tabs are removed
  const [searchResults, setSearchResults] = useState(null as SearchResult[] | null);
  const [searchError, setSearchError] = useState('');
  const [radiusMiles, setRadiusMiles] = useState(5);
  const [numberOfStores, setNumberOfStores] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchItemError, setSearchItemError] = useState('');
  const [zipCodeError, setZipCodeError] = useState('');

  const validateFields = (opts?: { forSubmit?: boolean }) => {
    const forSubmit = !!opts?.forSubmit;
    let siErr = '';
    let zipErr = '';

    const trimmedItem = String(searchItem || '').trim();
    const trimmedZip = String(zipCode || '').trim();

    if (forSubmit || trimmedItem) {
      const productPattern = /^[A-Za-z ]+$/;
      if (!productPattern.test(trimmedItem)) {
        siErr = 'Only letters and spaces are allowed.';
      } else if (trimmedItem.length < 2) {
        siErr = 'Please enter at least 2 characters.';
      }
    }

    if (forSubmit || trimmedZip) {
      const zipPattern = /^\d{5}(?:-\d{4})?$/;
      if (!zipPattern.test(trimmedZip)) {
        zipErr = 'Enter a ZIP as 5 digits or 5 digits-4 digits (e.g., 08873 or 08873-1234).';
      }
    }

    setSearchItemError(siErr);
    setZipCodeError(zipErr);
    if (!siErr && !zipErr) {
      setSearchError('');
    }
    return !(siErr || zipErr);
  };

  const deals: SearchResult[] = [
    {
      id: 1,
      product_name: 'Banana',
      product_price: '$2.00',
      unit_quantity: '1 lb',
      product_image: 'https://images.unsplash.com/photo-1573828235229-fb27fdc8da91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGJhbmFuYSUyMGZydWl0fGVufDF8fHx8MTc2MzQ2Mjg3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      store_details: {
        store_name: 'ALDI',
        store_address: '123 Main St, Somerset, NJ',
        distance_from_zipcode: '1.2 miles',
        website: 'https://www.aldi.us/'
      }
    },
    {
      id: 2,
      product_name: 'Organic Milk',
      product_price: '$3.50',
      unit_quantity: '1 gallon',
      product_image: 'https://images.unsplash.com/photo-1641320785764-17cd1ab58a42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwbWlsayUyMGNhcnRvbnxlbnwxfHx8fDE3NjM1MDI4NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      store_details: {
        store_name: 'Walmart',
        store_address: '456 Oak Ave, Somerset, NJ',
        distance_from_zipcode: '2.5 miles',
        website: 'https://www.walmart.com/'
      }
    },
    {
      id: 3,
      product_name: 'Fresh Bread',
      product_price: '$2.75',
      unit_quantity: '1 loaf',
      product_image: 'https://images.unsplash.com/photo-1663904460424-91895028aa9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGJyZWFkJTIwbG9hZnxlbnwxfHx8fDE3NjM0MDcyMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      store_details: {
        store_name: 'Target',
        store_address: '789 Elm Blvd, Somerset, NJ',
        distance_from_zipcode: '1.8 miles',
        website: 'https://www.target.com/'
      }
    },
    {
      id: 4,
      product_name: 'Greek Yogurt',
      product_price: '$4.25',
      unit_quantity: '32 oz',
      product_image: 'https://images.unsplash.com/photo-1691043795570-9478750e7fd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlayUyMHlvZ3VydCUyMGNvbnRhaW5lcnxlbnwxfHx8fDE3NjM1MDI4NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      store_details: {
        store_name: 'Whole Foods',
        store_address: '321 Pine St, Somerset, NJ',
        distance_from_zipcode: '3.2 miles',
        website: 'https://www.wholefoodsmarket.com/'
      }
    },
    {
      id: 5,
      product_name: 'Orange Juice',
      product_price: '$5.00',
      unit_quantity: '64 oz',
      product_image: 'https://images.unsplash.com/photo-1640213505284-21352ee0d76b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBqdWljZSUyMGJvdHRsZXxlbnwxfHx8fDE3NjM0Mzk2OTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      store_details: {
        store_name: 'ShopRite',
        store_address: '654 Cedar Rd, Somerset, NJ',
        distance_from_zipcode: '2.1 miles',
        website: 'https://www.shoprite.com/'
      }
    },
  ];

  const recipes: Recipe[] = [
    {
      id: 1,
      name: 'Mediterranean Veggie Bowl',
      time: '25 mins',
      servings: '4 servings',
      image: 'https://images.unsplash.com/photo-1529687815525-d5711d9a42df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwcmVjaXBlJTIwaW5ncmVkaWVudHN8ZW58MXx8fHwxNzYyMzg1NTU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 2,
      name: 'Fresh Garden Salad',
      time: '15 mins',
      servings: '2 servings',
      image: 'https://images.unsplash.com/photo-1714224247661-ee250f55a842?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGdyb2NlcmllcyUyMHZlZ2V0YWJsZXN8ZW58MXx8fHwxNzYyMzg1NTU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 3,
      name: 'Roasted Vegetable Medley',
      time: '35 mins',
      servings: '6 servings',
      image: 'https://images.unsplash.com/photo-1677784514802-33c5e3b6d80c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHByb2R1Y2UlMjBtYXJrZXR8ZW58MXx8fHwxNzYyMzg1NTU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
  ];

  const kitchens: Kitchen[] = [
    {
      id: 1,
      name: 'Green Leaf Kitchen',
      cuisine: 'Healthy • Organic',
      rating: 4.8,
      deliveryTime: '25-35 min',
      image: 'https://images.unsplash.com/photo-1606626101436-76fe23e00c5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2NhbCUyMHJlc3RhdXJhbnQlMjBraXRjaGVufGVufDF8fHx8MTc2MjM4NTU1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 2,
      name: 'Farm to Table Co.',
      cuisine: 'Local • Seasonal',
      rating: 4.9,
      deliveryTime: '30-40 min',
      image: 'https://images.unsplash.com/photo-1584093092919-3d551a9c5055?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc3RvcmUlMjBkZWFsc3xlbnwxfHx8fDE3NjIzODU1NTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id:3,
      name: 'The Local Plate',
      cuisine: 'American • Fresh',
      rating: 4.7,
      deliveryTime: '20-30 min',
      image: 'https://images.unsplash.com/photo-1628516163406-45619a567907?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZm9vZCUyMHNob3BwaW5nfGVufDF8fHx8MTc2MjM4NTU1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
  ];

  const handleSearch = async () => {
    // Validate before submit and surface inline errors
    const ok = validateFields({ forSubmit: true });
    if (!ok) {
      setSearchError('Please fix the highlighted fields.');
      setErrorMessage('');
      return;
    }

    setSearchError('');
    setErrorMessage('');
    setIsLoading(true);
    setCurrentPage(1);

    const payload = {
      product_name: searchItem,
      zip_code: zipCode,
      min_store_results: numberOfStores,
      radius_miles: radiusMiles,
    };

    try {
      const API_BASE = (import.meta as any)?.env?.VITE_API_BASE_URL || '';
      const url = `${API_BASE}/api/v1/search`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        throw new Error(`API error ${resp.status}`);
      }

      const data: any = await resp.json();
      const stores: any[] = (data && (data.stores_list || data.stores || [])) as any[];

      const toMoney = (v: any) => {
        if (typeof v === 'number') return `$${v.toFixed(2)}`;
        if (typeof v === 'string' && v) {
          const trimmed = v.trim();
          return trimmed.startsWith('$') ? trimmed : `$${trimmed}`;
        }
        return '';
      };
      const ensureUrl = (u: any) => {
        const s = String(u || '').trim();
        if (!s) return '';
        if (s.startsWith('http://') || s.startsWith('https://')) return s;
        return `https://${s}`;
      };

      const mapped: SearchResult[] = stores.map((item: any, idx: number) => {
        const productName = item?.product_name || item?.name || searchItem;
        const image =
          item?.product_image ||
          item?.image_url ||
          item?.image ||
          'https://images.unsplash.com/photo-1677784514802-33c5e3b6d80c?auto=format&fit=crop&w=800&q=60';
        const priceVal = item?.product_price ?? item?.price ?? item?.current_price;
        const unitQty = item?.unit_quantity || item?.unit || item?.quantity || item?.size || item?.package_size || '';

        const sName = item?.store_details?.store_name ?? item?.store ?? item?.store_name ?? 'Unknown Store';
        const sAddr = item?.store_details?.store_address ?? item?.address ?? item?.location ?? '';
        const sDistRaw = item?.store_details?.distance_from_zipcode ?? (item?.distance_miles ?? item?.distance);
        const sDist = typeof sDistRaw === 'number'
          ? `${sDistRaw.toFixed(1)} miles`
          : typeof sDistRaw === 'string' && sDistRaw
            ? sDistRaw
            : '';
        const sWeb = ensureUrl(item?.store_details?.website ?? item?.website ?? item?.store_url ?? '');

        return {
          id: idx + 1,
          product_name: productName,
          product_image: image,
          product_price: toMoney(priceVal) || '$-',
          unit_quantity: String(unitQty || '').trim(),
          store_details: {
            store_name: sName,
            store_address: sAddr,
            distance_from_zipcode: sDist || '—',
            website: sWeb,
          },
        } as SearchResult;
      });

      setSearchResults(mapped);
      setIsLoading(false);
    } catch (e: any) {
      const corsHint =
        e?.name === 'TypeError' || String(e?.message || '').includes('fetch')
          ? ' (If you see a CORS error, enable CORS on the API for http://localhost:5173)'
          : '';
      setErrorMessage(`Unable to fetch stores. ${e?.message || ''}${corsHint}`.trim());
      setSearchResults(null);
      setIsLoading(false);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStores = searchResults?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = searchResults ? Math.ceil(searchResults.length / itemsPerPage) : 0;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearAll = () => {
    setSearchItem('');
    setZipCode('');
    setSearchItemError('');
    setZipCodeError('');
    setSearchError('');
    setRadiusMiles(5);
    setNumberOfStores(3);
    setSearchResults(null);
    setErrorMessage('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-white p-2 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-emerald-600" />
              </div>
              <span className="tracking-tight text-white">UFA - Budget Bite</span>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <div className="flex-1 flex gap-2">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Enter a grocery item to search..."
                value={searchItem}
                onChange={(e: any) => {
                  const raw = e.target.value as string;
                  const productPattern = /^[A-Za-z ]*$/;
                  if (productPattern.test(raw)) {
                    setSearchItem(raw);
                    if (searchItemError) validateFields();
                  } else {
                    setSearchItemError('Only letters and spaces are allowed.');
                  }
                }}
                onBlur={() => validateFields()}
                onKeyDown={(e: any) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                aria-invalid={!!searchItemError}
                className={`w-full bg-white/80 border-emerald-300 focus:border-emerald-500 ${searchItemError ? 'border-red-500 focus:border-red-500 ring-2 ring-red-200 bg-red-50/40 ufa-shake' : ''}`}
              />
              {searchItemError && (
                <p className="mt-1 text-xs text-red-600">{searchItemError}</p>
              )}
            </div>
            <div className={`w-32 relative`}>
              <Input
                type="text"
                placeholder="Zip Code"
                value={zipCode}
                onChange={(e: any) => {
                  const raw = e.target.value as string;
                  const zipInputPattern = /^\d{0,5}(-\d{0,4})?$/;
                  if (zipInputPattern.test(raw)) {
                    setZipCode(raw);
                    if (zipCodeError) validateFields();
                  } else {
                    setZipCodeError('Use only numbers and an optional hyphen (##### or #####-####).');
                  }
                }}
                onBlur={() => validateFields()}
                onKeyDown={(e: any) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                inputMode="numeric"
                aria-invalid={!!zipCodeError}
                className={`w-full bg-white/80 border-emerald-300 focus:border-emerald-500 ${zipCodeError ? 'border-red-500 focus:border-red-500 ring-2 ring-red-200 bg-red-50/40' : ''}`}
              />
              {zipCodeError && (
                <p className="mt-1 text-xs text-red-600">{zipCodeError}</p>
              )}
            </div>
          </div>
          <Button
            onClick={handleSearch}
            size="icon"
            variant="ghost"
            className="shrink-0 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleClearAll}
            size="icon"
            variant="ghost"
            className="shrink-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            title="Clear All"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        {searchError && <p className="text-red-600 mt-2">{searchError}</p>}
        
        {/* Filter Controls */}
        <div className="max-w-2xl mx-auto mt-6 bg-emerald-50 border border-emerald-200 p-6 rounded-2xl">
          <p className="mb-4 text-emerald-800">Filter Results</p>
          <div className="grid md:grid-cols-2 gap-6">
              {/* Radius Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-emerald-700">Search Radius</label>
                  <span className="text-sm text-emerald-700">{radiusMiles} {radiusMiles === 1 ? 'mile' : 'miles'}</span>
                </div>
                <Slider
                  value={[radiusMiles]}
                  onValueChange={(value: any) => setRadiusMiles(value[0])}
                  max={25}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>1 mile</span>
                  <span>25 miles</span>
                </div>
              </div>

              {/* Store Counter */}
              <div className="space-y-3">
                <label className="text-sm text-emerald-700">Number of Stores</label>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => setNumberOfStores(Math.max(1, numberOfStores - 1))}
                    size="icon"
                    variant="outline"
                    className="h-10 w-10 rounded-full border-emerald-300 hover:bg-emerald-100"
                    disabled={numberOfStores <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 text-center">
                    <span className="text-2xl">{numberOfStores}</span>
                  </div>
                  <Button
                    onClick={() => setNumberOfStores(Math.min(10, numberOfStores + 1))}
                    size="icon"
                    variant="outline"
                    className="h-10 w-10 rounded-full border-emerald-300 hover:bg-emerald-100"
                    disabled={numberOfStores >= 10}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 text-center">Maximum 10 stores</p>
              </div>
            </div>
          </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-12">
            {isLoading ? (
              <div className="bg-gray-50 border-2 border-gray-300 rounded-3xl p-16 text-center">
                <Loader2 className="h-16 w-16 text-green-600 mx-auto mb-4 animate-spin" />
                <h3 className="mb-2">Searching for Stores...</h3>
                <p className="text-gray-600">
                  We're finding the best stores for "{searchItem}" in your area
                </p>
              </div>
            ) : errorMessage ? (
              <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-12 text-center">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="mb-2 text-red-700">Error Loading Deals</h3>
                <p className="text-red-600 mb-6">{errorMessage}</p>
                <Button 
                  onClick={handleSearch}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6"
                >
                  Try Again
                </Button>
              </div>
            ) : searchResults ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="mb-2">Search Results for "{searchItem}"</h2>
                        <p className="text-gray-600">Found {searchResults?.length ?? 0} {(searchResults?.length ?? 0) === 1 ? 'deal' : 'deals'} in zip code {zipCode}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600">Show:</label>
                          <select
                            value={itemsPerPage}
                            onChange={(e: any) => {
                              setItemsPerPage(Number(e.target.value));
                              setCurrentPage(1);
                            }}
                            className="px-3 py-1.5 border border-emerald-300 rounded-lg text-sm bg-white"
                          >
                            <option value={3}>3 per page</option>
                            <option value={6}>6 per page</option>
                            <option value={9}>9 per page</option>
                            <option value={12}>12 per page</option>
                          </select>
                        </div>
                        <Button
                          onClick={() => {
                            setSearchResults(null);
                            setSearchItem('');
                            setZipCode('');
                            setErrorMessage('');
                          }}
                          variant="outline"
                          className="rounded-full px-6 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                        >
                          Clear Search
                        </Button>
                      </div>
                    </div>
                
                {currentStores.length > 0 ? (
                  <>
                    {/* Search summary banner */}
                    <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-xl mb-4 flex items-center gap-2 justify-center">
                      <span className="font-medium">Search radius:</span>
                      <span>{radiusMiles} {radiusMiles === 1 ? 'mile' : 'miles'}</span>
                      <span className="text-gray-400">•</span>
                      <span className="font-medium">Stores:</span>
                      <span>{numberOfStores}</span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                      {currentStores.map((deal: any) => (
                        <div key={deal.id ?? `${deal.product_name}-${deal.store_details.store_name}-${deal.product_price}-${deal.store_details.distance_from_zipcode}`} className="group p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                          <div className="h-24 w-24 bg-emerald-100 rounded-xl overflow-hidden mb-3">
                            <ImageWithFallback
                              src={deal.product_image}
                              alt={deal.product_name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="space-y-3">
                            <div>
                              <h3 className="mb-1">{deal.product_name}</h3>
                              <p className="text-gray-600">{deal.store_details.store_name}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center gap-1 text-gray-500">
                                  <MapPin className="h-3.5 w-3.5" />
                                  <span className="text-sm text-gray-500">{deal.store_details.store_address}</span>
                                </div>
                                <span className="text-gray-400">•</span>
                                <span className="text-sm">{deal.store_details.distance_from_zipcode}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-emerald-600">{deal.product_price}</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600">{deal.unit_quantity}</span>
                            </div>
                            <div className="flex gap-3">
                              <Button asChild variant="outline" className="rounded-full px-4 border-emerald-300 text-emerald-700 hover:bg-emerald-50 w-full">
                                <a href={deal.store_details.website} target="_blank" rel="noreferrer">
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Visit Store
                                </a>
                              </Button>
                            </div>
                            {/* View Deal button removed as requested */}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-8">
                        <Button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          variant="outline"
                          size="icon"
                          className="rounded-full border-emerald-300 hover:bg-emerald-100"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <Button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            className={`rounded-full px-4 ${
                              currentPage === pageNum
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'border-emerald-300 hover:bg-emerald-100'
                            }`}
                          >
                            {pageNum}
                          </Button>
                        ))}

                        <Button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          variant="outline"
                          size="icon"
                          className="rounded-full border-emerald-300 hover:bg-emerald-100"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    <div className="text-center text-sm text-gray-600 mt-4">
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, searchResults?.length ?? 0)} of {searchResults?.length ?? 0} results
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center">
                    <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="mb-2">No Results Found</h3>
                    <p className="text-gray-600 mb-6">
                      We couldn't find any deals for "{searchItem}" in zip code {zipCode} within {radiusMiles} {radiusMiles === 1 ? 'mile' : 'miles'}.
                    </p>
                    <Button 
                      onClick={() => {
                        setSearchResults(null);
                        setSearchItem('');
                        setZipCode('');
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6"
                    >
                      Try Another Search
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="aspect-[4/3] bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl overflow-hidden">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1714224247661-ee250f55a842?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGdyb2NlcmllcyUyMHZlZ2V0YWJsZXN8ZW58MXx8fHwxNzYyMzg1NTU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Fresh groceries"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      Discover the best grocery deals in your area. We compare prices across multiple stores to help you save money on fresh produce, pantry staples, and everything in between. Find amazing discounts and special offers tailored to your neighborhood.
                    </p>
                    <Button 
                      onClick={() => {
                        const productInput = document.querySelector('input[placeholder="Enter a grocery item to search..."]') as HTMLInputElement;
                        if (productInput) productInput.focus();
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6"
                    >
                      <span>Find Deals Near You</span>
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="aspect-[4/3] bg-gradient-to-br from-teal-100 to-cyan-100 rounded-3xl overflow-hidden">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1677784514802-33c5e3b6d80c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHByb2R1Y2UlMjBtYXJrZXR8ZW58MXx8fHwxNzYyMzg1NTU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Fresh produce"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      Shop smarter with our price comparison tool. Enter your zip code and see best prices from local grocery stores, farmers markets, and specialty shops. Never overpay for your groceries again with our comprehensive deal finder.
                    </p>
                    <Button 
                      onClick={() => {
                        const productInput = document.querySelector('input[placeholder="Enter a grocery item to search..."]') as HTMLInputElement;
                        if (productInput) productInput.focus();
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6"
                    >
                      <span>Start Saving</span>
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
      </main>
    </div>
  );
}