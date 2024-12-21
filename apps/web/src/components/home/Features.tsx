import React from 'react';

const Features = () => {
  const features = [
    {
      title: 'WCAG Complaints',
      description: 'Ensure accessibility with WCAG compliant design for browsing.'
    },
    {
      title: 'SEO Friendly',
      description: 'Tailor typography for optimal readability across all screen sizes.'
    },
    {
      title: 'MUI Components',
      description: 'Customize Material 3 design MUI components for enhanced aesthetics.'
    },
    {
      title: 'High Performance UI',
      description: 'Adjust content layout for visual coherence on various screen sizes.'
    },
    {
      title: 'Detailed Documentation',
      description: 'Boost visibility with SEO-friendly features for better search rankings.'
    },
    {
      title: 'Regular Updates',
      description: 'Access comprehensive documentation for easy guidance on platform usage.'
    }
  ];

  return (
    <div className="flex flex-col items-center py-20 px-[156px] bg-[#F8FAFC]">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-[#1A1D1F] mb-4">
          Streamline Your Business with Our CRM Solution
        </h2>
        <p className="text-xl text-[#6F767E]">
          Discover the Features That Will Transform Your Customer Relationships
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8 w-full">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col p-8 bg-white rounded-2xl shadow-sm">
            <div className="w-12 h-12 mb-6 rounded-xl bg-[#006397]/10" />
            <div>
              <h3 className="text-xl font-bold text-[#1A1D1F] mb-2">
                {feature.title}
              </h3>
              <p className="text-base text-[#6F767E]">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features; 