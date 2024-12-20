import React from 'react';

const Benefits = () => {
  const points = [
    {
      percentage: '40%',
      description: 'Reduction in Storage Costs'
    },
    {
      percentage: '99%',
      description: 'Compression Efficiency Achieved'
    },
    {
      percentage: '80%',
      description: 'Reduction in Over-Provisioning'
    },
    {
      percentage: '4.5/5',
      description: 'Average User Satisfaction Rating'
    }
  ];

  return (
    <div className="flex flex-col items-center py-20 px-[156px] bg-white">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-[#1A1D1F] mb-4">
          Streamline Your Business with Our CRM Solution
        </h2>
        <p className="text-xl text-[#6F767E]">
          Discover the Features That Will Transform Your Customer Relationships
        </p>
      </div>

      <div className="grid grid-cols-4 gap-8 w-full">
        {points.map((point, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <h2 className="text-4xl font-bold text-[#006397] mb-2">
              {point.percentage}
            </h2>
            <p className="text-base text-[#6F767E]">
              {point.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Benefits; 