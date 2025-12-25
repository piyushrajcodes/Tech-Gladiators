import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip as ReactTooltip } from "react-tooltip";

const IndiaHeatmap = () => {
  const [tooltipContent, setTooltipContent] = useState("");

  const onMouseEnter = (geo, current = { value: "N/A" }) => {
    return () => {
      setTooltipContent(`${geo.properties.name}: ${current.value}`);
    };
  };

  const onMouseLeave = () => {
    setTooltipContent("");
  };
  const PROJECTION_CONFIG = {
    scale: 350,
    center: [78.9629, 22.5937]
  };
  const GEOGRAPHY_URL = "https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States";

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-white mb-4 text-center">Water-borne Diseases Prevalence in India</h3>
      <ReactTooltip>{tooltipContent}</ReactTooltip>
      <ComposableMap
        projectionConfig={PROJECTION_CONFIG}
        projection="geoMercator"
        width={600}
        height={600}
        data-tip=""
      >
        <Geographies geography={GEOGRAPHY_URL}>
          {({ geographies }) =>
            geographies.map(geo => {
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={onMouseEnter(geo)}
                  onMouseLeave={onMouseLeave}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <div className="flex justify-center space-x-4 mt-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 mr-2"></div>
          <span className="text-white">High</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-400 mr-2"></div>
          <span className="text-white">Medium</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-400 mr-2"></div>
          <span className="text-white">Low</span>
        </div>
      </div>
      <p className="text-sm text-gray-400 mt-4 text-center">
        This heatmap is a simplified representation and not based on real-time data.
      </p>
    </div>
  );
};

export default IndiaHeatmap;