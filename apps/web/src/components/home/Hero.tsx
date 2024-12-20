import React from 'react';

const Hero = () => {
  return (
    <div className="flex justify-between items-center px-[156px] py-20 bg-white">
      <div className="flex flex-col gap-8 max-w-[600px]">
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-[#F1F4F9] rounded-full text-sm font-medium">
            One Kit, Endless
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#F1F4F9] rounded-full text-sm font-medium">
            🎉 Possibilities
          </div>
        </div>

        <h1 className="text-5xl font-bold leading-tight text-[#1A1D1F]">
          Build Beautiful SaaS App Faster with SaasAble
        </h1>

        <div className="w-16 h-1 bg-[#006397]" />

        <p className="text-xl text-[#6F767E]">
          Design front-end marketing pages and powerful admin dashboards with ease using our UI Kit
        </p>

        <div className="flex flex-col gap-6">
          <button className="flex justify-center items-center px-6 py-3 w-[180px] bg-[#006397] rounded-full">
            <span className="text-base font-semibold text-white">Get Started</span>
          </button>

          <div className="flex flex-wrap gap-3">
            {['typescript', 'Next.Js', 'JWT', 'React', 'Figma'].map((tech) => (
              <div
                key={tech}
                className="px-4 py-2 bg-[#F1F4F9] rounded-full text-sm font-medium text-[#42474E]"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center">
        <div className="w-[600px] h-[500px] bg-[#F1F4F9] rounded-2xl">
          {/* Placeholder for hero image */}
        </div>
      </div>
    </div>
  );
};

export default Hero; 