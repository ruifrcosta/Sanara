import React from 'react';

const Clients = () => {
  return (
    <div className="flex flex-col items-center py-20 px-[156px] bg-white">
      <p className="text-xl text-[#6F767E] mb-12">
        4,000+ companies already growing
      </p>

      <div className="grid grid-cols-4 gap-8 w-full">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-[200px] h-[80px] bg-[#F1F4F9] rounded-xl mb-4" />
            <p className="text-base font-medium text-[#1A1D1F]">Techlify</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clients; 