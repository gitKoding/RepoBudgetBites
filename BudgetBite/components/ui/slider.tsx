"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "./utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  const currentValue = React.useMemo(() => {
    const v = Array.isArray(value)
      ? value[0]
      : Array.isArray(defaultValue)
        ? (defaultValue as number[])[0]
        : min;
    return typeof v === "number" ? v : min;
  }, [value, defaultValue, min]);

  const percent = React.useMemo(() => {
    const range = max - min;
    if (range <= 0) return 0;
    return ((currentValue - min) / range) * 100;
  }, [currentValue, min, max]);

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-4 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5 bg-emerald-200",
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full bg-emerald-600",
          )}
        />
      </SliderPrimitive.Track>
      {/* Value bubble above thumb */}
      <div
        aria-hidden
        className="absolute -top-7 translate-x-[-50%] rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white shadow"
        style={{ left: `${percent}%` }}
      >
        {currentValue} {currentValue === 1 ? "mile" : "miles"}
      </div>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="ring-emerald-400/50 block size-6 shrink-0 rounded-full border border-emerald-600 bg-emerald-600 shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
